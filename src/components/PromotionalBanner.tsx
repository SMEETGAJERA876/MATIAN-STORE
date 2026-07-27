"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Tag } from "lucide-react";

export default function PromotionalBanner() {
  return (
    <section className="relative overflow-hidden bg-[#0A2E4E] text-[#FAF7F2] py-10 my-12 rounded-3xl mx-auto max-w-7xl px-8 shadow-md">
      <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row md:px-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#FAF7F2] backdrop-blur-md md:flex">
            <Tag size={24} />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5D3C4] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0A2E4E]">
              <Sparkles size={12} /> SPECIAL OFFER
            </span>

            <h3 className="mt-2 font-serif text-2xl md:text-3xl font-normal text-[#FAF7F2]">
              Get 10% OFF + Free Express Shipping
            </h3>
            <p className="mt-1 text-xs text-slate-300 font-light">
              Use promo code <span className="font-bold underline underline-offset-2 text-[#E5D3C4]">MATRIN10</span> on orders over ₹499!
            </p>
          </div>
        </div>

        <div>
          <Link
            href="/products"
            className="group flex items-center gap-2 rounded-full bg-[#FAF7F2] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0A2E4E] transition hover:bg-[#E5D3C4] active:scale-95 shadow-xs"
          >
            <span>Claim Offer</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
