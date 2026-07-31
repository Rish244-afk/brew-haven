import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

const initialMenuItems = [
  // DRINKS
  {
    name: "Haven Espresso",
    description: "Single-origin Ethiopian espresso, pulled slow with notes of bergamot & dark chocolate.",
    price: 350,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80",
    available: true,
  },
  {
    name: "Cardamom Cortado",
    description: "Double shot espresso, velvety steamed milk, a whisper of crushed cardamom.",
    price: 475,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",
    available: true,
  },
  {
    name: "Slow Pour Filter",
    description: "Rotating single-origin pour-over, brewed to order using V60 precision.",
    price: 500,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    available: true,
  },
  {
    name: "Oat Honey Latte",
    description: "Creamy oat milk, organic wildflower honey, double espresso shot.",
    price: 550,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&q=80",
    available: true,
  },
  {
    name: "Velvet Vanilla Cold Brew",
    description: "18-hour slow steeped cold brew topped with house vanilla bean sweet cream.",
    price: 575,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80",
    available: true,
  },
  {
    name: "Iced Matcha Oat Latte",
    description: "Ceremonial grade Uji matcha, oat milk, subtle agave blossom sweetener.",
    price: 600,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80",
    available: true,
  },
  {
    name: "Smoked Caramel Macchiato",
    description: "Layered espresso, steamed milk, artisan house-smoked caramel drizzle.",
    price: 625,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&q=80",
    available: true,
  },
  {
    name: "Spanish Rose Latte",
    description: "Condensed milk, steamed whole milk, espresso, infused with delicate rose extract.",
    price: 600,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80",
    available: true,
  },

  // FOOD
  {
    name: "Sourdough Avocado Toast",
    description: "Toasted house sourdough, smashed Hass avocado, chili oil, poached egg.",
    price: 950,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80",
    available: true,
  },
  {
    name: "Herbed Egg Sandwich",
    description: "Soft scramble organic eggs, melted Gruyère cheese, herb butter, toasted brioche.",
    price: 875,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
    available: true,
  },
  {
    name: "Roasted Veg Grain Bowl",
    description: "Warm farro, seasonal roasted root vegetables, kale, tahini lemon dressing.",
    price: 1050,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    available: true,
  },
  {
    name: "Truffle Mushroom Panini",
    description: "Wild roasted mushrooms, fontina cheese, truffle oil, pressed sourdough toast.",
    price: 1100,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
    available: true,
  },
  {
    name: "Smoked Salmon Bagel",
    description: "Everything bagel, dill cream cheese, wild smoked salmon, capers, pickled onion.",
    price: 1250,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    available: true,
  },

  // DESSERTS
  {
    name: "Brown Butter Croissant",
    description: "Laminated French pastry flaky layers, warm brown butter glaze.",
    price: 450,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    available: true,
  },
  {
    name: "Basque Cheesecake",
    description: "Burnt-top caramelized Spanish cheesecake, creamy molten center.",
    price: 600,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
    available: true,
  },
  {
    name: "Dark Chocolate Sea Salt Tart",
    description: "70% Valrhona dark chocolate ganache, sea salt flakes, buttery shortcrust shell.",
    price: 625,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
    available: true,
  },
  {
    name: "Pistachio Cardamom Muffin",
    description: "Moist bakery muffin infused with toasted pistachios and aromatic cardamom.",
    price: 475,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    available: true,
  },
  {
    name: "Almond Frangipane Tart",
    description: "Flaky crust filled with rich almond cream and toasted sliced almonds.",
    price: 550,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=800&q=80",
    available: true,
  },
];

async function main() {
  console.log("🌱 Starting Brew Haven Database Seed...");

  for (const item of initialMenuItems) {
    const existing = await prisma.menuItem.findFirst({
      where: { name: item.name },
    });

    if (!existing) {
      await prisma.menuItem.create({ data: item });
      console.log(`  + Created menu item: ${item.name}`);
    } else {
      console.log(`  . Skipped existing menu item: ${item.name}`);
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@brewhaven.co";
  let adminPassword = process.env.ADMIN_PASSWORD || "HavenAdminSecretPassword123!";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log(`✅ Admin account configured for: ${adminEmail}`);
  console.log("🎉 Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
