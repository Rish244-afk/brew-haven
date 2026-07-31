import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // 1. Create Order in Database
    const order = await prisma.order.create({
      data: {
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        totalAmount,
        status: "pending",
        items: {
          create: validated.items.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 2. Stripe Integration
    if (stripe) {
      const lineItems = validated.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
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
        cancel_url: `${origin}/cart`,
        metadata: {
          orderId: order.id,
        },
      });

      // Update order with stripeSessionId
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({ url: session.url });
    }

    // 3. Fallback Test/Dev Direct Checkout (When Stripe keys are not set)
    const mockSessionId = `mock_session_${order.id}`;
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid", stripeSessionId: mockSessionId },
    });

    // Send confirmation email
    await sendOrderConfirmationEmail({
      toEmail: order.customerEmail,
      customerName: order.customerName,
      orderId: order.id,
      totalAmount: order.totalAmount,
      items: order.items,
    });

    return NextResponse.json({
      url: `${origin}/order/confirmation?session_id=${mockSessionId}`,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize checkout session" },
      { status: 400 }
    );
  }
}
