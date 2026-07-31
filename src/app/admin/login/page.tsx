"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Key, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@brewhaven.co");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("Invalid credentials. Please verify your admin email and password.");
        setIsSubmitting(false);
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred during authentication.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-cream flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-[#2A1F14] border border-latte/20 shadow-2xl p-8 md:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-latte/10 rounded-full border border-latte/30 flex items-center justify-center text-latte mx-auto mb-4">
            <Lock className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-3xl font-light text-cream">Brew Haven Admin</h1>
          <p className="text-xs text-latte/80 font-sans tracking-widest uppercase">
            Management Portal
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-sans">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          <div>
            <label className="block text-[0.65rem] uppercase tracking-widest text-latte mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cream/40 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark border border-latte/30 pl-10 pr-4 py-3 text-xs text-cream focus:outline-none focus:border-latte"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.65rem] uppercase tracking-widest text-latte mb-2">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-cream/40 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-latte/30 pl-10 pr-4 py-3 text-xs text-cream focus:outline-none focus:border-latte"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-sans text-[0.72rem] tracking-[0.2em] uppercase bg-latte text-dark font-medium py-3.5 hover:bg-[#e6c88b] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : "Sign In to Portal"}
          </button>
        </form>

        <p className="text-[0.65rem] text-center text-cream/40 pt-4 border-t border-latte/10">
          Protected area. Unauthorized access attempts are monitored and logged.
        </p>
      </div>
    </div>
  );
}
