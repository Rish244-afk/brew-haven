"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck,
  MessageSquare,
  LogOut,
  Store,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Menu Manager", href: "/admin/menu", icon: UtensilsCrossed },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Reservations", href: "/admin/reservations", icon: CalendarCheck },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#140D05] text-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark border-r border-latte/15 flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div>
            <Link href="/" className="font-serif text-2xl font-normal text-cream block">
              Brew<span className="text-latte">Haven</span>
            </Link>
            <p className="text-[0.65rem] uppercase tracking-widest text-latte/80 mt-1 font-mono">
              Admin Portal
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-xs tracking-wider uppercase transition-all ${
                    isActive
                      ? "bg-latte text-dark font-medium shadow-gold"
                      : "text-cream/70 hover:bg-espresso hover:text-cream"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="pt-6 border-t border-latte/15 space-y-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-latte hover:underline"
          >
            <Store className="w-4 h-4" />
            <span>View Live Cafe Site</span>
          </Link>

          <div className="text-xs text-cream/50 truncate">
            {session?.user?.email || "admin@brewhaven.co"}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-950/30 text-red-400 border border-red-500/30 hover:bg-red-900/40 text-xs uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="md:hidden bg-dark border-b border-latte/15 p-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-cream">
            Brew<span className="text-latte">Haven</span> Admin
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-xs text-red-400 border border-red-500/30 px-3 py-1"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div className="md:hidden bg-espresso p-3 border-b border-latte/15 flex overflow-x-auto gap-2 text-xs">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 whitespace-nowrap uppercase tracking-wider ${
                pathname === item.href ? "bg-latte text-dark font-medium" : "text-cream/70"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <main className="p-6 md:p-12 flex-1">{children}</main>
      </div>
    </div>
  );
}
