"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Navigation, Wifi, Utensils, Compass, Clock } from "lucide-react";

interface StoreItem {
  id: string;
  name: string;
  address: string;
  status: "Open" | "Closed";
  hours: string;
  distance: string;
  eta: string;
  lat: number;
  lng: number;
  amenities: ("dine_in" | "wifi" | "drive_thru")[];
}

const STORES: StoreItem[] = [
  {
    id: "store-1",
    name: "Indiqube Bangalore",
    address: "Indiqube Gamma, Outer Ring Rd, Kadubeesanahalli, Bengaluru",
    status: "Open",
    hours: "8:00 AM – 11:00 PM",
    distance: "4.6kms away",
    eta: "14 min",
    lat: 12.9348,
    lng: 77.6912,
    amenities: ["dine_in", "wifi"],
  },
  {
    id: "store-2",
    name: "HSR Layout Bangalore",
    address: "27th Main Rd, Sector 1, HSR Layout, Bengaluru",
    status: "Open",
    hours: "7:00 AM – 11:30 PM",
    distance: "6.1kms away",
    eta: "17 min",
    lat: 12.9116,
    lng: 77.6389,
    amenities: ["dine_in", "wifi", "drive_thru"],
  },
  {
    id: "store-3",
    name: "Goldman Sachs Bangalore",
    address: "Embassy GolfLinks Business Park, Domlur, Bengaluru",
    status: "Open",
    hours: "8:00 AM – 10:00 PM",
    distance: "7.6kms away",
    eta: "19 min",
    lat: 12.9569,
    lng: 77.6438,
    amenities: ["dine_in", "wifi"],
  },
  {
    id: "store-4",
    name: "RMZ Eco World",
    address: "Adarsh Palm Retreat, Bellandur, Bengaluru",
    status: "Open",
    hours: "7:30 AM – 11:00 PM",
    distance: "7.7kms away",
    eta: "21 min",
    lat: 12.9261,
    lng: 77.6828,
    amenities: ["dine_in", "wifi"],
  },
  {
    id: "store-5",
    name: "Electronic City Phase II",
    address: "Tech Park Mall, Velankani Drive, Electronic City, Bengaluru",
    status: "Open",
    hours: "8:00 AM – 10:30 PM",
    distance: "11.2kms away",
    eta: "28 min",
    lat: 12.8452,
    lng: 77.6602,
    amenities: ["dine_in", "wifi", "drive_thru"],
  },
];

export default function StoreLocatorPage() {
  const [activeTab, setActiveTab] = useState<"nearby" | "favourites" | "previous">("nearby");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreItem>(STORES[0]);

  const filteredStores = STORES.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-cream min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-4 text-xs text-mid">
        <Link href="/" className="hover:text-espresso">Home</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-espresso font-medium">Find A Store</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh]">
        {/* LEFT PANEL: SEARCH & STORES LIST */}
        <div className="lg:col-span-4 bg-white border-r border-latte/20 flex flex-col h-full">
          {/* Search Header */}
          <div className="bg-[#103E2E] p-6 space-y-4 text-cream">
            <div className="relative">
              <Search className="w-4 h-4 text-latte absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find a store near you"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-espresso placeholder-mid/70 rounded-full pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-latte"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-latte/20 text-xs font-semibold px-6 pt-3">
            <button
              onClick={() => setActiveTab("nearby")}
              className={`pb-3 px-2 tracking-wider uppercase transition-colors relative ${
                activeTab === "nearby"
                  ? "text-[#103E2E] border-b-2 border-[#103E2E]"
                  : "text-mid hover:text-espresso"
              }`}
            >
              Nearby
            </button>
            <button
              onClick={() => setActiveTab("favourites")}
              className={`pb-3 px-4 tracking-wider uppercase transition-colors relative ${
                activeTab === "favourites"
                  ? "text-[#103E2E] border-b-2 border-[#103E2E]"
                  : "text-mid hover:text-espresso"
              }`}
            >
              Favourites
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`pb-3 px-4 tracking-wider uppercase transition-colors relative ${
                activeTab === "previous"
                  ? "text-[#103E2E] border-b-2 border-[#103E2E]"
                  : "text-mid hover:text-espresso"
              }`}
            >
              Previous
            </button>
          </div>

          {/* Stores Cards Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[70vh]">
            {filteredStores.length === 0 ? (
              <div className="text-center py-12 text-mid text-xs">
                No stores found matching "{searchQuery}".
              </div>
            ) : (
              filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    selectedStore.id === store.id
                      ? "border-[#103E2E] bg-parchment/40 shadow-md"
                      : "border-latte/20 bg-white hover:border-[#103E2E]/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#103E2E]/10 border border-[#103E2E]/20 flex items-center justify-center text-[#103E2E] shrink-0 font-serif font-bold text-sm">
                        BH
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-espresso">
                          {store.name}
                        </h3>
                        <div className="flex items-center gap-2 text-[0.7rem] text-mid mt-0.5 font-sans">
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                            {store.status}
                          </span>
                          <span>•</span>
                          <span>{store.distance}</span>
                          <span>•</span>
                          <span>{store.eta}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        store.name + " " + store.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#103E2E] text-cream hover:bg-espresso px-4 py-1.5 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Directions</span>
                    </a>
                  </div>

                  <p className="text-xs text-mid leading-relaxed font-sans">{store.address}</p>

                  {/* Amenities */}
                  <div className="flex items-center justify-between pt-2 border-t border-latte/10 text-mid text-[0.7rem]">
                    <div className="flex items-center gap-3">
                      {store.amenities.includes("dine_in") && (
                        <span className="flex items-center gap-1" title="Dine-in available">
                          <Utensils className="w-3.5 h-3.5 text-[#103E2E]" />
                          <span>Dine-in</span>
                        </span>
                      )}
                      {store.amenities.includes("wifi") && (
                        <span className="flex items-center gap-1" title="Free Wi-Fi">
                          <Wifi className="w-3.5 h-3.5 text-[#103E2E]" />
                          <span>Free Wi-Fi</span>
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-espresso text-[0.65rem]">{store.hours}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE EMBEDDED MAP VIEW */}
        <div className="lg:col-span-8 relative h-[500px] lg:h-full bg-dark/10 overflow-hidden">
          <iframe
            title="Brew Haven Store Map"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              selectedStore.lat + "," + selectedStore.lng
            )}&z=14&output=embed`}
          />

          {/* Current Location GPS Button */}
          <div className="absolute bottom-6 right-6 bg-white shadow-luxury border border-latte/30 rounded-xl p-3 flex items-center gap-3 text-xs font-semibold text-espresso">
            <Compass className="w-5 h-5 text-[#103E2E] animate-pulse" />
            <div>
              <p className="text-[0.65rem] uppercase tracking-wider text-mid">Current Location</p>
              <p className="text-[#103E2E] font-bold">USING GPS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
