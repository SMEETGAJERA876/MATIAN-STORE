"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromotionalBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0645B5] via-[#0b53d4] to-[#1769E0] text-white py-10 lg:py-14 my-10 rounded-2xl mx-auto max-w-7xl px-6 lg:px-12 shadow-xl">
      
      {/* Water splash background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        
        {/* Left Typography */}
        <div className="space-y-3 text-center md:text-left max-w-lg">
          <div className="space-y-0.5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              CLEAN HOME.
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              HAPPY HOME.
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            Get up to 20% off on your first order.
          </p>

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0645B5] hover:bg-[#043694] px-7 py-3 text-xs font-black uppercase tracking-wider text-white border border-white/20 transition-all shadow-md active:scale-95"
            >
              <span>SHOP NOW</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Product Showcase & Circular Badge matching reference image */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center">
            {/* White Circular Badge */}
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-white text-[#0645B5] flex flex-col items-center justify-center p-2 shadow-2xl border-4 border-blue-200/50 text-center transform rotate-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5F6B7A]">UP TO</span>
              <span className="text-2xl sm:text-3xl font-black leading-none text-[#0645B5]">20%</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5F6B7A]">OFF</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
