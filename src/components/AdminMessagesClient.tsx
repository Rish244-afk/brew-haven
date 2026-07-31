"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle2, Circle } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}

export function AdminMessagesClient({
  initialMessages,
}: {
  initialMessages: ContactMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const nextRead = !currentRead;
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: nextRead } : m))
    );

    try {
      await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: nextRead }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to update message read status:", err);
    }
  };

  const filtered =
    typeFilter === "all"
      ? messages
      : messages.filter((m) => m.type === typeFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream font-light">Contact Messages Inbox</h1>
          <p className="text-xs text-latte/80 font-sans tracking-widest uppercase mt-1">
            Guest Inquiries & Private Event Requests
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-sans">
          {["all", "general", "reservation", "private-event"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 uppercase tracking-wider border transition-all ${
                typeFilter === t
                  ? "bg-latte text-dark border-latte font-medium"
                  : "border-latte/20 text-cream/70 hover:text-cream"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-espresso p-12 text-center border border-latte/20 text-cream/60">
          <p className="font-serif text-2xl">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-4 font-sans text-xs">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-espresso border shadow-lg p-6 space-y-3 transition-colors ${
                msg.isRead ? "border-latte/15 opacity-75" : "border-latte/40 bg-espresso"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-latte/10">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl text-cream font-normal">{msg.name}</h3>
                  <span className="text-latte font-mono text-[0.7rem]">&lt;{msg.email}&gt;</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-dark border border-latte/30 text-latte uppercase tracking-widest text-[0.6rem]">
                    {msg.type}
                  </span>

                  <button
                    onClick={() => handleToggleRead(msg.id, msg.isRead)}
                    className={`flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider px-2.5 py-1 border transition-colors ${
                      msg.isRead
                        ? "border-cream/20 text-cream/50 hover:text-cream"
                        : "border-latte text-latte hover:bg-latte hover:text-dark"
                    }`}
                  >
                    {msg.isRead ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Read</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 fill-latte" />
                        <span>Mark Read</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-dark/40 border border-latte/10 text-cream/90 leading-relaxed font-sans text-[0.8rem]">
                {msg.message}
              </div>

              <div className="text-[0.65rem] text-cream/40 text-right font-mono">
                Received: {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
