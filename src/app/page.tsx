import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Coffee } from "lucide-react";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { HandcraftedCurations } from "@/components/HandcraftedCurations";
import { PromoCarousel } from "@/components/PromoCarousel";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch featured items for home page teaser safely
  const featuredItems = await safeDbQuery(
    () =>
      prisma.menuItem.findMany({
        take: 3,
        where: { available: true },
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  return (
    <div className="overflow-hidden bg-cream">
      {/* ── 1. CINEMATIC MOVING HERO SECTION (TOP OF HOMEPAGE) ── */}
      <section className="relative h-screen min-h-[680px] flex items-center justify-start overflow-hidden">
        {/* Background Image with Slow Ken-Burns Cinematic Movement */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-kenburns"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1800&q=80')",
          }}
        />

        {/* Ambient Dark Overlay with Subtle Steam Rise Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-[#1A1208]/60 to-[#1A1208]/30" />

        {/* Ambient Floating Steam Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-20 left-1/4 w-32 h-32 rounded-full bg-latte/10 blur-2xl animate-steam" />
          <div className="absolute bottom-32 right-1/3 w-40 h-40 rounded-full bg-cream/10 blur-2xl animate-steam [animation-delay:2s]" />
        </div>

        {/* Hero Glassmorphic Card Container */}
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 md:px-12 py-12">
          <div className="max-w-2xl glass-card-hero p-8 md:p-12 rounded-3xl animate-gold-pulse space-y-6">
            <div className="eyebrow flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-latte animate-spin-slow" />
              <span>Premium · Est. 2018 · Artisan</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-cream leading-[1.05]">
              Crafted Coffee,<br />
              <em className="italic text-shimmer-gold font-normal">Quiet Luxury</em>
            </h1>

            <p className="text-sm md:text-base text-cream/80 leading-relaxed max-w-lg font-sans font-light">
              Experience slow-brewed perfection in an artisanal sanctuary designed for calm, comfort, and deep connection.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="font-sans text-xs tracking-[0.2em] uppercase bg-latte text-dark font-semibold px-8 py-4 rounded-full hover:bg-cream transition-all shadow-gold flex items-center gap-2 group"
              >
                <span>Explore the Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="font-sans text-xs tracking-[0.2em] uppercase text-latte border border-latte/50 px-8 py-4 rounded-full hover:bg-latte hover:text-dark transition-all duration-300"
              >
                Our Philosophy
              </Link>
            </div>
          </div>
        </div>

        {/* Pulsing Scroll Down Indicator */}
        <div className="absolute bottom-8 right-6 md:right-12 hidden sm:flex items-center gap-3 text-[0.65rem] tracking-[0.2em] uppercase text-latte z-10 [writing-mode:vertical-rl]">
          <span>Scroll Down</span>
          <div className="w-[2px] h-12 bg-gradient-to-b from-latte via-cream to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── 2. STARBUCKS PROMOTIONAL SLIDER CAROUSEL BANNER ── */}
      <PromoCarousel />

      {/* ── 3. HANDCRAFTED CURATIONS (CIRCULAR QUICK CATEGORIES) ── */}
      <HandcraftedCurations />

      {/* ── 4. INTRO STATS STRIP ── */}
      <section className="bg-espresso py-16 border-y border-latte/15 relative">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 text-center divide-y md:divide-y-0 md:divide-x divide-latte/20">
            <div className="py-4 md:py-0 md:px-8">
              <div className="font-serif text-5xl md:text-6xl text-latte font-light mb-2">12+</div>
              <div className="text-[0.7rem] tracking-[0.2em] uppercase text-cream/60">
                Single Origin Beans
              </div>
            </div>
            <div className="py-4 md:py-0 md:px-8">
              <div className="font-serif text-5xl md:text-6xl text-latte font-light mb-2">6</div>
              <div className="text-[0.7rem] tracking-[0.2em] uppercase text-cream/60">
                Years of Craft
              </div>
            </div>
            <div className="py-4 md:py-0 md:px-8">
              <div className="font-serif text-5xl md:text-6xl text-latte font-light mb-2">∞</div>
              <div className="text-[0.7rem] tracking-[0.2em] uppercase text-cream/60">
                Moments of Stillness
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. STORY TEASER ── */}
      <section className="py-24 md:py-36 bg-cream">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Story Image Wrap */}
            <div className="relative h-[480px] md:h-[560px] w-full">
              <div className="absolute inset-0 overflow-hidden shadow-luxury rounded-3xl border border-latte/30">
                <Image
                  src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&q=80"
                  alt="Slow brewing coffee"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -top-4 -left-4 bg-latte text-dark font-sans text-[0.65rem] tracking-[0.2em] uppercase px-5 py-2.5 font-semibold shadow-md rounded-full">
                The Sanctuary
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              <div className="eyebrow eyebrow-line">Our Story</div>
              <h2 className="font-serif text-4xl md:text-5xl font-normal text-espresso leading-tight">
                Where <em className="italic text-latte">ritual</em> meets refinement
              </h2>
              <p className="text-mid text-sm md:text-base leading-relaxed">
                Brew Haven was born from a simple belief: coffee is not a commodity — it is an experience. Each batch is roasted with intentionality and extracted with mathematical precision.
              </p>
              <p className="text-mid text-sm md:text-base leading-relaxed">
                Our space is designed to resist noise. No rush. No shortcuts. Just quiet perfection served in an environment that honors your time.
              </p>
              <div className="pt-4">
                <Link href="/about" className="btn-luxury btn-dark">
                  <span>Read Our Full Story</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PHILOSOPHY & FEATURES ── */}
      <section className="py-24 bg-parchment border-t border-latte/15">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <div className="eyebrow justify-center">Why Brew Haven</div>
            <h2 className="font-serif text-4xl md:text-5xl text-espresso font-normal">
              A Different <em className="italic text-latte">Kind</em> of Café
            </h2>
            <div className="w-12 h-[1px] bg-latte mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cream p-10 relative overflow-hidden group border border-latte/20 shadow-sm hover:-translate-y-1.5 transition-all duration-300 rounded-3xl">
              <div className="text-3xl text-latte mb-6">🌿</div>
              <h3 className="font-serif text-2xl text-espresso mb-3">Single Origin</h3>
              <p className="text-xs md:text-sm text-mid leading-relaxed font-sans">
                Every bean is traceable to individual micro-lots and ethically traded directly with sustainable growers worldwide.
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-latte scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>

            <div className="bg-cream p-10 relative overflow-hidden group border border-latte/20 shadow-sm hover:-translate-y-1.5 transition-all duration-300 rounded-3xl">
              <div className="text-3xl text-latte mb-6">⚗️</div>
              <h3 className="font-serif text-2xl text-espresso mb-3">Precision Brewing</h3>
              <p className="text-xs md:text-sm text-mid leading-relaxed font-sans">
                Water chemistry, extraction ratios, and temperature curves are calibrated specifically for each bean variety.
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-latte scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>

            <div className="bg-cream p-10 relative overflow-hidden group border border-latte/20 shadow-sm hover:-translate-y-1.5 transition-all duration-300 rounded-3xl">
              <div className="text-3xl text-latte mb-6">🕯️</div>
              <h3 className="font-serif text-2xl text-espresso mb-3">Calm Spaces</h3>
              <p className="text-xs md:text-sm text-mid leading-relaxed font-sans">
                Tactile materials, acoustic isolation, and warm natural lighting offer an oasis from urban velocity.
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-latte scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TABLE RESERVATION CTA BANNER ── */}
      <section className="relative py-28 bg-dark text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 animate-kenburns"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80')",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-6">
          <div className="eyebrow justify-center">Reserve Your Moment</div>
          <div className="w-12 h-[1px] bg-latte mx-auto" />
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream font-light leading-tight">
            Your table in the <em className="italic text-shimmer-gold">Haven</em> is waiting.
          </h2>
          <p className="text-cream/70 text-sm md:text-base max-w-lg mx-auto font-sans font-light">
            Private pour-over tastings, curated pairing experiences, and unhurried afternoons.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact?tab=reservation" className="btn-luxury btn-light">
              <span>Reserve a Table</span>
            </Link>
            <Link href="/menu" className="btn-luxury btn-gold">
              <span>Explore Menu</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
