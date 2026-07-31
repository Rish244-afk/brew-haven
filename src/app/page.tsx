import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Coffee, Flame, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddToCartButton";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch featured items for home page teaser
  let featuredItems: any[] = [];
  try {
    featuredItems = await prisma.menuItem.findMany({
      take: 3,
      where: { available: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error loading featured items for homepage:", err);
  }

  return (
    <div className="overflow-hidden">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative h-screen min-h-[640px] flex items-end justify-start overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-10000 ease-out"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1800&q=80')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-[#1A1208]/40 to-[#1A1208]/10" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-2xl">
            <div className="eyebrow eyebrow-line mb-6">
              Premium · Est. 2018 · Artisan
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-cream leading-[1.05] mb-6">
              Crafted Coffee,<br />
              <em className="italic text-latte">Quiet Luxury</em>
            </h1>

            <p className="text-sm md:text-base text-cream/75 leading-relaxed mb-10 max-w-lg font-sans">
              Experience slow-brewed perfection in a space designed for calm, comfort, and connection.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/menu" className="btn-luxury btn-light">
                <span>Explore the Menu</span>
              </Link>
              <Link href="/about" className="btn-luxury btn-gold">
                <span>Our Philosophy</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-6 md:right-12 hidden sm:flex items-center gap-3 text-[0.65rem] tracking-[0.2em] uppercase text-cream/50 z-10 [writing-mode:vertical-rl]">
          <span>Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-latte to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── 2. INTRO STATS STRIP ── */}
      <section className="bg-espresso py-16 border-y border-latte/15">
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

      {/* ── 3. STORY TEASER ── */}
      <section className="py-24 md:py-36 bg-cream">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Story Image Wrap */}
            <div className="relative h-[480px] md:h-[560px] w-full">
              <div className="absolute inset-0 overflow-hidden shadow-luxury">
                <Image
                  src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&q=80"
                  alt="Slow brewing coffee"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -top-4 -left-4 bg-latte text-dark font-sans text-[0.65rem] tracking-[0.2em] uppercase px-5 py-2.5 font-medium shadow-md">
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

      {/* ── 4. PHILOSOPHY & FEATURES ── */}
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
            <div className="bg-cream p-10 relative overflow-hidden group border border-latte/20 shadow-sm hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl text-latte mb-6">🌿</div>
              <h3 className="font-serif text-2xl text-espresso mb-3">Single Origin</h3>
              <p className="text-xs md:text-sm text-mid leading-relaxed font-sans">
                Every bean is traceable to individual micro-lots and ethically traded directly with sustainable growers worldwide.
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-latte scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>

            <div className="bg-cream p-10 relative overflow-hidden group border border-latte/20 shadow-sm hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl text-latte mb-6">⚗️</div>
              <h3 className="font-serif text-2xl text-espresso mb-3">Precision Brewing</h3>
              <p className="text-xs md:text-sm text-mid leading-relaxed font-sans">
                Water chemistry, extraction ratios, and temperature curves are calibrated specifically for each bean variety.
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-latte scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>

            <div className="bg-cream p-10 relative overflow-hidden group border border-latte/20 shadow-sm hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl text-latte mb-6">🕯️</div>
              <h3 className="font-serif text-2xl text-espresso mb-3">Calm Spaces</h3>
              <p className="text-xs md:text-sm text-mid leading-relaxed font-sans">
                Tactile materials, acoustic isolation, and warm natural lighting offer an oasis from urban velocity.
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-latte scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FEATURED MENU SELECTIONS ── */}
      {featuredItems.length > 0 && (
        <section className="py-24 bg-cream">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="eyebrow eyebrow-line mb-3">Curated Selection</div>
                <h2 className="font-serif text-4xl md:text-5xl text-espresso font-normal">
                  Featured <em className="italic text-latte">Creations</em>
                </h2>
              </div>
              <Link href="/menu" className="btn-luxury btn-dark self-start md:self-auto">
                <span>View Full Menu</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-latte/20 overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {item.imageUrl && (
                      <div className="relative h-56 w-full overflow-hidden bg-espresso">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="font-serif text-2xl text-espresso">{item.name}</h3>
                        <span className="font-mono text-latte text-lg">
                          ${(item.price / 100).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-mid leading-relaxed mb-4">{item.description}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <AddToCartButton item={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. TABLE RESERVATION CTA BANNER ── */}
      <section className="relative py-28 bg-dark text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80')",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-6">
          <div className="eyebrow justify-center">Reserve Your Moment</div>
          <div className="w-12 h-[1px] bg-latte mx-auto" />
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream font-light leading-tight">
            Your table in the <em className="italic text-latte">Haven</em> is waiting.
          </h2>
          <p className="text-cream/60 text-sm md:text-base max-w-lg mx-auto font-sans font-light">
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
