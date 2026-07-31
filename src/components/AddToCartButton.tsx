"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

interface AddToCartButtonProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string | null;
    available?: boolean;
  };
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isAvailable = item.available ?? true;

  const handleAdd = () => {
    if (!isAvailable) return;

    addItem({
      menuItemId: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!isAvailable) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 bg-espresso/10 text-cream/40 text-xs font-sans tracking-[0.15em] uppercase border border-cream/10 cursor-not-allowed text-center"
      >
        Currently Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-3 px-4 text-xs font-sans tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2 border ${
        added
          ? "bg-latte text-dark border-latte"
          : "border-latte/50 text-latte hover:bg-latte hover:text-dark hover:border-latte"
      }`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          <span>Added to Selection</span>
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          <span>Add to Selection</span>
        </>
      )}
    </button>
  );
}
