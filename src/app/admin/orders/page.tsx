import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminOrdersClient } from "@/components/AdminOrdersClient";

export const metadata: Metadata = {
  title: "Orders — Brew Haven Admin",
};

export const revalidate = 0;

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  } catch (err) {
    console.error("Error fetching orders for admin:", err);
  }

  return <AdminOrdersClient initialOrders={orders} />;
}
