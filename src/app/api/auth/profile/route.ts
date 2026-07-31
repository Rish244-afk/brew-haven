import { NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mobile, firstName, lastName, email, birthDate, referralCode } = body;

    if (!mobile || !firstName || !lastName || !email || !birthDate) {
      return NextResponse.json(
        { error: "All required profile fields must be provided." },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, "");

    const updatedCustomer = await safeDbQuery(
      () =>
        prisma.customer.upsert({
          where: { mobile: cleanMobile },
          update: {
            firstName,
            lastName,
            email,
            birthDate,
            referralCode: referralCode || null,
          },
          create: {
            mobile: cleanMobile,
            firstName,
            lastName,
            email,
            birthDate,
            referralCode: referralCode || null,
            stars: 120,
            cardBalance: 0.0,
          },
        }),
      {
        id: `cust_${cleanMobile}`,
        mobile: cleanMobile,
        firstName,
        lastName,
        email,
        birthDate,
        referralCode,
        stars: 120,
        cardBalance: 0.0,
        otpCode: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    return NextResponse.json({
      success: true,
      customer: updatedCustomer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile in database" },
      { status: 500 }
    );
  }
}
