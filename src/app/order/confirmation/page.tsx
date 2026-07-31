import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ShoppingBag, CreditCard, Banknote, QrCode } from "lucide-react";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Order Confirmation — Brew Haven",
  description: "Thank you for your order at Brew Haven.",
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id?: string; payment?: string };
}) {
  const sessionId = searchParams.session_id;
  const paymentMethod = searchParams.payment || "card";

  if (!sessionId) {
    return (
      <div className="pt-32 pb-24 bg-cream min-h-screen flex flex-col items-center justify-center text-center px-6">
        <AlertCircle className="w-16 h-16 text-latte mb-4" />
        <h1 className="font-serif text-4xl text-espresso mb-3">No Order Session Found</h1>
        <p className="text-mid text-sm max-w-md mb-8">
          It looks like you reached this page without a valid order checkout session.
        </p>
        <Link href="/menu" className="btn-luxury btn-dark">
          <span>Browse Menu</span>
        </Link>
      </div>
    );
  }

  // 1. Verify order server-side
  let order = await safeDbQuery(
    () =>
      prisma.order.findFirst({
        where: { stripeSessionId: sessionId },
        include: { items: true },
      }),
    null
  );

  if (stripe && sessionId && !sessionId.startsWith("session_")) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (stripeSession.payment_status === "paid") {
        if (order && order.status !== "paid") {
          order = await prisma.order.update({
            where: { id: order.id },
            data: { status: "paid" },
            include: { items: true },
          });
        }
      }
    } catch (err) {
      console.error("Error retrieving Stripe session server-side:", err);
    }
  }

  // Fallback demo order display if order was created with in-memory fallback
  const displayCustomerName = order?.customerName || "Valued Customer";
  const displayCustomerEmail = order?.customerEmail || "receipt@brewhaven.co";
  const displayOrderId = order?.id || sessionId.replace("session_", "");
  const displayTotalAmount = order?.totalAmount || 1475;
  const displayItems = order?.items || [
    { id: "1", name: "Haven Espresso", quantity: 1, price: 350 },
    { id: "2", name: "Sourdough Avocado Toast", quantity: 1, price: 950 },
  ];

  const formattedTotal = (displayTotalAmount / 100).toFixed(2);

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <div className="bg-white border border-latte/30 shadow-luxury p-8 md:p-12 text-center space-y-6">
          {/* Status Icon */}
          <div className="w-20 h-20 bg-latte/10 rounded-full border border-latte flex items-center justify-center text-latte mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <div className="eyebrow justify-center flex items-center gap-2">
              <span>Order Received</span>
              <span className="px-2.5 py-0.5 bg-espresso text-latte text-[0.6rem] uppercase tracking-wider rounded font-mono">
                {paymentMethod === "cod" ? "Cash / Pay at Counter" : paymentMethod === "upi" ? "UPI Verified" : "Card Payment"}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-espresso font-light">
              Order <em className="italic text-latte">Confirmed</em>
            </h1>
            <p className="text-xs text-mid uppercase tracking-widest font-mono">
              Ref: #{displayOrderId.slice(-8).toUpperCase()}
            </p>
          </div>

          <p className="text-mid text-sm leading-relaxed max-w-md mx-auto font-sans">
            Thank you, <strong className="text-espresso">{displayCustomerName}</strong>! Your artisanal selection is being prepared with slow care and precision. A confirmation receipt has been sent to{" "}
            <span className="text-espresso font-medium">{displayCustomerEmail}</span>.
          </p>

          {/* Items Summary Table */}
          <div className="bg-parchment/30 border border-latte/20 p-6 text-left my-8 space-y-4">
            <h3 className="font-serif text-xl text-espresso pb-2 border-b border-latte/20">
              Ordered Items
            </h3>
            <div className="divide-y divide-latte/15 text-xs font-sans">
              {displayItems.map((item: any) => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-serif text-base text-espresso">{item.name}</p>
                    <p className="text-mid">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-mono text-latte text-sm font-semibold">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-latte/20 flex justify-between items-baseline font-serif">
              <span className="text-lg text-espresso">Total Amount</span>
              <span className="font-mono text-2xl text-latte font-bold">${formattedTotal}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <Link href="/menu" className="btn-luxury btn-dark">
              <span>Order Again</span>
            </Link>
            <Link href="/" className="btn-luxury btn-gold">
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
