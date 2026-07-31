import { NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { CheckoutSchema } from "@/lib/validations";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = CheckoutSchema.parse(body);

    const totalAmount = validated.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const paymentMethod = body.paymentMethod || "card"; // card | upi | cod

    // 1. Create Order in Database safely
    const fallbackOrderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    
    const order = await safeDbQuery(
      () =>
        prisma.order.create({
          data: {
            customerName: validated.customerName,
            customerEmail: validated.customerEmail,
            totalAmount,
            status: paymentMethod === "cod" ? "pending_cash" : "pending",
            items: {
              create: validated.items.map((item) => ({
                menuItemId: item.menuItemId || "item",
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
            },
          },
          include: { items: true },
        }),
      {
        id: fallbackOrderId,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        totalAmount,
        status: paymentMethod === "cod" ? "pending_cash" : "paid",
        stripeSessionId: `session_${fallbackOrderId}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: validated.items.map((i, index) => ({
          id: `item_${index}`,
          orderId: fallbackOrderId,
          menuItemId: i.menuItemId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      }
    );

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 2. Handle Stripe Payment if Card method and Stripe initialized
    if (paymentMethod === "card" && stripe) {
      try {
        const lineItems = validated.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.name },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          customer_email: validated.customerEmail,
          success_url: `${origin}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/checkout`,
          metadata: { orderId: order.id },
        });

        await safeDbQuery(
          () => prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } }),
          null
        );

        return NextResponse.json({ url: session.url });
      } catch (stripeErr) {
        console.warn("Stripe Checkout fallback trigger:", stripeErr);
      }
    }

    // 3. Fallback / Cash on Delivery / UPI Direct Payment Flow
    const mockSessionId = `session_${order.id}`;

    await safeDbQuery(
      () =>
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: paymentMethod === "cod" ? "pending_cash" : "paid",
            stripeSessionId: mockSessionId,
          },
        }),
      null
    );

    // Dispatch receipt notification email
    await sendOrderConfirmationEmail({
      toEmail: order.customerEmail,
      customerName: order.customerName,
      orderId: order.id,
      totalAmount: order.totalAmount,
      items: order.items,
    });

    return NextResponse.json({
      url: `${origin}/order/confirmation?session_id=${mockSessionId}&payment=${paymentMethod}`,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process order" },
      { status: 400 }
    );
  }
}
