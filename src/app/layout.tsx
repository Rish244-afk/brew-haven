import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Brew Haven — Crafted Coffee, Quiet Luxury",
  description:
    "Experience slow-brewed perfection in a space designed for calm, comfort, and connection. Single-origin beans, precision brewing, and artisanal dining.",
  keywords: ["Brew Haven", "Boutique Cafe", "Craft Coffee", "Quiet Luxury", "Artisan Espresso"],
  openGraph: {
    title: "Brew Haven — Crafted Coffee, Quiet Luxury",
    description: "Experience slow-brewed perfection in a space designed for calm, comfort, and connection.",
    siteName: "Brew Haven",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-latte selection:text-dark">
        <Providers>
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
