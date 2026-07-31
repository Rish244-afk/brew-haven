import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { mobile } = await req.json();

    if (!mobile || mobile.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Generate random 4-digit OTP code
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    console.log(`📱 [SMS OTP DISPATCH] Sent OTP ${generatedOtp} to mobile +91 ${mobile}`);

    return NextResponse.json({
      success: true,
      mobile: `+91 ${mobile}`,
      otp: generatedOtp,
      message: `OTP sent successfully to +91 ${mobile}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send SMS OTP" },
      { status: 500 }
    );
  }
}
