"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CreditCard,
  Plus,
  RefreshCw,
  Gift,
  QrCode,
  Calendar,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowRight,
  Barcode,
} from "lucide-react";

interface CustomerProfile {
  mobile: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  referralCode?: string;
  cardBalance: number; // in rupees
  stars: number;
}

export default function BrewHavenPayPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication & Profile Setup State
  const [authStep, setAuthStep] = useState<"phone" | "otp" | "profile_form" | "dashboard">("phone");
  const [mobileInput, setMobileInput] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // Profile Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // Load Card Modal
  const [showLoadCardModal, setShowLoadCardModal] = useState(false);
  const [loadAmount, setLoadAmount] = useState("500");

  useEffect(() => {
    const saved = localStorage.getItem("brew_haven_customer");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        if (parsed.firstName && parsed.email) {
          setAuthStep("dashboard");
        } else {
          setAuthStep("profile_form");
        }
      } catch (e) {
        setAuthStep("phone");
      }
    } else {
      setAuthStep("phone");
    }
    setLoading(false);
  }, []);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileInput.length < 10) return;
    setAuthStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length < 4) return;

    const newProf: CustomerProfile = {
      mobile: mobileInput,
      cardBalance: 0,
      stars: 120,
    };
    setProfile(newProf);
    localStorage.setItem("brew_haven_customer", JSON.stringify(newProf));
    setAuthStep("profile_form");
  };

  const handleProfileFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !birthDate) return;

    const currentMobile = profile?.mobile || mobileInput || "9876543210";

    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: currentMobile,
          firstName,
          lastName,
          email,
          birthDate,
          referralCode,
        }),
      });

      const data = await res.json();
      const updatedCustomer = data.customer || {
        mobile: currentMobile,
        firstName,
        lastName,
        email,
        birthDate,
        referralCode,
        cardBalance: profile?.cardBalance || 0,
        stars: profile?.stars || 120,
      };

      setProfile(updatedCustomer);
      localStorage.setItem("brew_haven_customer", JSON.stringify(updatedCustomer));
      setAuthStep("dashboard");
    } catch (err) {
      console.error("Profile save error:", err);
      setAuthStep("dashboard");
    }
  };

  const handleLoadCard = () => {
    if (!profile) return;
    const amountNum = parseFloat(loadAmount) || 500;
    const updated = {
      ...profile,
      cardBalance: (profile.cardBalance || 0) + amountNum,
      stars: (profile.stars || 120) + Math.floor(amountNum / 10),
    };
    setProfile(updated);
    localStorage.setItem("brew_haven_customer", JSON.stringify(updated));
    setShowLoadCardModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-espresso font-serif">
        Loading Brew Haven Pay...
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen font-sans">
      {/* Top Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-6 py-4 text-xs text-mid">
        <Link href="/" className="hover:text-espresso">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-espresso font-medium">Brew Haven Pay</span>
      </div>

      {/* ── STEP 1 & 2: MOBILE AUTH / OTP POPUP IF NOT LOGGED IN ── */}
      {(authStep === "phone" || authStep === "otp") && (
        <div className="py-20 px-6 max-w-md mx-auto">
          <div className="bg-white p-8 rounded-3xl border border-latte/30 shadow-luxury space-y-6 text-espresso">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#103E2E]/10 rounded-full flex items-center justify-center text-[#103E2E] mx-auto">
                <CreditCard className="w-7 h-7" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#103E2E]">Brew Haven Pay</h1>
              <p className="text-xs text-mid">
                Sign in to manage your digital card, reload funds, and scan in-store.
              </p>
            </div>

            {authStep === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-wider text-mid font-semibold mb-2">
                    MOBILE NUMBER
                  </label>

                  <div className="flex items-center border-b-2 border-latte/40 focus-within:border-[#103E2E] pb-2">
                    <span className="text-sm font-semibold mr-3">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      placeholder="Enter 10-Digit Mobile Number"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-sm font-sans placeholder-mid/50 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={mobileInput.length < 10}
                  className={`w-full py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md ${
                    mobileInput.length >= 10
                      ? "bg-[#103E2E] text-cream hover:bg-espresso cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </form>
            )}

            {authStep === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-wider text-mid font-semibold mb-2">
                    ENTER OTP (Demo: 1234)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="1234"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full text-center text-2xl tracking-[0.5em] font-mono border-b-2 border-[#103E2E] pb-2 text-espresso focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpInput.length < 4}
                  className={`w-full py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md ${
                    otpInput.length >= 4
                      ? "bg-[#103E2E] text-cream hover:bg-espresso cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Verify OTP
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: "ONE FINAL STEP, TELL US A LITTLE ABOUT YOU" FORM ── */}
      {authStep === "profile_form" && (
        <div className="py-12 px-6 max-w-4xl mx-auto">
          {/* Step Progress Bar Header */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-9 h-9 rounded-full bg-[#103E2E] text-cream font-bold text-sm flex items-center justify-center">
              1
            </div>
            <div className="w-48 h-1 bg-[#103E2E]/30 rounded-full" />
            <div className="w-9 h-9 rounded-full border-2 border-[#103E2E] text-[#103E2E] font-bold text-sm flex items-center justify-center">
              2
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl border border-latte/20 shadow-luxury space-y-8">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-[#103E2E] uppercase">
                ONE FINAL STEP, TELL US A LITTLE ABOUT YOU
              </h1>
              <p className="text-xs text-mid mt-2 font-sans">
                You're signing up with{" "}
                <span className="text-[#103E2E] font-semibold underline">
                  +91{profile?.mobile || mobileInput || "9876543210"}
                </span>
              </p>
            </div>

            <form onSubmit={handleProfileFormSubmit} className="space-y-8 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-[0.65rem] uppercase tracking-wider text-mid font-semibold">
                    FIRST NAME*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border-b border-latte/40 py-2.5 text-espresso placeholder-mid/40 focus:outline-none focus:border-[#103E2E] text-sm bg-transparent"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-[0.65rem] uppercase tracking-wider text-mid font-semibold">
                    LAST NAME*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border-b border-latte/40 py-2.5 text-espresso placeholder-mid/40 focus:outline-none focus:border-[#103E2E] text-sm bg-transparent"
                  />
                </div>

                {/* Email ID */}
                <div className="space-y-2">
                  <label className="block text-[0.65rem] uppercase tracking-wider text-mid font-semibold">
                    EMAIL ID*
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-latte/40 py-2.5 text-espresso placeholder-mid/40 focus:outline-none focus:border-[#103E2E] text-sm bg-transparent"
                  />
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <label className="block text-[0.65rem] uppercase tracking-wider text-mid font-semibold">
                    BIRTH DATE*
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="DD/MM/YYYY"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full border-b border-latte/40 py-2.5 text-espresso placeholder-mid/40 focus:outline-none focus:border-[#103E2E] text-sm bg-transparent pr-8"
                    />
                    <Calendar className="w-4 h-4 text-[#103E2E] absolute right-2 pointer-events-none" />
                  </div>
                  <p className="text-[0.65rem] text-mid mt-1 font-light leading-relaxed">
                    Share your birthdate to receive a reward during that month. It can not be changed after submission.
                  </p>
                </div>
              </div>

              {/* Got a Referral Code Banner */}
              <div className="bg-[#EAE0D0] p-6 rounded-2xl border border-latte/40 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#103E2E]">Got a referral code?</h3>
                <p className="text-xs text-espresso/70">
                  If you have a Brew Haven referral code, enter it here for a special reward.
                </p>
                <input
                  type="text"
                  placeholder="Enter Referral Code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full md:w-72 bg-white border border-latte/40 px-3 py-2 text-xs uppercase tracking-wider font-mono text-espresso focus:outline-none focus:border-[#103E2E]"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#103E2E] text-cream hover:bg-espresso px-10 py-4 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
                >
                  Create Profile & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── STEP 4: BREW HAVEN PAY DASHBOARD ── */}
      {authStep === "dashboard" && (
        <div className="space-y-12 pb-24">
          {/* Green Top Header */}
          <div className="bg-[#103E2E] text-cream py-10 px-6 md:px-12 border-b border-latte/20">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold">My Brew Haven Cards</h1>
                <p className="text-xs text-cream/70 mt-1 font-sans">
                  Signed in as{" "}
                  <strong className="text-latte font-semibold">
                    {profile?.firstName} {profile?.lastName}
                  </strong>{" "}
                  ({profile?.mobile}) • <span className="text-latte">{profile?.stars || 120} Haven Stars 🌟</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowLoadCardModal(true)}
                  className="text-xs font-semibold uppercase tracking-wider text-latte hover:text-cream transition-colors"
                >
                  VIEW ALL CARDS
                </button>

                <button
                  onClick={() => setShowLoadCardModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-cream px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Card</span>
                </button>
              </div>
            </div>

            {/* Cards Carousel Grid */}
            <div className="max-w-[1200px] mx-auto pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Active Brew Haven Digital Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-latte/30 text-espresso flex flex-col justify-between">
                {/* Wave Banner Graphic */}
                <div className="h-44 bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-700 p-6 flex flex-col justify-between text-cream relative">
                  <div className="flex justify-between items-start">
                    <span className="bg-[#103E2E] text-cream text-[0.65rem] font-semibold uppercase tracking-wider px-3 py-1 rounded-md flex items-center gap-1">
                      ✓ Primary
                    </span>
                    <div className="w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-center font-serif text-xs font-bold">
                      BH
                    </div>
                  </div>

                  <div className="font-serif text-2xl font-light tracking-wide">Brew Haven Card</div>
                </div>

                {/* Card Balance Details */}
                <div className="p-6 flex items-center justify-between bg-white">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-espresso">Aroma | *0757</h3>
                    <div className="font-mono text-3xl font-bold text-[#103E2E] mt-1">
                      ₹{(profile?.cardBalance || 0).toFixed(2)}
                    </div>
                    <p className="text-[0.65rem] text-mid mt-1 font-mono">
                      Updated just now
                    </p>
                  </div>

                  <button
                    onClick={() => setShowLoadCardModal(true)}
                    className="bg-[#103E2E] hover:bg-espresso text-cream px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-latte" />
                    <span>Load Card</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Add New Brew Haven Card Slot */}
              <div
                onClick={() => setShowLoadCardModal(true)}
                className="bg-[#3D4743]/30 border-2 border-dashed border-latte/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#3D4743]/50 transition-all text-cream min-h-[220px]"
              >
                <h3 className="font-serif text-2xl font-bold text-cream mb-4">
                  Add new Brew Haven card
                </h3>
                <button className="bg-dark/80 hover:bg-dark text-cream border border-latte/40 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all">
                  <Plus className="w-4 h-4 text-latte" />
                  <span>Add Card</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── BARCODE SCAN SECTION ── */}
          <section className="max-w-[1200px] mx-auto px-6 md:px-12 text-center space-y-6 py-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#103E2E]">
              Scan the Barcode and Pay at the Store
            </h2>

            {/* Generated Live Barcode */}
            <div className="bg-white p-8 max-w-lg mx-auto border border-latte/30 shadow-luxury rounded-2xl space-y-3">
              <div className="w-full h-24 flex items-center justify-center font-mono text-4xl tracking-[0.2em] font-bold text-espresso select-none">
                ||||| | |||| |||||| ||| ||||| ||||
              </div>
              <p className="font-mono text-sm tracking-[0.3em] font-semibold text-espresso">
                XXXX XXXX 8607 57
              </p>
            </div>
          </section>

          {/* ── AVAILABLE REWARDS & OFFERS SECTION ── */}
          <section className="bg-parchment/40 py-12 border-t border-latte/20">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 space-y-8">
              <div className="flex items-center gap-6 border-b border-latte/20 pb-3 text-sm font-semibold">
                <button className="text-[#103E2E] border-b-2 border-[#103E2E] pb-3 uppercase tracking-wider">
                  Available Rewards
                </button>
                <button className="text-mid hover:text-espresso pb-3 uppercase tracking-wider">
                  Redeem Rewards
                </button>
              </div>

              {/* Coupons List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coupon 1 */}
                <div className="bg-white p-6 rounded-2xl border border-latte/30 shadow-sm flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="bg-[#103E2E] text-latte text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                      ★ REWARD REDEEMED
                    </span>
                    <h3 className="font-serif text-lg font-bold text-espresso">
                      Buy 1 Food, Get 50% Off on second item
                    </h3>
                    <p className="text-[0.7rem] text-mid font-mono">EXPIRES ON 31/07/2026</p>

                    <div className="pt-2 flex items-center gap-4">
                      <Link
                        href="/menu"
                        className="bg-[#103E2E] text-cream hover:bg-espresso px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        Use Reward
                      </Link>
                      <button className="text-xs font-semibold text-[#103E2E] underline">
                        Details
                      </button>
                    </div>
                  </div>

                  <div className="w-20 h-20 relative rounded-xl overflow-hidden shrink-0 border border-latte/20">
                    <Image
                      src="https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&q=80"
                      alt="Matcha Latte Reward"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Coupon 2 */}
                <div className="bg-white p-6 rounded-2xl border border-latte/30 shadow-sm flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="bg-[#103E2E] text-latte text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                      ★ REWARD REDEEMED
                    </span>
                    <h3 className="font-serif text-lg font-bold text-espresso">
                      25 % Off Football Glass Bearista Cold Cup
                    </h3>
                    <p className="text-[0.7rem] text-mid font-mono">EXPIRES ON 31/07/2026</p>

                    <div className="pt-2 flex items-center gap-4">
                      <Link
                        href="/menu"
                        className="bg-[#103E2E] text-cream hover:bg-espresso px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        Use Reward
                      </Link>
                      <button className="text-xs font-semibold text-[#103E2E] underline">
                        Details
                      </button>
                    </div>
                  </div>

                  <div className="w-20 h-20 relative rounded-xl overflow-hidden shrink-0 border border-latte/20">
                    <Image
                      src="https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&q=80"
                      alt="Bearista Glass Cup Reward"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <Link
                  href="/menu"
                  className="bg-dark text-cream hover:bg-espresso px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider inline-block transition-colors shadow-md"
                >
                  View all Rewards
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── LOAD CARD MODAL ── */}
      {showLoadCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-espresso space-y-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-[#103E2E]">Reload Brew Haven Card</h2>
            <p className="text-xs text-mid">
              Select or enter the amount you wish to reload to your primary Brew Haven Card balance.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {["500", "1000", "2000"].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setLoadAmount(amt)}
                  className={`py-3 rounded-xl border text-xs font-bold font-mono transition-all ${
                    loadAmount === amt
                      ? "bg-[#103E2E] text-cream border-[#103E2E]"
                      : "border-latte/30 text-espresso hover:border-[#103E2E]"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[0.65rem] uppercase tracking-wider text-mid font-semibold mb-2">
                Custom Amount (₹)
              </label>
              <input
                type="number"
                value={loadAmount}
                onChange={(e) => setLoadAmount(e.target.value)}
                className="w-full border-b-2 border-[#103E2E] p-2 text-lg font-mono font-bold text-espresso focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowLoadCardModal(false)}
                className="px-5 py-2.5 text-xs font-semibold text-mid hover:text-espresso"
              >
                Cancel
              </button>
              <button
                onClick={handleLoadCard}
                className="bg-[#103E2E] text-cream hover:bg-espresso px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
              >
                Confirm Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
