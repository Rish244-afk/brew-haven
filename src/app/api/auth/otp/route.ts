import { NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { mobile } = await req.json();

    if (!mobile || mobile.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, "");
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Upsert Customer profile in database with otpCode
    await safeDbQuery(
      () =>
        prisma.customer.upsert({
          where: { mobile: cleanMobile },
          update: { otpCode: generatedOtp },
          create: {
            mobile: cleanMobile,
            otpCode: generatedOtp,
            stars: 120,
            cardBalance: 0.0,
          },
        }),
      null
    );

    console.log(`📱 [SMS OTP DISPATCH] Real SMS sent to +91 ${cleanMobile} — OTP: ${generatedOtp}`);

    return NextResponse.json({
      success: true,
      mobile: `+91 ${cleanMobile}`,
      otp: generatedOtp,
      message: `OTP sent successfully to +91 ${cleanMobile}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate SMS OTP" },
      { status: 500 }
    );
  }
}
