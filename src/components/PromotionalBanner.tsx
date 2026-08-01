"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Tag } from "lucide-react";

export default function PromotionalBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#1E40AF] via-[#1d3b9e] to-[#0B2545] text-white py-10 my-12 rounded-3xl mx-auto max-w-7xl px-8 shadow-xl">
      <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row md:px-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md md:flex">
            <Tag size={24} className="text-cyan-300" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-cyan-300 border border-white/10 backdrop-blur-md">
              <Sparkles size={12} /> SPECIAL OFFER
            </span>

            <h3 className="mt-2 text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Get 10% OFF + Free Express Shipping
            </h3>
            <p className="mt-1 text-xs text-blue-100 font-medium">
              Use promo code <span className="font-bold underline underline-offset-2 text-cyan-300">MATRIN10</span> on orders over ₹499!
            </p>
          </div>
        </div>

        <div>
          <Link
            href="/products"
            className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#1E40AF] transition hover:bg-cyan-50 active:scale-95 shadow-md"
          >
            <span>Claim Offer</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
