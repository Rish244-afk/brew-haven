import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

const initialMenuItems = [
  {
    name: "Haven Espresso",
    description: "Single-origin espresso, pulled slow.",
    price: 350,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80",
    available: true,
  },
  {
    name: "Cardamom Cortado",
    description: "Espresso, steamed milk, a whisper of cardamom.",
    price: 475,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",
    available: true,
  },
  {
    name: "Slow Pour Filter",
    description: "Rotating single-origin, brewed to order.",
    price: 500,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    available: true,
  },
  {
    name: "Oat Honey Latte",
    description: "Oat milk, wildflower honey, double shot.",
    price: 550,
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&q=80",
    available: true,
  },
  {
    name: "Sourdough Avocado Toast",
    description: "House sourdough, smashed avocado, chili oil.",
    price: 950,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80",
    available: true,
  },
  {
    name: "Herbed Egg Sandwich",
    description: "Soft scramble, gruyère, herb butter, brioche.",
    price: 875,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
    available: true,
  },
  {
    name: "Roasted Veg Grain Bowl",
    description: "Farro, seasonal roots, tahini dressing.",
    price: 1050,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    available: true,
  },
  {
    name: "Brown Butter Croissant",
    description: "Laminated daily, brown butter glaze.",
    price: 450,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    available: true,
  },
  {
    name: "Basque Cheesecake",
    description: "Burnt-top, creamy center, single slice.",
    price: 600,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
    available: true,
  },
  {
    name: "Dark Chocolate Tart",
    description: "70% dark chocolate, sea salt, shortcrust.",
    price: 625,
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
    available: true,
  },
];

async function main() {
  console.log("🌱 Starting Brew Haven Database Seed...");

  // 1. Seed Menu Items
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

  // 2. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@brewhaven.co";
  let adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    adminPassword = crypto.randomUUID();
    console.log(`\n🔑 GENERATED TEMPORARY ADMIN PASSWORD: ${adminPassword}`);
    console.log(`⚠️ Please save this password or set ADMIN_PASSWORD in .env file.\n`);
  }

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
