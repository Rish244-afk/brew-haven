import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactSchema, checkHoneypot } from "@/lib/validations";
import { sendContactNotificationEmail } from "@/lib/resend";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot check
    if (checkHoneypot(body.hp_field)) {
      console.warn("🤖 Spam submission blocked by honeypot field in contact form");
      return NextResponse.json({ success: true, message: "Message received!" });
    }

    const validated = ContactSchema.parse(body);

    const contact = await prisma.contactMessage.create({
      data: {
        name: validated.name,
        email: validated.email,
        message: validated.message,
      },
    });

    // Notify owner
    await sendContactNotificationEmail({
      name: contact.name,
      email: contact.email,
      type: "inquiry",
      message: contact.message,
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    console.error("Contact message creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit message" },
      { status: 400 }
    );
  }
}
