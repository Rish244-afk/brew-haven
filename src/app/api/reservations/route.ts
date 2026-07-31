import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReservationSchema, checkHoneypot } from "@/lib/validations";
import { sendReservationConfirmationEmail } from "@/lib/resend";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reservations = await prisma.reservation.findMany({
      orderBy: { date: "asc" },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot anti-spam check
    if (checkHoneypot(body.hp_field)) {
      console.warn("🤖 Spam submission blocked by honeypot field in reservation");
      return NextResponse.json({ success: true, message: "Reservation received!" });
    }

    const validated = ReservationSchema.parse(body);

    const reservation = await prisma.reservation.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        partySize: validated.partySize,
        date: new Date(validated.date),
        time: validated.time,
        notes: validated.notes || null,
        status: "pending",
      },
    });

    // Send confirmation email
    await sendReservationConfirmationEmail({
      toEmail: reservation.email,
      name: reservation.name,
      date: new Date(reservation.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: reservation.time,
      partySize: reservation.partySize,
      reservationId: reservation.id,
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error: any) {
    console.error("Reservation creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit reservation" },
      { status: 400 }
    );
  }
}
