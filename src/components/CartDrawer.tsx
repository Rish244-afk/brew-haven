"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalAmount, clearCart } =
    useCartStore();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const totalCents = getTotalAmount();
  const formattedTotal = (totalCents / 100).toFixed(2);

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg("Please enter your name and email to proceed.");
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
      setErrorMsg(err.message || "Something went wrong creating your checkout session.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1A1208] text-cream border-l border-latte/20 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-latte/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-latte" />
              <h2 className="font-serif text-2xl font-normal text-cream">Your Selection</h2>
            </div>
            <button
              onClick={closeCart}
              className="text-cream/60 hover:text-cream transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full border border-latte/30 flex items-center justify-center text-latte mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-xl text-cream mb-2">Your cart is empty</h3>
                <p className="text-xs text-cream/60 leading-relaxed mb-6 font-sans">
                  "Coffee is not rushed — it is respected." Explore our slow-brewed creations to begin your selection.
                </p>
                <Link
                  href="/menu"
                  onClick={closeCart}
                  className="font-sans text-[0.7rem] tracking-[0.2em] uppercase text-latte border border-latte px-6 py-3 hover:bg-latte hover:text-dark transition-all"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex gap-4 pb-6 border-b border-latte/10 items-center"
                >
                  {item.imageUrl && (
                    <div className="w-16 h-16 relative bg-espresso shrink-0 overflow-hidden border border-latte/20">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg text-cream truncate">{item.name}</h4>
                    <p className="text-xs text-latte font-mono">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-latte/30 text-xs">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="px-2 py-1 text-cream/70 hover:text-cream hover:bg-latte/20"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-mono text-cream">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="px-2 py-1 text-cream/70 hover:text-cream hover:bg-latte/20"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="text-cream/40 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-latte/15 bg-espresso/60 space-y-4">
              <div className="flex justify-between items-baseline font-serif text-lg text-cream">
                <span>Subtotal</span>
                <span className="text-2xl text-latte font-mono">${formattedTotal}</span>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 font-sans border border-red-500/30 p-2 bg-red-950/20">
                  {errorMsg}
                </p>
              )}

              <div className="pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full font-sans text-[0.72rem] tracking-[0.2em] uppercase bg-latte text-dark font-medium py-3.5 hover:bg-[#e6c88b] transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment Options</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
