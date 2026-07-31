"use client";

import Image from "next/image";
import Link from "next/link";

export function HandcraftedCurations() {
  const curations = [
    {
      id: "new-launch",
      name: "New Launch",
      image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&q=80",
      href: "/menu?category=drinks",
    },
    {
      id: "best-seller",
      name: "Best Seller",
      image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80",
      href: "/menu?category=drinks",
    },
    {
      id: "drinks",
      name: "Drinks",
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80",
      href: "/menu?category=drinks",
    },
    {
      id: "food",
      name: "Food",
      image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=80",
      href: "/menu?category=food",
    },
    {
      id: "desserts",
      name: "Desserts",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
      href: "/menu?category=desserts",
    },
    {
      id: "at-home",
      name: "At Home Coffee",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80",
      href: "/menu?category=drinks",
    },
  ];

  return (
    <section className="py-16 bg-cream border-b border-latte/15">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-espresso font-normal">
              Handcrafted <em className="italic text-latte">Curations</em>
            </h2>
            <p className="text-xs text-mid font-sans mt-1">
              Explore our artisanal beverages, gourmet food, and single-origin roasts
            </p>
          </div>
          <Link
            href="/menu"
            className="text-xs font-sans uppercase tracking-[0.2em] text-latte hover:text-espresso transition-colors font-medium hidden sm:block"
          >
            View All Categories →
          </Link>
        </div>

        {/* Circular Cards Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 md:gap-8 text-center">
          {curations.map((curation) => (
            <Link
              key={curation.id}
              href={curation.href}
              className="group flex flex-col items-center space-y-3 cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full relative overflow-hidden border-2 border-latte/30 group-hover:border-latte group-hover:scale-105 transition-all duration-300 shadow-md">
                <Image
                  src={curation.image}
                  alt={curation.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="font-serif text-base text-espresso group-hover:text-latte transition-colors font-medium">
                {curation.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
