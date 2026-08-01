"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Leaf, FlaskConical, Users, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF3FB] via-[#F3F8FC] to-white pt-10 pb-16 lg:pt-14 lg:pb-24">
      {/* Floating Leaves Decorative Graphics */}
      <div className="absolute top-10 left-6 text-emerald-500/40 text-2xl animate-pulse pointer-events-none">
        🍃
      </div>
      <div className="absolute top-1/4 right-8 text-emerald-500/40 text-3xl animate-bounce pointer-events-none">
        🍃
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Pure Cleaning. Better Living. */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Main Headline (Exact Typography from Reference Image 4) */}
            <div className="space-y-1">
              <h1 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0B2545] leading-[1.08]">
                Pure Cleaning.
              </h1>
              <h1 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1E40AF] leading-[1.08] flex items-center gap-2">
                Better Living.<span className="text-emerald-500 text-4xl sm:text-5xl">🍃</span>
              </h1>
            </div>

            {/* Subtitle (Exact Match) */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-lg leading-relaxed">
              Powerful formulas. Safe for your home.
              <br />
              Trusted by thousands of happy families.
            </p>

            {/* CTA Buttons Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#1E40AF] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-[#1a3899] hover:shadow-blue-600/30 active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#1E40AF] px-7 py-3 text-sm font-bold text-[#1E40AF] transition-all hover:bg-[#1E40AF] hover:text-white active:scale-95"
              >
                <span>Explore Products</span>
              </Link>
            </div>

            {/* Inline Feature Icons (3 Columns matching reference Image 4) */}
            <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-3 text-xs sm:text-sm font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                  <Leaf size={18} />
                </div>
                <span>Plant Based Ingredients</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                  <ShieldCheck size={18} />
                </div>
                <span>Tough on Stains Gentle on Hands</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 shadow-2xs">
                  <FlaskConical size={18} />
                </div>
                <span>No Harmful Chemicals</span>
              </div>
            </div>

          </div>

          {/* Right Column: Matrin Product Lineup Showcase (Exact Image 4) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-xl">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                src="/images/matrin-hero-lineup.png"
                alt="Matrin Cleaning Products Lineup"
                className="h-auto w-full object-contain drop-shadow-2xl hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* Bottom Floating Stats Bar (Exact Match with Image 4) */}
        <div className="mt-12 rounded-3xl bg-white p-6 sm:p-7 shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          <div className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
              <Users size={22} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B2545]">50K+</div>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Happy Customers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
              <Shield size={22} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B2545]">100%</div>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Safe & Effective</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
            <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100 shadow-2xs">
              <Leaf size={22} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B2545]">Eco Friendly</div>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Better for Nature</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 shadow-2xs">
              <Award size={22} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B2545]">Premium Quality</div>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Trusted Products</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}