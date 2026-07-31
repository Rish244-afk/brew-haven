import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MenuGrid } from "@/components/MenuGrid";

export const metadata: Metadata = {
  title: "Menu — Brew Haven",
  description: "Brew Haven Menu — Signature drinks and artisan selections.",
};

export const revalidate = 30; // Revalidate DB data every 30 seconds

export default async function MenuPage() {
  let menuItems: any[] = [];
  try {
    menuItems = await prisma.menuItem.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* PAGE HERO */}
      <section className="relative h-[45vh] min-h-[380px] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-[#1A1208]/70 to-[#1A1208]/40" />

        <div className="relative z-10 max-w-xl mx-auto px-6 space-y-4 pt-16">
          <div className="eyebrow justify-center">The Curated Menu</div>
          <h1 className="font-serif text-5xl md:text-6xl text-cream font-light">
            Signature <em className="italic text-latte">Selection</em>
          </h1>
          <p className="text-xs md:text-sm text-cream/70 font-sans tracking-wide">
            Sourced with care. Prepared with precision.
          </p>
        </div>
      </section>

      {/* MENU CONTENT */}
      <section className="py-20 max-w-[1200px] mx-auto px-6 md:px-12">
        <MenuGrid initialItems={menuItems} />
      </section>

      {/* CAN'T DECIDE CTA BANNER */}
      <section className="bg-espresso text-cream text-center py-20 px-6 border-t border-latte/15">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-cream">
            Can't decide? Let us <em className="italic text-latte">curate</em> for you.
          </h2>
          <p className="text-xs md:text-sm text-cream/60 font-sans">
            Ask our baristas about seasonal tasting flights.
          </p>
          <div className="pt-4">
            <Link href="/contact?tab=reservation" className="btn-luxury btn-light">
              <span>Make a Reservation</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
