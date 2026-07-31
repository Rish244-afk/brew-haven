import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminMessagesClient } from "@/components/AdminMessagesClient";

export const metadata: Metadata = {
  title: "Messages Inbox — Brew Haven Admin",
};

export const revalidate = 0;

export default async function AdminMessagesPage() {
  let messages: any[] = [];
  try {
    messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error fetching messages for admin:", err);
  }

  return <AdminMessagesClient initialMessages={messages} />;
}
