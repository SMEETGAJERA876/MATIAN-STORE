"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromotionalBanner() {
  return (
    <section className="relative overflow-hidden bg-white text-[#102A5C] py-10 lg:py-14 my-10 rounded-3xl mx-auto max-w-7xl px-6 lg:px-12 border border-[#EAF0F8] shadow-md">
      
      {/* Soft background glow FX */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#EAF5FF]/60 via-white to-[#EAF5FF]/30 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        
        {/* Left Typography */}
        <div className="space-y-3 text-center md:text-left max-w-lg">
          <div className="space-y-0.5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102A5C] tracking-tight leading-none">
              CLEAN HOME.
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0645B5] tracking-tight leading-none">
              HAPPY HOME.
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#5F6B7A] font-medium">
            Get up to 20% off on your first order with code <strong className="text-[#0645B5]">MATRIN20</strong>
          </p>

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#0645B5] hover:bg-[#043694] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md active:scale-95"
            >
              <span>SHOP NOW</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Circular Offer Badge */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center">
            {/* Ice Blue Circular Badge */}
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-[#EAF5FF] text-[#0645B5] flex flex-col items-center justify-center p-2 shadow-lg border-4 border-[#0645B5]/20 text-center transform rotate-6">
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
