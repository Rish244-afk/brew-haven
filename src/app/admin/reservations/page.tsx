import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminReservationsClient } from "@/components/AdminReservationsClient";

export const metadata: Metadata = {
  title: "Reservations — Brew Haven Admin",
};

export const revalidate = 0;

export default async function AdminReservationsPage() {
  let reservations: any[] = [];
  try {
    reservations = await prisma.reservation.findMany({
      orderBy: { date: "asc" },
    });
  } catch (err) {
    console.error("Error fetching reservations for admin:", err);
  }

  return <AdminReservationsClient initialReservations={reservations} />;
}
