import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story — Brew Haven",
  description: "The story of Brew Haven — where coffee is not rushed, it is respected.",
};

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* PAGE HERO */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1442975631134-5c9029ab27c7?w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-[#1A1208]/70 to-[#1A1208]/40" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-4 pt-16">
          <div className="eyebrow justify-center">About Brew Haven</div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream font-light leading-tight">
            At Brew Haven, coffee<br />
            is not rushed — <em className="italic text-latte">it is respected.</em>
          </h1>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="eyebrow eyebrow-line">The Beginning</div>
            <div className="w-12 h-[1px] bg-latte my-4" />
            <h2 className="font-serif text-4xl md:text-5xl text-espresso font-normal leading-tight">
              The <em className="italic text-latte">Art of the Slow</em> Brew
            </h2>

            <p className="text-mid text-sm md:text-base leading-relaxed font-sans">
              Brew Haven was founded in 2018 by Mara and Jonah — two people who met over a shared obsession with pour-over coffee and a mutual disdain for anything done carelessly.
            </p>

            <p className="text-mid text-sm md:text-base leading-relaxed font-sans">
              What began as a 12-seat espresso bar has grown into a philosophy — one that values time, intention, and craft.
            </p>

            <p className="text-mid text-sm md:text-base leading-relaxed font-sans">
              Today, Brew Haven is a community united by the belief that good things take time.
            </p>

            {/* Quote Block */}
            <div className="p-6 bg-parchment/60 border-l-2 border-latte my-6 space-y-2">
              <p className="font-serif text-lg md:text-xl text-espresso italic leading-relaxed">
                "Every bean is selected, every brew is intentional, and every space is designed to slow you down."
              </p>
              <div className="text-xs uppercase tracking-widest text-latte font-medium">
                — Mara & Jonah
              </div>
            </div>
          </div>

          <div className="relative h-[480px] w-full shadow-luxury overflow-hidden border border-latte/20">
            <Image
              src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=900&q=80"
              alt="Barista crafting coffee"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-24 bg-parchment border-t border-latte/15">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <div className="eyebrow justify-center">What We Stand For</div>
            <div className="w-12 h-[1px] bg-latte mx-auto" />
            <h2 className="font-serif text-4xl md:text-5xl text-espresso font-normal">
              The <em className="italic text-latte">Sensory</em> Curateur
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-cream p-8 border border-latte/20 shadow-sm relative group hover:-translate-y-1 transition-all duration-300">
              <div className="font-serif text-4xl text-latte font-light mb-4">01</div>
              <h3 className="font-serif text-xl text-espresso mb-2">Grounded in the Moment</h3>
              <p className="text-xs text-mid leading-relaxed font-sans">
                We design calm, distraction-free spaces for genuine connection.
              </p>
            </div>

            <div className="bg-cream p-8 border border-latte/20 shadow-sm relative group hover:-translate-y-1 transition-all duration-300">
              <div className="font-serif text-4xl text-latte font-light mb-4">02</div>
              <h3 className="font-serif text-xl text-espresso mb-2">Traceability Over Trends</h3>
              <p className="text-xs text-mid leading-relaxed font-sans">
                Every bean is ethically sourced directly from sustainable micro-lots.
              </p>
            </div>

            <div className="bg-cream p-8 border border-latte/20 shadow-sm relative group hover:-translate-y-1 transition-all duration-300">
              <div className="font-serif text-4xl text-latte font-light mb-4">03</div>
              <h3 className="font-serif text-xl text-espresso mb-2">The Craft of Patience</h3>
              <p className="text-xs text-mid leading-relaxed font-sans">
                Baristas master their craft over time with continuous precision.
              </p>
            </div>

            <div className="bg-cream p-8 border border-latte/20 shadow-sm relative group hover:-translate-y-1 transition-all duration-300">
              <div className="font-serif text-4xl text-latte font-light mb-4">04</div>
              <h3 className="font-serif text-xl text-espresso mb-2">Luxury Without Noise</h3>
              <p className="text-xs text-mid leading-relaxed font-sans">
                True luxury is simplicity, quiet comfort, and intentionality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COME EXPERIENCE CTA */}
      <section className="bg-espresso text-cream text-center py-24 px-6">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="font-serif text-4xl md:text-5xl text-cream font-light">
            Come experience the <em className="italic text-latte">Haven</em>.
          </h2>
          <p className="text-xs md:text-sm text-cream/60 font-sans">
            Walk in, or reserve your moment.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/contact" className="btn-luxury btn-light">
              <span>Find Us</span>
            </Link>
            <Link href="/menu" className="btn-luxury btn-gold">
              <span>See Menu</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
