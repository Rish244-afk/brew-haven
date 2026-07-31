"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  QrCode,
  Banknote,
  Store,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export default function CheckoutPage() {
  const { items, getTotalAmount, clearCart } = useCartStore();

  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">("pickup");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const totalCents = getTotalAmount();
  const deliveryFeeCents = fulfillmentType === "delivery" ? 300 : 0; // $3.00 delivery fee
  const grandTotalCents = totalCents + deliveryFeeCents;

  const formattedSubtotal = (totalCents / 100).toFixed(2);
  const formattedDelivery = (deliveryFeeCents / 100).toFixed(2);
  const formattedGrandTotal = (grandTotalCents / 100).toFixed(2);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg("Please enter your name and email address.");
      return;
    }

    if (fulfillmentType === "delivery" && !address.trim()) {
      setErrorMsg("Please provide your delivery street address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          paymentMethod,
          fulfillmentType,
          address: fulfillmentType === "delivery" ? address : undefined,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong creating your checkout session.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-cream min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-full border border-latte flex items-center justify-center text-latte mb-6">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-4xl text-espresso mb-3 font-light">Your Selection is Empty</h1>
        <p className="text-mid text-xs md:text-sm max-w-md mb-8 leading-relaxed font-sans">
          Add items from our artisanal menu to proceed with your payment checkout.
        </p>
        <Link href="/menu" className="btn-luxury btn-dark">
          <span>Explore Menu</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="eyebrow justify-center">Starbucks Style Checkout</div>
          <h1 className="font-serif text-4xl md:text-5xl text-espresso font-light">
            Payment & <em className="italic text-latte">Order Details</em>
          </h1>
          <div className="w-12 h-[1px] bg-latte mx-auto" />
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact, Fulfillment & Payment Options */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Fulfillment Option (Pickup vs Delivery) */}
            <div className="bg-white border border-latte/20 shadow-sm p-6 md:p-8 space-y-4">
              <h2 className="font-serif text-2xl text-espresso flex items-center gap-3 border-b border-latte/15 pb-3">
                <span>1. Order Option</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFulfillmentType("pickup")}
                  className={`p-4 border text-left flex items-start gap-3 transition-all ${
                    fulfillmentType === "pickup"
                      ? "border-latte bg-espresso text-cream shadow-luxury"
                      : "border-espresso/20 text-espresso bg-cream/30 hover:border-espresso"
                  }`}
                >
                  <Store className="w-5 h-5 text-latte shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg leading-tight">Store Pickup</h3>
                    <p className="text-[0.7rem] text-cream/70 mt-1 font-sans">
                      Ready in 15 mins at 12 Quiet Lane
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType("delivery")}
                  className={`p-4 border text-left flex items-start gap-3 transition-all ${
                    fulfillmentType === "delivery"
                      ? "border-latte bg-espresso text-cream shadow-luxury"
                      : "border-espresso/20 text-espresso bg-cream/30 hover:border-espresso"
                  }`}
                >
                  <Truck className="w-5 h-5 text-latte shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg leading-tight">Doorstep Delivery</h3>
                    <p className="text-[0.7rem] text-cream/70 mt-1 font-sans">
                      Delivered in 30-45 mins (+$3.00)
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Customer Contact & Address Info */}
            <div className="bg-white border border-latte/20 shadow-sm p-6 md:p-8 space-y-4">
              <h2 className="font-serif text-2xl text-espresso flex items-center gap-3 border-b border-latte/15 pb-3">
                <span>2. Contact & Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-wider text-mid mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-cream/30 border border-latte/30 p-3 text-espresso focus:outline-none focus:border-latte"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] uppercase tracking-wider text-mid mb-2">
                    Email Address (for receipt) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-cream/30 border border-latte/30 p-3 text-espresso focus:outline-none focus:border-latte"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[0.65rem] uppercase tracking-wider text-mid mb-2">
                    Phone Number (SMS order alerts)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-cream/30 border border-latte/30 p-3 text-espresso focus:outline-none focus:border-latte"
                  />
                </div>

                {fulfillmentType === "delivery" && (
                  <div className="sm:col-span-2">
                    <label className="block text-[0.65rem] uppercase tracking-wider text-mid mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Street address, Apartment / Suite unit..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-cream/30 border border-latte/30 p-3 text-espresso focus:outline-none focus:border-latte"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3. Payment Method Selection (Starbucks / Zomato Style) */}
            <div className="bg-white border border-latte/20 shadow-sm p-6 md:p-8 space-y-5">
              <h2 className="font-serif text-2xl text-espresso flex items-center justify-between border-b border-latte/15 pb-3">
                <span>3. Select Payment Method</span>
                <span className="text-xs text-mid font-sans flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-latte" /> 256-Bit SSL Encrypted
                </span>
              </h2>

              <div className="space-y-3 font-sans">
                {/* Method 1: Credit/Debit Card */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border cursor-pointer transition-all flex items-start gap-4 ${
                    paymentMethod === "card"
                      ? "border-latte bg-espresso text-cream shadow-luxury"
                      : "border-espresso/20 text-espresso bg-cream/30 hover:border-espresso"
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-latte shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-normal">Credit / Debit Card</h3>
                      <span className="text-[0.65rem] uppercase tracking-wider text-latte font-mono">
                        Stripe Online Gateway
                      </span>
                    </div>
                    <p className="text-xs text-cream/70 mt-1 font-light">
                      Pay securely with Visa, Mastercard, American Express, or Discover.
                    </p>
                  </div>
                </div>

                {/* Method 2: UPI / QR Code */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 border cursor-pointer transition-all flex items-start gap-4 ${
                    paymentMethod === "upi"
                      ? "border-latte bg-espresso text-cream shadow-luxury"
                      : "border-espresso/20 text-espresso bg-cream/30 hover:border-espresso"
                  }`}
                >
                  <QrCode className="w-6 h-6 text-latte shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-normal">UPI / Google Pay / PhonePe</h3>
                      <span className="text-[0.65rem] uppercase tracking-wider text-latte font-mono">
                        Razorpay / Instant QR
                      </span>
                    </div>
                    <p className="text-xs text-cream/70 mt-1 font-light">
                      Instant mobile wallet & QR code scanning payment.
                    </p>
                  </div>
                </div>

                {/* Method 3: Cash on Delivery / Pay at Counter */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 border cursor-pointer transition-all flex items-start gap-4 ${
                    paymentMethod === "cod"
                      ? "border-latte bg-espresso text-cream shadow-luxury"
                      : "border-espresso/20 text-espresso bg-cream/30 hover:border-espresso"
                  }`}
                >
                  <Banknote className="w-6 h-6 text-latte shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-normal">
                        {fulfillmentType === "pickup" ? "Pay at Store Counter" : "Cash on Delivery"}
                      </h3>
                      <span className="text-[0.65rem] uppercase tracking-wider text-latte font-mono">
                        Pay Later
                      </span>
                    </div>
                    <p className="text-xs text-cream/70 mt-1 font-light">
                      {fulfillmentType === "pickup"
                        ? "Pay via cash or card when picking up your coffee at the counter."
                        : "Pay cash directly to the delivery barista upon arrival."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Items Breakdown & Complete Order CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-espresso text-cream p-6 md:p-8 border border-latte/20 shadow-luxury space-y-6 sticky top-24">
              <h2 className="font-serif text-2xl text-cream pb-4 border-b border-latte/20 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-mono text-latte font-normal">{items.length} items</span>
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 divide-y divide-latte/10">
                {items.map((item) => (
                  <div key={item.menuItemId} className="pt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="w-10 h-10 relative bg-dark shrink-0 overflow-hidden border border-latte/20">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-serif text-base text-cream">{item.name}</p>
                        <p className="text-[0.65rem] text-cream/50">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono text-latte font-semibold">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 pt-4 border-t border-latte/20 font-sans text-xs">
                <div className="flex justify-between text-cream/70">
                  <span>Subtotal</span>
                  <span className="font-mono text-cream">${formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-cream/70">
                  <span>Fulfillment ({fulfillmentType === "pickup" ? "Pickup" : "Delivery"})</span>
                  <span className="font-mono text-latte">
                    {deliveryFeeCents > 0 ? `$${formattedDelivery}` : "FREE"}
                  </span>
                </div>
                <div className="pt-3 border-t border-latte/20 flex justify-between items-baseline font-serif">
                  <span className="text-xl text-cream">Grand Total</span>
                  <span className="font-mono text-3xl text-latte font-bold">${formattedGrandTotal}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-sans">
                  {errorMsg}
                </div>
              )}

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-sans text-[0.75rem] tracking-[0.2em] uppercase bg-latte text-dark font-semibold py-4 hover:bg-[#e6c88b] transition-all flex items-center justify-center gap-2 shadow-gold disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Processing Order..."
                ) : (
                  <>
                    <span>
                      {paymentMethod === "card"
                        ? "Proceed to Pay $" + formattedGrandTotal
                        : paymentMethod === "upi"
                        ? "Pay via UPI $" + formattedGrandTotal
                        : "Confirm Cash Order $" + formattedGrandTotal}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
