"use client";

import { useState, FormEvent } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Thank you for subscribing!", { icon: "🎉" });
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 py-20 text-white my-12 rounded-3xl mx-auto max-w-7xl px-6 shadow-2xl">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
          <Mail size={28} className="text-cyan-300" />
        </div>

        <h2 className="text-3xl font-black md:text-4xl tracking-tight">
          Join the Matrin Clean Club
        </h2>

        <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
          Subscribe to receive exclusive discounts, expert home cleaning tips, and first access to new eco-friendly product launches.
        </p>

        {subscribed ? (
          <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-4 text-emerald-300 font-bold">
            <CheckCircle2 size={20} /> You are subscribed! Check your inbox soon for your 10% coupon code.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white placeholder-slate-400 backdrop-blur-md focus:border-cyan-400 focus:outline-hidden text-sm"
              required
            />

            <button
              type="submit"
              className="group flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-blue-700 shadow-lg transition hover:bg-cyan-50 active:scale-95 text-sm shrink-0"
            >
              Subscribe
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}

        <p className="mt-4 text-[11px] text-slate-400">
          🔒 We respect your privacy. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
}