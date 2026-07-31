"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu as MenuIcon, X, Sparkles, User } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { CustomerAuthModal } from "./CustomerAuthModal";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { toggleCart, getTotalCount } = useCartStore();
  const cartItemCount = getTotalCount();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Order", href: "/menu" },
    { name: "Gift", href: "/about" },
    { name: "Pay", href: "/pay" },
    { name: "Store", href: "/store" },
  ];

  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) return null;

  return (
    <>
      {/* Starbucks Top Rewards Banner */}
      <div className="bg-[#103E2E] text-cream text-[0.72rem] font-sans py-2 px-6 flex items-center justify-between z-50 relative border-b border-latte/20">
        <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2 text-latte hover:underline text-left"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-cream font-light">
              Sign in to <strong className="text-latte font-medium">Earn Haven Stars</strong> on every order
            </span>
          </button>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="bg-cream/10 hover:bg-latte hover:text-dark text-cream border border-cream/20 px-3 py-0.5 rounded-full text-[0.65rem] tracking-wider uppercase transition-all"
          >
            Know More
          </button>
        </div>
      </div>

      {/* Main Starbucks Navbar */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "bg-[#1A1208]/95 backdrop-blur-md border-b border-[#C9A96E]/20 shadow-lg"
            : "bg-[#1A1208] border-b border-latte/15"
        }`}
      >
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 py-3.5 flex items-center justify-between gap-6">
          {/* Logo & Links */}
          <div className="flex items-center gap-10">
            <Link href="/" className="font-serif text-2xl font-normal tracking-wide text-cream shrink-0">
              Brew<span className="text-latte">Haven</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[0.72rem] tracking-[0.18em] uppercase transition-colors duration-300 relative py-1 ${
                      isActive ? "text-latte font-medium" : "text-cream/80 hover:text-cream"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-latte" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Starbucks Search Bar, User Profile 👤 & Actions */}
          <div className="flex items-center gap-4">
            {/* Starbucks Style Search Input */}
            <div className="hidden sm:flex items-center bg-dark/80 border border-latte/30 rounded-full px-4 py-1.5 w-56 md:w-64 text-xs text-cream focus-within:border-latte transition-all">
              <Search className="w-3.5 h-3.5 text-latte mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Looking for something specific?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-cream placeholder-cream/40 focus:outline-none w-full text-[0.75rem]"
              />
            </div>

            {/* Starbucks Customer Profile Icon 👤 */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-cream/80 hover:text-latte transition-colors p-2 rounded-full hover:bg-dark/50"
              aria-label="Customer Login Profile"
              title="Customer Login / Sign Up"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative text-latte hover:text-cream transition-colors p-2"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-latte text-dark font-sans font-bold text-[0.65rem] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Reserve Table Button */}
            <Link
              href="/contact?tab=reservation"
              className="hidden md:inline-block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-latte border border-latte/40 px-4 py-2 rounded-full hover:bg-latte hover:text-dark transition-all duration-300"
            >
              Reserve Table
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-cream p-2 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <div
        className={`fixed inset-0 bg-[#1A1208] z-30 flex flex-col items-center justify-center gap-6 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="font-serif text-3xl text-cream hover:text-latte transition-colors tracking-wide"
          >
            {link.name}
          </Link>
        ))}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setAuthModalOpen(true);
          }}
          className="mt-2 font-sans text-[0.75rem] tracking-[0.2em] uppercase text-cream border border-cream/40 px-8 py-3 rounded-full"
        >
          Customer Login / SignUp
        </button>
      </div>

      {/* Starbucks Customer Auth Modal */}
      <CustomerAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
