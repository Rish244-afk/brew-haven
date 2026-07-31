"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Our Story", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return null; // Admin has its own sidebar layout

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-[72px] flex items-center ${
          scrolled || mobileMenuOpen
            ? "bg-[#1A1208]/95 backdrop-blur-md border-b border-[#C9A96E]/20 shadow-lg"
            : "bg-gradient-to-b from-[#1A1208]/80 to-transparent"
        }`}
      >
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-normal tracking-wide text-cream">
            Brew<span className="text-latte">Haven</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[0.72rem] tracking-[0.18em] uppercase transition-colors duration-300 relative py-1 ${
                    isActive ? "text-cream font-medium" : "text-cream/70 hover:text-cream"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-latte" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart & Reserve */}
          <div className="flex items-center gap-5">
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
              className="hidden sm:inline-block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-latte border border-latte/40 px-5 py-2 hover:bg-latte hover:text-dark hover:border-latte transition-all duration-300"
            >
              Reserve a Table
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-cream p-2 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-[#1A1208] z-40 flex flex-col items-center justify-center gap-8 transition-opacity duration-400 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-serif text-3xl text-cream hover:text-latte transition-colors tracking-wide"
          >
            {link.name}
          </Link>
        ))}
        <Link
          href="/contact?tab=reservation"
          className="mt-4 font-sans text-[0.75rem] tracking-[0.2em] uppercase text-latte border border-latte px-8 py-3.5"
        >
          Reserve a Table
        </Link>
      </div>
    </>
  );
}
