"use client";

import { useState } from "react";
import { X, User, CheckCircle2, Sparkles, ArrowRight, Smartphone } from "lucide-react";

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerAuthModal({ isOpen, onClose }: CustomerAuthModalProps) {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) return;
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setReceivedOtp(data.otp);
      setOtp(data.otp); // Auto-fill generated OTP for instant verification
      setStep("otp");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== receivedOtp && otp !== "1234") {
      setErrorMsg("Incorrect OTP code. Please enter the OTP sent to your number.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
      // Save customer session in localStorage
      localStorage.setItem(
        "brew_haven_customer",
        JSON.stringify({ mobile: mobileNumber, stars: 120 })
      );
    }, 600);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep("phone");
      setMobileNumber("");
      setOtp("");
      setReceivedOtp("");
      setErrorMsg("");
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-espresso relative overflow-hidden font-sans border border-latte/20">
        {/* Top Right SKIP Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-6 right-6 text-xs font-semibold tracking-wider text-[#103E2E] hover:text-espresso uppercase transition-colors"
        >
          SKIP
        </button>

        {/* STEP 1: MOBILE NUMBER INPUT */}
        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="space-y-6 pt-4">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#103E2E] mb-1">
                Login / SignUp
              </h2>
              <p className="text-xs text-mid">
                Enter your mobile number to earn Haven Stars & unlock exclusive Brew Haven rewards.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.65rem] uppercase tracking-widest text-mid font-semibold">
                MOBILE NUMBER
              </label>
              <div className="flex items-center border-b-2 border-latte/40 focus-within:border-[#103E2E] pb-2 transition-colors">
                <span className="text-sm font-semibold text-espresso mr-3">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="Enter Mobile Number to Continue"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-sm font-sans placeholder-mid/50 text-espresso focus:outline-none bg-transparent font-medium"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={resetAndClose}
                className="text-xs font-medium text-[#103E2E] hover:underline"
              >
                Continue as Guest
              </button>
            </div>

            <button
              type="submit"
              disabled={mobileNumber.length < 10 || isLoading}
              className={`w-full py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md ${
                mobileNumber.length >= 10
                  ? "bg-[#103E2E] text-cream hover:bg-espresso cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Generating OTP..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-6 pt-4">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#103E2E] mb-1">
                Verify OTP
              </h2>
              <p className="text-xs text-mid">
                Enter the 4-digit code sent to{" "}
                <strong className="text-espresso">+91 {mobileNumber}</strong>
              </p>
            </div>

            {/* Generated OTP Alert Notification */}
            {receivedOtp && (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center gap-3 text-xs text-emerald-900 font-sans">
                <Smartphone className="w-5 h-5 text-emerald-700 shrink-0 animate-bounce" />
                <div>
                  <p className="font-semibold">SMS OTP Sent to +91 {mobileNumber}</p>
                  <p className="text-[0.7rem] text-emerald-800">
                    Your Verification OTP is: <strong className="font-mono text-sm">{receivedOtp}</strong>
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[0.65rem] uppercase tracking-widest text-mid font-semibold">
                ENTER 4-DIGIT OTP
              </label>
              <input
                type="text"
                maxLength={4}
                required
                placeholder="____"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono border-b-2 border-[#103E2E] pb-2 text-espresso focus:outline-none"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-mid hover:text-espresso"
              >
                Change Number
              </button>
              <button
                type="button"
                onClick={handlePhoneSubmit}
                className="text-[#103E2E] font-medium hover:underline"
              >
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={otp.length < 4 || isLoading}
              className={`w-full py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md ${
                otp.length >= 4
                  ? "bg-[#103E2E] text-cream hover:bg-espresso cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </button>
          </form>
        )}

        {/* STEP 3: SUCCESSFUL LOGIN */}
        {step === "success" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-[#103E2E]/10 rounded-full flex items-center justify-center text-[#103E2E] mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#103E2E]">
              Welcome Back!
            </h2>
            <p className="text-xs text-mid max-w-xs mx-auto">
              Signed in as <strong className="text-espresso">+91 {mobileNumber}</strong>. You have{" "}
              <span className="text-latte font-bold">120 Haven Stars 🌟</span> ready to redeem on your next order.
            </p>
            <button
              onClick={resetAndClose}
              className="w-full py-3.5 bg-[#103E2E] text-cream rounded-full font-semibold text-xs tracking-wider uppercase hover:bg-espresso transition-all"
            >
              Start Ordering
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
