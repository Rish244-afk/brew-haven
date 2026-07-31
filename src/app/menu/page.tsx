import { Metadata } from "next";
import Link from "next/link";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { MenuGrid } from "@/components/MenuGrid";

export const metadata: Metadata = {
  title: "Menu — Brew Haven",
  description: "Brew Haven Menu — Signature drinks, artisan sourdough, and gourmet cafe selections.",
};

export const dynamic = "force-dynamic";

const DEFAULT_MENU_ITEMS = [
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

export default async function MenuPage() {
  const dbMenuItems = await safeDbQuery(
    () => prisma.menuItem.findMany({ orderBy: { createdAt: "asc" } }),
    []
  );

  const menuItems = dbMenuItems.length > 0 ? dbMenuItems : DEFAULT_MENU_ITEMS;

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
