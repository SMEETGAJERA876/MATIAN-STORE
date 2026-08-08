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
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0645B5] via-[#0b53d4] to-[#102A5C] py-16 text-white my-10 rounded-2xl mx-auto max-w-7xl px-6 shadow-xl">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
          <Mail size={24} className="text-cyan-200" />
        </div>

        <h2 className="text-2xl font-black md:text-3xl tracking-tight">
          Join the Matrin Clean Family
        </h2>

        <p className="mt-3 text-blue-100 text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
          Subscribe to receive exclusive discounts, expert home cleaning tips, and first access to new eco-friendly product launches.
        </p>

        {subscribed ? (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3.5 text-emerald-300 text-xs font-bold">
            <CheckCircle2 size={18} /> You are subscribed! Check your inbox soon for your 10% coupon code.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-blue-200 backdrop-blur-md focus:border-white focus:outline-hidden text-xs"
              required
            />

            <button
              type="submit"
              className="group flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-extrabold text-[#0645B5] shadow-md transition hover:bg-blue-50 active:scale-95 text-xs shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}

        <p className="mt-4 text-[10px] text-blue-200">
          🔒 We respect your privacy. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
}