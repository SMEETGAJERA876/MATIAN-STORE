"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PromotionalBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0645B5] via-[#043694] to-[#102A5C] text-white py-10 lg:py-14 my-10 mx-auto max-w-7xl px-6 lg:px-12 shadow-xl shadow-blue-950/20 border border-blue-600/30">
      
      {/* Background Decorative Lighting Circles */}
      <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        
        {/* Left Typography */}
        <div className="space-y-4 text-center md:text-left max-w-lg">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-cyan-300 border border-white/20 backdrop-blur-xs">
            <Sparkles size={13} /> Special Offer
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              CLEAN HOME.
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cyan-300 tracking-tight leading-none drop-shadow-sm">
              HAPPY HOME.
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            Get up to <strong className="text-white font-black">20% OFF</strong> on your first order with code{" "}
            <span className="inline-block rounded-md bg-white/20 px-2.5 py-0.5 font-mono font-bold text-cyan-200 border border-white/30 backdrop-blur-xs">
              MATRIN20
            </span>
          </p>

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0645B5] hover:bg-cyan-50 px-8 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <span>SHOP NOW</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right Circular Offer Badge */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center">
            {/* Ice Blue Circular Badge */}
            <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-full bg-gradient-to-br from-white via-[#EAF5FF] to-cyan-50 text-[#0645B5] flex flex-col items-center justify-center p-3 shadow-2xl border-4 border-white/60 text-center transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5F6B7A]">UP TO</span>
              <span className="text-3xl sm:text-4xl font-black leading-none text-[#0645B5]">20%</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0645B5]">OFF</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
