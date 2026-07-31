import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!stripe || !signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "paid",
          stripeSessionId: session.id,
        },
        include: { items: true },
      });

      // Send confirmation email
      await sendOrderConfirmationEmail({
        toEmail: order.customerEmail,
        customerName: order.customerName,
        orderId: order.id,
        totalAmount: order.totalAmount,
        items: order.items,
      });

      console.log(`✅ Order #${orderId} marked as PAID via Stripe Webhook`);
    }
  }

  return NextResponse.json({ received: true });
}
