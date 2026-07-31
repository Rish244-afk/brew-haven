"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gift, ChevronRight, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

interface GiftCardItem {
  id: string;
  title: string;
  category: "anytime" | "congratulations" | "thank_you";
  description: string;
  price: number;
  image: string;
}

const GIFT_CARDS: GiftCardItem[] = [
  {
    id: "gift-1",
    title: "India Exclusive",
    category: "anytime",
    description: "Bring in the festive season and make each celebration memorable with Brew Haven.",
    price: 500, // ₹500
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",
  },
  {
    id: "gift-2",
    title: "Brew Haven Coffee",
    category: "anytime",
    description: "Brew Haven is best when shared. Treat your pals to a good cup of artisanal coffee.",
    price: 1000,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80",
  },
  {
    id: "gift-3",
    title: "U Keep Me Warm",
    category: "anytime",
    description: "Captivating, cosy, coffee. Gift your loved ones this Brew Haven Gift Card.",
    price: 750,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&q=80",
  },
  {
    id: "gift-4",
    title: "Congrats",
    category: "congratulations",
    description: "Coffee. Cheer. Celebrate. Enjoy each of your special moments with Brew Haven.",
    price: 1500,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80",
  },
  {
    id: "gift-5",
    title: "Thank You So Much",
    category: "thank_you",
    description: "Express your warm gratitude with a delicious handcrafted coffee experience.",
    price: 500,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&q=80",
  },
];

export default function GiftCardsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "anytime" | "congratulations" | "thank_you">("all");
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const { addItem } = useCartStore();

  const handleAddGiftCard = (card: GiftCardItem) => {
    addItem({
      menuItemId: card.id,
      name: `Gift Card: ${card.title}`,
      description: card.description,
      category: "gift",
      price: card.price * 100,
      imageUrl: card.image,
    });
    setAddedItems((prev) => ({ ...prev, [card.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [card.id]: false }));
    }, 2000);
  };

  const filteredCards =
    activeTab === "all"
      ? GIFT_CARDS
      : GIFT_CARDS.filter((card) => card.category === activeTab);

  return (
    <div className="bg-cream min-h-screen font-sans">
      {/* Top Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-6 py-4 text-xs text-mid">
        <Link href="/" className="hover:text-espresso">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-espresso font-medium">Brew Haven Gift Cards</span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#103E2E] text-cream py-6 px-6 md:px-12 border-b border-latte/20">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-latte" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold">Brew Haven eGift Cards</h1>
          </div>
          <p className="text-xs text-cream/70 hidden sm:block">
            Share moments of luxury and coffee craft with friends & family
          </p>
        </div>
      </div>

      {/* Sub-navigation Category Filter Bar (Matching Screenshot) */}
      <div className="bg-parchment/60 border-b border-latte/20">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-8 py-3 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-1 transition-colors ${
              activeTab === "all"
                ? "text-[#103E2E] border-b-2 border-[#103E2E] font-bold"
                : "text-mid hover:text-espresso"
            }`}
          >
            FEATURED
          </button>

          <button
            onClick={() => setActiveTab("anytime")}
            className={`pb-1 transition-colors ${
              activeTab === "anytime"
                ? "text-[#103E2E] border-b-2 border-[#103E2E] font-bold"
                : "text-mid hover:text-espresso"
            }`}
          >
            ANYTIME
          </button>

          <button
            onClick={() => setActiveTab("congratulations")}
            className={`pb-1 transition-colors ${
              activeTab === "congratulations"
                ? "text-[#103E2E] border-b-2 border-[#103E2E] font-bold"
                : "text-mid hover:text-espresso"
            }`}
          >
            CONGRATULATIONS
          </button>

          <button
            onClick={() => setActiveTab("thank_you")}
            className={`pb-1 transition-colors ${
              activeTab === "thank_you"
                ? "text-[#103E2E] border-b-2 border-[#103E2E] font-bold"
                : "text-mid hover:text-espresso"
            }`}
          >
            THANK YOU
          </button>
        </div>
      </div>

      {/* Main Gift Cards List Sections */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 space-y-12">
        {/* Section 1: Anytime Cards */}
        {(activeTab === "all" || activeTab === "anytime") && (
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-[#103E2E]">Anytime</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {GIFT_CARDS.filter((c) => c.category === "anytime").map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl border border-latte/30 shadow-sm hover:shadow-luxury transition-all p-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Card Preview Image */}
                    <div className="relative h-44 w-full rounded-xl overflow-hidden shadow-md border border-latte/20">
                      <Image src={card.image} alt={card.title} fill className="object-cover" />
                      <div className="absolute top-3 left-3 bg-[#103E2E] text-cream text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1 rounded">
                        Brew Haven Card
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-espresso">{card.title}</h3>
                      <p className="text-xs text-mid mt-1 leading-relaxed">{card.description}</p>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-latte/15 mt-4">
                    <span className="font-mono text-lg font-bold text-[#103E2E]">₹{card.price}</span>
                    <button
                      onClick={() => handleAddGiftCard(card)}
                      className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        addedItems[card.id]
                          ? "bg-emerald-700 text-cream"
                          : "bg-[#103E2E] hover:bg-espresso text-cream shadow-md"
                      }`}
                    >
                      {addedItems[card.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>Add Item</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Congratulations Cards */}
        {(activeTab === "all" || activeTab === "congratulations") && (
          <div className="space-y-6 pt-6">
            <h2 className="font-serif text-3xl font-bold text-[#103E2E]">Congratulations</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {GIFT_CARDS.filter((c) => c.category === "congratulations").map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl border border-latte/30 shadow-sm hover:shadow-luxury transition-all p-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="relative h-44 w-full rounded-xl overflow-hidden shadow-md border border-latte/20">
                      <Image src={card.image} alt={card.title} fill className="object-cover" />
                      <div className="absolute top-3 left-3 bg-[#103E2E] text-cream text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1 rounded">
                        Brew Haven Card
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-espresso">{card.title}</h3>
                      <p className="text-xs text-mid mt-1 leading-relaxed">{card.description}</p>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-latte/15 mt-4">
                    <span className="font-mono text-lg font-bold text-[#103E2E]">₹{card.price}</span>
                    <button
                      onClick={() => handleAddGiftCard(card)}
                      className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        addedItems[card.id]
                          ? "bg-emerald-700 text-cream"
                          : "bg-[#103E2E] hover:bg-espresso text-cream shadow-md"
                      }`}
                    >
                      {addedItems[card.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>Add Item</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Thank You Cards */}
        {(activeTab === "all" || activeTab === "thank_you") && (
          <div className="space-y-6 pt-6">
            <h2 className="font-serif text-3xl font-bold text-[#103E2E]">Thank You</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {GIFT_CARDS.filter((c) => c.category === "thank_you").map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl border border-latte/30 shadow-sm hover:shadow-luxury transition-all p-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="relative h-44 w-full rounded-xl overflow-hidden shadow-md border border-latte/20">
                      <Image src={card.image} alt={card.title} fill className="object-cover" />
                      <div className="absolute top-3 left-3 bg-[#103E2E] text-cream text-[0.65rem] font-bold uppercase tracking-wider px-3 py-1 rounded">
                        Brew Haven Card
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-espresso">{card.title}</h3>
                      <p className="text-xs text-mid mt-1 leading-relaxed">{card.description}</p>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-latte/15 mt-4">
                    <span className="font-mono text-lg font-bold text-[#103E2E]">₹{card.price}</span>
                    <button
                      onClick={() => handleAddGiftCard(card)}
                      className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        addedItems[card.id]
                          ? "bg-emerald-700 text-cream"
                          : "bg-[#103E2E] hover:bg-espresso text-cream shadow-md"
                      }`}
                    >
                      {addedItems[card.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>Add Item</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
