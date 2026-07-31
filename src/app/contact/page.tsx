"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, Clock, Calendar, Users, MessageSquare, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "reservation" ? "reservation" : "contact";
  const [activeTab, setActiveTab] = useState<"reservation" | "contact">(initialTab);

  // Reservation Form State
  const [resForm, setResForm] = useState({
    name: "",
    email: "",
    phone: "",
    partySize: 2,
    date: "",
    time: "10:00 AM",
    notes: "",
    hp_field: "", // honeypot
  });
  const [resStatus, setResStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message?: string }>({
    type: "idle",
  });

  // Contact Form State
  const [msgForm, setMsgForm] = useState({
    name: "",
    email: "",
    type: "general" as "reservation" | "private-event" | "general",
    message: "",
    hp_field: "", // honeypot
  });
  const [msgStatus, setMsgStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message?: string }>({
    type: "idle",
  });

  // Submit Reservation
  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResStatus({ type: "loading" });

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reservation failed.");

      setResStatus({
        type: "success",
        message: "Your table reservation has been received! A confirmation email has been sent.",
      });
      setResForm({
        name: "",
        email: "",
        phone: "",
        partySize: 2,
        date: "",
        time: "10:00 AM",
        notes: "",
        hp_field: "",
      });
    } catch (err: any) {
      setResStatus({ type: "error", message: err.message || "Failed to book reservation." });
    }
  };

  // Submit Contact Message
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgStatus({ type: "loading" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Message failed.");

      setMsgStatus({
        type: "success",
        message: "Thank you! Your message has been sent to our concierge team.",
      });
      setMsgForm({
        name: "",
        email: "",
        type: "general",
        message: "",
        hp_field: "",
      });
    } catch (err: any) {
      setMsgStatus({ type: "error", message: err.message || "Failed to send message." });
    }
  };

  return (
    <div className="pt-28 pb-24 bg-cream">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="eyebrow justify-center">Connect & Visit</div>
          <h1 className="font-serif text-5xl md:text-6xl text-espresso font-light">
            Contact & <em className="italic text-latte">Reservations</em>
          </h1>
          <div className="w-12 h-[1px] bg-latte mx-auto" />
          <p className="text-xs md:text-sm text-mid leading-relaxed font-sans max-w-lg mx-auto">
            Reserve your quiet moment or reach out to our concierge for private events and inquiries.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 border border-latte/20 shadow-sm flex items-start gap-4">
            <MapPin className="w-6 h-6 text-latte shrink-0 mt-1" />
            <div>
              <h3 className="font-serif text-xl text-espresso mb-1">Our Haven</h3>
              <p className="text-xs text-mid leading-relaxed">
                12 Quiet Lane, Haven District<br />New York, NY 10001
              </p>
            </div>
          </div>

          <div className="bg-white p-8 border border-latte/20 shadow-sm flex items-start gap-4">
            <Phone className="w-6 h-6 text-latte shrink-0 mt-1" />
            <div>
              <h3 className="font-serif text-xl text-espresso mb-1">Telephone</h3>
              <p className="text-xs text-mid leading-relaxed">
                +1 (234) 567-8900<br />Mon–Sun: 7am–8pm
              </p>
            </div>
          </div>

          <div className="bg-white p-8 border border-latte/20 shadow-sm flex items-start gap-4">
            <Mail className="w-6 h-6 text-latte shrink-0 mt-1" />
            <div>
              <h3 className="font-serif text-xl text-espresso mb-1">Concierge Email</h3>
              <p className="text-xs text-mid leading-relaxed">
                hello@brewhaven.co<br />events@brewhaven.co
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="max-w-3xl mx-auto bg-white border border-latte/20 shadow-luxury overflow-hidden mb-24">
          <div className="flex border-b border-latte/20">
            <button
              onClick={() => setActiveTab("reservation")}
              className={`flex-1 py-5 text-center font-sans text-xs tracking-[0.2em] uppercase transition-all ${
                activeTab === "reservation"
                  ? "bg-espresso text-cream font-medium border-b-2 border-latte"
                  : "bg-parchment/40 text-espresso/70 hover:text-espresso"
              }`}
            >
              Reserve a Table
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`flex-1 py-5 text-center font-sans text-xs tracking-[0.2em] uppercase transition-all ${
                activeTab === "contact"
                  ? "bg-espresso text-cream font-medium border-b-2 border-latte"
                  : "bg-parchment/40 text-espresso/70 hover:text-espresso"
              }`}
            >
              Send an Enquiry
            </button>
          </div>

          <div className="p-8 md:p-12">
            {/* ── TAB 1: RESERVATION FORM ── */}
            {activeTab === "reservation" && (
              <form onSubmit={handleReservationSubmit} className="space-y-6">
                {resStatus.type === "success" && (
                  <div className="p-4 bg-emerald-950/10 border border-emerald-600/30 text-emerald-800 text-xs flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{resStatus.message}</span>
                  </div>
                )}
                {resStatus.type === "error" && (
                  <div className="p-4 bg-red-950/10 border border-red-600/30 text-red-800 text-xs">
                    {resStatus.message}
                  </div>
                )}

                {/* Honeypot field */}
                <input
                  type="text"
                  name="hp_field"
                  value={resForm.hp_field}
                  onChange={(e) => setResForm({ ...resForm, hp_field: e.target.value })}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={resForm.name}
                      onChange={(e) => setResForm({ ...resForm, name: e.target.value })}
                      className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="eleanor@example.com"
                      value={resForm.email}
                      onChange={(e) => setResForm({ ...resForm, email: e.target.value })}
                      className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={resForm.phone}
                      onChange={(e) => setResForm({ ...resForm, phone: e.target.value })}
                      className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                      Party Size * (Max 8)
                    </label>
                    <select
                      value={resForm.partySize}
                      onChange={(e) => setResForm({ ...resForm, partySize: Number(e.target.value) })}
                      className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={resForm.date}
                      onChange={(e) => setResForm({ ...resForm, date: e.target.value })}
                      className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                      Time Slot *
                    </label>
                    <select
                      value={resForm.time}
                      onChange={(e) => setResForm({ ...resForm, time: e.target.value })}
                      className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                    >
                      {[
                        "08:00 AM",
                        "09:00 AM",
                        "10:00 AM",
                        "11:00 AM",
                        "12:00 PM",
                        "01:00 PM",
                        "02:00 PM",
                        "03:00 PM",
                        "04:00 PM",
                        "05:00 PM",
                        "06:00 PM",
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                    Special Requests / Dietary Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Window seating preference, allergies, or special occasion..."
                    value={resForm.notes}
                    onChange={(e) => setResForm({ ...resForm, notes: e.target.value })}
                    className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resStatus.type === "loading"}
                  className="w-full btn-luxury btn-dark text-center"
                >
                  <span>{resStatus.type === "loading" ? "Submitting..." : "Confirm Table Reservation"}</span>
                </button>
              </form>
            )}

            {/* ── TAB 2: CONTACT ENQUIRY FORM ── */}
            {activeTab === "contact" && (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                {msgStatus.type === "success" && (
                  <div className="p-4 bg-emerald-950/10 border border-emerald-600/30 text-emerald-800 text-xs flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{msgStatus.message}</span>
                  </div>
                )}
                {msgStatus.type === "error" && (
                  <div className="p-4 bg-red-950/10 border border-red-600/30 text-red-800 text-xs">
                    {msgStatus.message}
                  </div>
                )}

                {/* Honeypot field */}
                <input
                  type="text"
                  name="hp_field"
                  value={msgForm.hp_field}
                  onChange={(e) => setMsgForm({ ...msgForm, hp_field: e.target.value })}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian Croft"
                      value={msgForm.name}
                      onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })}
                      className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="julian@example.com"
                      value={msgForm.email}
                      onChange={(e) => setMsgForm({ ...msgForm, email: e.target.value })}
                      className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                    Enquiry Type *
                  </label>
                  <select
                    value={msgForm.type}
                    onChange={(e: any) => setMsgForm({ ...msgForm, type: e.target.value })}
                    className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                  >
                    <option value="general">General Enquiry</option>
                    <option value="reservation">Private Table Reservation</option>
                    <option value="private-event">Private Event / Space Buyout</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-mid mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="How can we assist your Brew Haven experience?"
                    value={msgForm.message}
                    onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
                    className="w-full bg-cream/40 border border-latte/30 p-3 text-xs text-espresso focus:outline-none focus:border-latte"
                  />
                </div>

                <button
                  type="submit"
                  disabled={msgStatus.type === "loading"}
                  className="w-full btn-luxury btn-dark text-center"
                >
                  <span>{msgStatus.type === "loading" ? "Sending..." : "Send Message to Concierge"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Map Section */}
        <div className="bg-espresso text-cream p-8 md:p-12 border border-latte/20 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <div className="eyebrow mb-2">Haven District</div>
              <h3 className="font-serif text-3xl font-light text-cream">
                Finding <em className="italic text-latte">Brew Haven</em>
              </h3>
            </div>
            <p className="text-xs text-cream/60 max-w-sm">
              Located on Quiet Lane between 4th and 5th Avenues. Complimentary valet parking for reserved guests.
            </p>
          </div>

          <div className="w-full h-80 bg-dark relative border border-latte/20 flex items-center justify-center text-center p-6">
            <div className="space-y-3 z-10">
              <MapPin className="w-10 h-10 text-latte mx-auto stroke-[1.5]" />
              <p className="font-serif text-xl text-cream">12 Quiet Lane, New York, NY</p>
              <p className="text-xs text-latte font-mono uppercase tracking-widest">
                40.7128° N, 74.0060° W
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
