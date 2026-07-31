"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  HelpCircle,
  Bookmark,
  LogOut,
  Bell,
  Settings,
  Pencil,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { CustomerAuthModal } from "@/components/CustomerAuthModal";

interface CustomerProfile {
  mobile: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  referralCode?: string;
  stars?: number;
  cardBalance?: number;
}

export default function AccountProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("brew_haven_customer");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("brew_haven_customer");
    setProfile(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-espresso font-serif">
        Loading Account Profile...
      </div>
    );
  }

  // IF NOT LOGGED IN: Prompt to login / signup
  if (!profile) {
    return (
      <div className="pt-28 pb-24 bg-cream min-h-screen font-sans">
        <div className="max-w-[1200px] mx-auto px-6 py-4 text-xs text-mid">
          <Link href="/" className="hover:text-espresso">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-espresso font-medium">Account</span>
        </div>

        <div className="max-w-md mx-auto py-16 px-6 text-center space-y-6">
          <div className="w-20 h-20 bg-[#103E2E]/10 rounded-full flex items-center justify-center text-[#103E2E] mx-auto">
            <UserIcon className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-4xl text-[#103E2E] font-bold">Sign In to Your Account</h1>
          <p className="text-mid text-xs leading-relaxed max-w-sm mx-auto">
            Log in with your mobile number to view your rewards, order history, digital cards, and account settings.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-4 bg-[#103E2E] text-cream hover:bg-espresso rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            Log In / Sign Up
          </button>

          <CustomerAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
      </div>
    );
  }

  const fullName = profile.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`.trim()
    : `User +91 ${profile.mobile}`;

  return (
    <div className="bg-cream min-h-screen font-sans">
      {/* Top Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-6 py-4 text-xs text-mid">
        <Link href="/" className="hover:text-espresso">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-mid">Profile</span>
        <span className="mx-2">&gt;</span>
        <span className="text-espresso font-medium">Account</span>
      </div>

      {/* ── DARK GREEN HEADER BANNER (SCREENSHOT 1 MATCH) ── */}
      <div className="bg-[#103E2E] text-cream py-12 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center justify-center text-center">
          {/* Header Action Icons Top Right */}
          <div className="absolute top-0 right-0 flex items-center gap-4 text-cream/70">
            <button className="hover:text-latte transition-colors p-1" title="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <button className="hover:text-latte transition-colors p-1" title="Settings">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Avatar Graphic with Edit Pencil Button */}
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full border-4 border-white/90 bg-[#1e523f] flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="text-center space-y-0.5">
                <div className="w-10 h-10 mx-auto rounded-md bg-emerald-400 border-2 border-white flex items-center justify-center text-[#103E2E] font-bold text-xs">
                  ☕
                </div>
                <div className="text-[0.55rem] font-mono text-emerald-200">HAVEN</div>
              </div>
            </div>
            {/* Edit Pencil Icon Badge */}
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-600 border-2 border-[#103E2E] rounded-full flex items-center justify-center text-cream cursor-pointer hover:bg-emerald-500 transition-all shadow-md">
              <Pencil className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Name & Tier */}
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-cream">
            {fullName}
          </h1>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mt-1 font-mono">
            Green Tier • {profile.stars || 120} Haven Stars 🌟
          </span>
          <p className="text-[0.7rem] text-cream/60 mt-1 font-mono">+91 {profile.mobile}</p>
        </div>
      </div>

      {/* ── ACCOUNT OPTIONS NAVIGATION LIST (SCREENSHOT 2 & 3 MATCH) ── */}
      <div className="max-w-[900px] mx-auto px-6 py-10 space-y-4">
        <div className="bg-white rounded-3xl border border-latte/20 shadow-luxury overflow-hidden divide-y divide-latte/15">
          {/* 1. BREW HAVEN REWARDS */}
          <Link
            href="/pay"
            className="p-5 md:p-6 flex items-center justify-between hover:bg-parchment/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#103E2E]/10 text-[#103E2E] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm md:text-base font-bold uppercase tracking-wider text-espresso group-hover:text-[#103E2E] transition-colors">
                BREW HAVEN REWARDS
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-mid group-hover:text-espresso transition-colors" />
          </Link>

          {/* 2. ORDERS */}
          <Link
            href="/cart"
            className="p-5 md:p-6 flex items-center justify-between hover:bg-parchment/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#103E2E]/10 text-[#103E2E] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm md:text-base font-bold uppercase tracking-wider text-espresso group-hover:text-[#103E2E] transition-colors">
                ORDERS
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-mid group-hover:text-espresso transition-colors" />
          </Link>

          {/* 3. MY EVENTS */}
          <Link
            href="/contact?tab=reservation"
            className="p-5 md:p-6 flex items-center justify-between hover:bg-parchment/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#103E2E]/10 text-[#103E2E] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm md:text-base font-bold uppercase tracking-wider text-espresso group-hover:text-[#103E2E] transition-colors">
                MY EVENTS & RESERVATIONS
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-mid group-hover:text-espresso transition-colors" />
          </Link>

          {/* 4. BREW HAVEN PAY */}
          <Link
            href="/pay"
            className="p-5 md:p-6 flex items-center justify-between hover:bg-parchment/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#103E2E]/10 text-[#103E2E] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm md:text-base font-bold uppercase tracking-wider text-espresso group-hover:text-[#103E2E] transition-colors">
                BREW HAVEN PAY
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-mid group-hover:text-espresso transition-colors" />
          </Link>

          {/* 5. OTHER PAYMENT MODES */}
          <Link
            href="/checkout"
            className="p-5 md:p-6 flex items-center justify-between hover:bg-parchment/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#103E2E]/10 text-[#103E2E] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm md:text-base font-bold uppercase tracking-wider text-espresso group-hover:text-[#103E2E] transition-colors">
                OTHER PAYMENT MODES
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-mid group-hover:text-espresso transition-colors" />
          </Link>

          {/* 6. MY ADDRESSES */}
          <Link
            href="/store"
            className="p-5 md:p-6 flex items-center justify-between hover:bg-parchment/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#103E2E]/10 text-[#103E2E] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm md:text-base font-bold uppercase tracking-wider text-espresso group-hover:text-[#103E2E] transition-colors">
                MY ADDRESSES & STORES
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-mid group-hover:text-espresso transition-colors" />
          </Link>

          {/* 7. HELP CENTER */}
          <Link
            href="/contact"
            className="p-5 md:p-6 flex items-center justify-between hover:bg-parchment/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#103E2E]/10 text-[#103E2E] flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm md:text-base font-bold uppercase tracking-wider text-espresso group-hover:text-[#103E2E] transition-colors">
                HELP CENTER
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-mid group-hover:text-espresso transition-colors" />
          </Link>

          {/* 8. SAVED ARTICLES & NEWS */}
          <Link
            href="/about"
            className="p-5 md:p-6 flex items-center justify-between hover:bg-parchment/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#103E2E]/10 text-[#103E2E] flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="font-sans text-sm md:text-base font-bold uppercase tracking-wider text-espresso group-hover:text-[#103E2E] transition-colors">
                SAVED ARTICLES & NEWS
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-mid group-hover:text-espresso transition-colors" />
          </Link>
        </div>

        {/* 9. LOG OUT BUTTON (RED TEXT MATCHING PIC 3) */}
        <div className="pt-6">
          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 text-red-600 hover:text-red-700 font-bold uppercase tracking-wider text-sm p-4 transition-colors font-sans"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span>LOG OUT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
