"use client";

import ProductGrid from "@/components/ProductGrid";
import PromotionalBanner from "@/components/PromotionalBanner";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-[#0A2E4E] p-8 md:p-12 text-[#FAF7F2] shadow-sm mb-10 text-center max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E5D3C4]">
            OUR COLLECTION
          </span>
          <h1 className="mt-2 font-serif text-3xl md:text-5xl font-normal tracking-tight text-white">
            Premium Home Cleaning Products
          </h1>
          <p className="mt-3 text-slate-300 text-xs md:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Explore Matrin&apos;s full range of eco-friendly detergent, floor cleaners, dish wash gel, and toilet care products.
          </p>
        </div>

        <ProductGrid />
        <PromotionalBanner />
      </div>
    </main>
  );
}
