import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const id = params.id;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: Boolean(body.isRead) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating message status:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}
