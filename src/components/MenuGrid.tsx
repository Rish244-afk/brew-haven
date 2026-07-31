"use client";

import { useState } from "react";
import Image from "next/image";
import { AddToCartButton } from "./AddToCartButton";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string | null;
  available: boolean;
}

export function MenuGrid({ initialItems }: { initialItems: MenuItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Items" },
    { id: "drinks", label: "Drinks" },
    { id: "food", label: "Food" },
    { id: "desserts", label: "Desserts" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? initialItems
      : initialItems.filter((item) => item.category.toLowerCase() === selectedCategory);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 border transition-all duration-300 ${
              selectedCategory === cat.id
                ? "bg-latte text-dark border-latte font-medium shadow-luxury"
                : "border-espresso/20 text-espresso/70 hover:border-espresso hover:text-espresso"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 text-mid">
          <p className="font-serif text-2xl mb-2">No items found in this category.</p>
          <p className="text-xs uppercase tracking-wider">Try selecting another filter above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-latte/20 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Image */}
                <div className="relative h-64 w-full bg-espresso overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream/40 font-serif">
                      Brew Haven
                    </div>
                  )}

                  {!item.available && (
                    <div className="absolute top-3 right-3 bg-red-900/90 text-cream font-sans text-[0.6rem] tracking-[0.15em] uppercase px-3 py-1">
                      Sold Out
                    </div>
                  )}
                  {item.available && (
                    <div className="absolute top-3 right-3 bg-espresso/80 text-latte font-sans text-[0.6rem] tracking-[0.15em] uppercase px-3 py-1 backdrop-blur-sm border border-latte/30">
                      {item.category}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-serif text-2xl text-espresso">{item.name}</h3>
                    <span className="font-mono text-latte font-semibold text-lg ml-4">
                      ${(item.price / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-mid leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <AddToCartButton item={item} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
