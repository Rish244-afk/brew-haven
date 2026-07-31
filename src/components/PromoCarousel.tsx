"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PromoCarousel() {
  const slides = [
    {
      id: 1,
      title: "Pink never looked this cute!",
      description:
        "The Pink Bearista Glass Cold Cup has arrived. Pick up this limited-edition collectible today.",
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80",
      bgGradient: "from-pink-950/20 via-cream to-parchment",
      tag: "Limited Edition Collectible",
      ctaText: "Order Now",
      ctaHref: "/menu?category=drinks",
    },
    {
      id: 2,
      title: "18-Hour Slow Steeped Velvet Vanilla",
      description:
        "Handcrafted Ethiopian cold brew topped with Madagascar vanilla bean sweet cream.",
      image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&q=80",
      bgGradient: "from-amber-950/20 via-cream to-parchment",
      tag: "Barista Favorite",
      ctaText: "Explore Cold Brews",
      ctaHref: "/menu?category=drinks",
    },
    {
      id: 3,
      title: "House Sourdough & Avocado Toast",
      description:
        "Artisan sourdough, smashed Hass avocado, chili oil drizzle & poached organic eggs.",
      image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&q=80",
      bgGradient: "from-emerald-950/20 via-cream to-parchment",
      tag: "Gourmet Breakfast",
      ctaText: "Order Gourmet Food",
      ctaHref: "/menu?category=food",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <section className="py-10 bg-cream">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="relative bg-white border border-latte/30 shadow-luxury overflow-hidden rounded-xl">
          {/* Slide Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 items-center min-h-[280px]">
            {/* Left Image Thumbnail */}
            <div className="md:col-span-4 p-8 flex items-center justify-center bg-parchment/40">
              <div className="w-48 h-48 sm:w-56 sm:h-56 relative rounded-2xl overflow-hidden shadow-luxury border-2 border-latte/30">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-cover transition-all duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Right Copy & CTA */}
            <div className="md:col-span-8 p-8 md:p-12 space-y-4">
              <span className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-latte font-semibold bg-espresso px-3 py-1 rounded-full inline-block">
                {active.tag}
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-espresso font-normal leading-tight">
                {active.title}
              </h2>

              <p className="text-xs md:text-sm text-mid leading-relaxed font-sans max-w-lg">
                {active.description}
              </p>

              <div className="pt-4">
                <Link
                  href={active.ctaHref}
                  className="font-sans text-xs tracking-[0.2em] uppercase bg-espresso text-cream hover:bg-latte hover:text-dark px-8 py-3.5 rounded-full inline-block font-medium transition-all shadow-md"
                >
                  {active.ctaText}
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-latte/40 text-espresso flex items-center justify-center hover:bg-latte hover:text-dark transition-all shadow-md"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-latte/40 text-espresso flex items-center justify-center hover:bg-latte hover:text-dark transition-all shadow-md"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "w-8 bg-latte" : "w-3 bg-latte/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
