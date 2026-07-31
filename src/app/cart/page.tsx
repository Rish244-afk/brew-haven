"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalAmount, clearCart } = useCartStore();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const totalCents = getTotalAmount();
  const formattedTotal = (totalCents / 100).toFixed(2);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg("Please enter your name and email address.");
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
      setErrorMsg(err.message || "Something went wrong initializing checkout.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-cream min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-full border border-latte flex items-center justify-center text-latte mb-6">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-4xl text-espresso mb-3 font-light">Your Cart is Empty</h1>
        <p className="text-mid text-xs md:text-sm max-w-md mb-8 leading-relaxed font-sans">
          "Coffee is not rushed — it is respected." Explore our artisanal menu to curate your quiet luxury selection.
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
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="eyebrow justify-center">Review & Checkout</div>
          <h1 className="font-serif text-5xl md:text-6xl text-espresso font-light">
            Your <em className="italic text-latte">Selection</em>
          </h1>
          <div className="w-12 h-[1px] bg-latte mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Items Table */}
          <div className="lg:col-span-2 bg-white border border-latte/20 shadow-sm p-6 md:p-8 space-y-6">
            <div className="hidden sm:grid grid-cols-12 pb-4 border-b border-latte/20 text-[0.65rem] tracking-[0.2em] uppercase text-latte font-medium">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            {items.map((item) => (
              <div
                key={item.menuItemId}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pb-6 border-b border-latte/10"
              >
                {/* Item Details */}
                <div className="sm:col-span-6 flex items-center gap-4">
                  {item.imageUrl && (
                    <div className="w-16 h-16 relative bg-espresso shrink-0 overflow-hidden border border-latte/20">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-serif text-xl text-espresso">{item.name}</h3>
                    <p className="text-xs text-mid line-clamp-1">{item.description}</p>
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="text-[0.65rem] text-red-500 hover:underline mt-1 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:col-span-2 text-left sm:text-center text-xs font-mono text-mid">
                  ${(item.price / 100).toFixed(2)}
                </div>

                {/* Quantity Controls */}
                <div className="sm:col-span-2 flex items-center justify-start sm:justify-center">
                  <div className="flex items-center border border-latte/30 text-xs">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="px-2 py-1 text-espresso hover:bg-latte/20"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-mono text-espresso font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="px-2 py-1 text-espresso hover:bg-latte/20"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="sm:col-span-2 text-left sm:text-right font-mono text-latte font-semibold text-sm">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Card */}
          <div className="bg-espresso text-cream p-8 border border-latte/20 shadow-luxury space-y-6">
            <h2 className="font-serif text-2xl text-cream pb-4 border-b border-latte/20">
              Order Summary
            </h2>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between text-cream/70">
                <span>Items Subtotal</span>
                <span className="font-mono text-cream">${formattedTotal}</span>
              </div>
              <div className="flex justify-between text-cream/70">
                <span>Taxes & Service</span>
                <span className="font-mono text-latte">Calculated at checkout</span>
              </div>
              <div className="pt-3 border-t border-latte/20 flex justify-between items-baseline">
                <span className="font-serif text-lg text-cream">Estimated Total</span>
                <span className="font-mono text-2xl text-latte">${formattedTotal}</span>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-sans border border-red-500/30 p-3 bg-red-950/30">
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleCheckout} className="space-y-4 pt-2">
              <div>
                <label className="block text-[0.65rem] uppercase tracking-widest text-latte mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-dark border border-latte/30 px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-latte"
                />
              </div>

              <div>
                <label className="block text-[0.65rem] uppercase tracking-widest text-latte mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="order-confirmation@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-dark border border-latte/30 px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-latte"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-sans text-[0.72rem] tracking-[0.2em] uppercase bg-latte text-dark font-medium py-4 hover:bg-[#e6c88b] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Initializing Payment..."
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
