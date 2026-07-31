import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminMenuClient } from "@/components/AdminMenuClient";

export const metadata: Metadata = {
  title: "Menu Manager — Brew Haven Admin",
};

export const revalidate = 0;

export default async function AdminMenuPage() {
  let menuItems: any[] = [];
  try {
    menuItems = await prisma.menuItem.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error fetching menu for admin:", err);
  }

  return <AdminMenuClient initialItems={menuItems} />;
}
