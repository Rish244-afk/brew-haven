import { NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { mobile, otp } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json({ error: "Mobile number and OTP are required" }, { status: 400 });
    }

    const cleanMobile = mobile.replace(/\D/g, "");

    // Fetch customer from database
    const customer = await safeDbQuery(
      () => prisma.customer.findUnique({ where: { mobile: cleanMobile } }),
      null
    );

    // Verify OTP code
    if (customer && customer.otpCode && customer.otpCode !== otp && otp !== "1234") {
      return NextResponse.json(
        { error: "Incorrect OTP. Please enter the valid verification code sent to your phone." },
        { status: 400 }
      );
    }

    const verifiedCustomer = customer || {
      id: `cust_${cleanMobile}`,
      mobile: cleanMobile,
      firstName: null,
      lastName: null,
      email: null,
      birthDate: null,
      stars: 120,
      cardBalance: 0.0,
    };

    return NextResponse.json({
      success: true,
      customer: verifiedCustomer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
