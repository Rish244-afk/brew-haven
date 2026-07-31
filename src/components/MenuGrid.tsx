"use client";

import { useState } from "react";
import Image from "next/image";
import { AddToCartButton } from "./AddToCartButton";

export const DEFAULT_MENU_ITEMS = [
  // DRINKS
  {
    id: "item-1",
    name: "Haven Espresso",
    description: "Single-origin Ethiopian espresso, pulled slow with notes of bergamot & dark chocolate.",
    price: 350,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80",
    available: true,
  },
  {
    id: "item-2",
    name: "Cardamom Cortado",
    description: "Double shot espresso, velvety steamed milk, a whisper of crushed cardamom.",
    price: 475,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",
    available: true,
  },
  {
    id: "item-3",
    name: "Slow Pour Filter",
    description: "Rotating single-origin pour-over, brewed to order using V60 precision.",
    price: 500,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    available: true,
  },
  {
    id: "item-4",
    name: "Oat Honey Latte",
    description: "Creamy oat milk, organic wildflower honey, double espresso shot.",
    price: 550,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&q=80",
    available: true,
  },
  {
    id: "item-5",
    name: "Velvet Vanilla Cold Brew",
    description: "18-hour slow steeped cold brew topped with house vanilla bean sweet cream.",
    price: 575,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80",
    available: true,
  },
  {
    id: "item-6",
    name: "Iced Matcha Oat Latte",
    description: "Ceremonial grade Uji matcha, oat milk, subtle agave blossom sweetener.",
    price: 600,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80",
    available: true,
  },
  {
    id: "item-7",
    name: "Smoked Caramel Macchiato",
    description: "Layered espresso, steamed milk, artisan house-smoked caramel drizzle.",
    price: 625,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&q=80",
    available: true,
  },
  {
    id: "item-8",
    name: "Spanish Rose Latte",
    description: "Condensed milk, steamed whole milk, espresso, infused with delicate rose extract.",
    price: 600,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80",
    available: true,
  },

  // FOOD
  {
    id: "item-9",
    name: "Sourdough Avocado Toast",
    description: "Toasted house sourdough, smashed Hass avocado, chili oil, poached egg.",
    price: 950,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80",
    available: true,
  },
  {
    id: "item-10",
    name: "Herbed Egg Sandwich",
    description: "Soft scramble organic eggs, melted Gruyère cheese, herb butter, toasted brioche.",
    price: 875,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
    available: true,
  },
  {
    id: "item-11",
    name: "Roasted Veg Grain Bowl",
    description: "Warm farro, seasonal roasted root vegetables, kale, tahini lemon dressing.",
    price: 1050,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    available: true,
  },
  {
    id: "item-12",
    name: "Truffle Mushroom Panini",
    description: "Wild roasted mushrooms, fontina cheese, truffle oil, pressed sourdough toast.",
    price: 1100,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
    available: true,
  },
  {
    id: "item-13",
    name: "Smoked Salmon Bagel",
    description: "Everything bagel, dill cream cheese, wild smoked salmon, capers, pickled onion.",
    price: 1250,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    available: true,
  },

  // DESSERTS
  {
    id: "item-14",
    name: "Brown Butter Croissant",
    description: "Laminated French pastry flaky layers, warm brown butter glaze.",
    price: 450,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    available: true,
  },
  {
    id: "item-15",
    name: "Basque Cheesecake",
    description: "Burnt-top caramelized Spanish cheesecake, creamy molten center.",
    price: 600,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
    available: true,
  },
  {
    id: "item-16",
    name: "Dark Chocolate Sea Salt Tart",
    description: "70% Valrhona dark chocolate ganache, sea salt flakes, buttery shortcrust shell.",
    price: 625,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
    available: true,
  },
  {
    id: "item-17",
    name: "Pistachio Cardamom Muffin",
    description: "Moist bakery muffin infused with toasted pistachios and aromatic cardamom.",
    price: 475,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    available: true,
  },
  {
    id: "item-18",
    name: "Almond Frangipane Tart",
    description: "Flaky crust filled with rich almond cream and toasted sliced almonds.",
    price: 550,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=800&q=80",
    available: true,
  },
];

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

  const displayItems = initialItems && initialItems.length > 0 ? initialItems : DEFAULT_MENU_ITEMS;

  const categories = [
    { id: "all", label: "All Items" },
    { id: "drinks", label: "Drinks" },
    { id: "food", label: "Food" },
    { id: "desserts", label: "Desserts" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? displayItems
      : displayItems.filter((item) => item.category.toLowerCase() === selectedCategory);

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
