"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-dark text-cream/70 pt-20 pb-10 border-t border-latte/10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-latte/15">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl text-cream font-normal mb-4">
              Brew<span className="text-latte">Haven</span>
            </h3>
            <p className="text-sm font-sans font-light leading-relaxed max-w-[260px] text-cream/60 mb-6 italic">
              "Coffee is not rushed — it is respected."
            </p>
            <div className="flex items-center gap-3 text-latte">
              <a
                href="#"
                className="w-9 h-9 border border-latte/30 flex items-center justify-center text-xs hover:bg-latte hover:text-dark transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-latte/30 flex items-center justify-center text-xs hover:bg-latte hover:text-dark transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-latte/30 flex items-center justify-center text-xs hover:bg-latte hover:text-dark transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-latte mb-5">
              Navigate
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <Link href="/" className="hover:text-cream transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-cream transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cream transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cream transition-colors">
                  Contact & Reserve
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-cream transition-colors">
                  Cart Review
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-latte mb-5">
              Opening Hours
            </h4>
            <div className="space-y-3 text-sm font-light text-cream/70">
              <p>
                <strong className="text-cream font-normal">Mon – Fri:</strong> 7:00am – 8:00pm
              </p>
              <p>
                <strong className="text-cream font-normal">Sat – Sun:</strong> 8:00am – 9:00pm
              </p>
              <p className="text-xs text-latte/80 pt-2">
                * Kitchen closes 45 mins before closing.
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-latte mb-5">
              Locate Us
            </h4>
            <ul className="space-y-3 text-sm font-light text-cream/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-latte shrink-0 mt-1" />
                <span>12 Quiet Lane, Haven District, New York, NY</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-latte shrink-0" />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-latte shrink-0" />
                <span>hello@brewhaven.co</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/40 font-light gap-4">
          <p>© {new Date().getFullYear()} Brew Haven Café. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Crafted Coffee, Quiet Luxury</span>
            <Link href="/admin/login" className="hover:text-latte transition-colors underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
