"use client";

import ProductGrid from "@/components/ProductGrid";
import PromotionalBanner from "@/components/PromotionalBanner";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#F5FAFF] pb-16">
      {/* Top Banner Header (Matching Reference Styling) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#EAF5FF] via-[#F5FAFF] to-[#EAF5FF] py-10 lg:py-14 border-b border-[#DCE8F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#102A5C] tracking-tight">
              Our Products
            </h1>
            <nav className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#5F6B7A]">
              <Link href="/" className="hover:text-[#0645B5]">Home</Link>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-[#0645B5]">Products Catalog</span>
            </nav>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-sm border border-[#DCE8F5] backdrop-blur-md max-w-md">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0645B5] flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs font-semibold text-[#12213F] leading-snug">
              Explore Matrin&apos;s full range of eco-friendly detergents, floor cleaners, dish wash gel, and toilet care products.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8">
        <ProductGrid title="Explore Our Complete Range" badge="FULL CATALOG" />
        <PromotionalBanner />
      </div>
    </main>
  );
}
