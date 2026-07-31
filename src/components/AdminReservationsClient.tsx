"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, Phone, Mail, Check, X, Clock } from "lucide-react";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  partySize: number;
  date: string | Date;
  time: string;
  notes?: string | null;
  status: string;
  createdAt: string | Date;
}

export function AdminReservationsClient({
  initialReservations,
}: {
  initialReservations: Reservation[];
}) {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleUpdateStatus = async (id: string, status: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    try {
      await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to update reservation status:", err);
    }
  };

  const filtered =
    statusFilter === "all"
      ? reservations
      : reservations.filter((r) => r.status === statusFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream font-light">Table Reservations</h1>
          <p className="text-xs text-latte/80 font-sans tracking-widest uppercase mt-1">
            Booking Requests & Table Confirmations
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-sans">
          {["all", "pending", "confirmed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 uppercase tracking-wider border transition-all ${
                statusFilter === st
                  ? "bg-latte text-dark border-latte font-medium"
                  : "border-latte/20 text-cream/70 hover:text-cream"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-espresso p-12 text-center border border-latte/20 text-cream/60">
          <p className="font-serif text-2xl">No reservations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((res) => (
            <div
              key={res.id}
              className="bg-espresso border border-latte/20 shadow-lg p-6 space-y-4 font-sans text-xs"
            >
              <div className="flex items-start justify-between pb-3 border-b border-latte/15">
                <div>
                  <h3 className="font-serif text-2xl text-cream">{res.name}</h3>
                  <div className="flex items-center gap-3 text-cream/60 text-[0.7rem] mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-latte" /> {res.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-latte" /> {res.phone}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-[0.65rem] uppercase tracking-wider font-semibold border ${
                    res.status === "confirmed"
                      ? "border-emerald-500/50 text-emerald-400 bg-emerald-950/20"
                      : res.status === "cancelled"
                      ? "border-red-500/50 text-red-400 bg-red-950/20"
                      : "border-amber-500/50 text-amber-400 bg-amber-950/20"
                  }`}
                >
                  {res.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-dark/40 p-3 border border-latte/10 text-center">
                <div>
                  <span className="block text-[0.6rem] uppercase tracking-wider text-latte">
                    Date
                  </span>
                  <span className="font-mono text-cream text-[0.75rem]">
                    {new Date(res.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="block text-[0.6rem] uppercase tracking-wider text-latte">
                    Time
                  </span>
                  <span className="font-mono text-cream text-[0.75rem]">{res.time}</span>
                </div>
                <div>
                  <span className="block text-[0.6rem] uppercase tracking-wider text-latte">
                    Guests
                  </span>
                  <span className="font-mono text-cream text-[0.75rem]">
                    {res.partySize} {res.partySize === 1 ? "Person" : "People"}
                  </span>
                </div>
              </div>

              {res.notes && (
                <div className="p-3 bg-dark/30 border border-latte/10 text-[0.7rem] text-cream/70 italic">
                  "{res.notes}"
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-latte/10">
                {res.status !== "confirmed" && (
                  <button
                    onClick={() => handleUpdateStatus(res.id, "confirmed")}
                    className="px-3 py-1.5 bg-emerald-900/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-800/60 uppercase tracking-wider text-[0.65rem] flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm</span>
                  </button>
                )}

                {res.status !== "cancelled" && (
                  <button
                    onClick={() => handleUpdateStatus(res.id, "cancelled")}
                    className="px-3 py-1.5 bg-red-900/40 text-red-300 border border-red-500/40 hover:bg-red-800/60 uppercase tracking-wider text-[0.65rem] flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
