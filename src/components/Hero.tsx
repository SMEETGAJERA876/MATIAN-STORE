"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Leaf, Sparkles, Users, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#EAF3FA] via-[#F1F7FC] to-[#E3F0FA] pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-blue-100/60">
      
      {/* Background Water Splash FX Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Text Content & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Eyebrow Tag */}
            <div className="inline-block">
              <span className="text-xs sm:text-xs font-extrabold uppercase tracking-widest text-[#1E40AF]">
                PREMIUM CLEANING PRODUCTS
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B2545] leading-[1.1]">
                Clean Home.
              </h1>
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B2545] leading-[1.1]">
                Better Living.
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-md leading-relaxed">
              Powerful cleaning. Gentle on hands. Safe for your home and the planet.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 rounded-full bg-[#0B4B8A] px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#083A6D] hover:shadow-blue-900/30 active:scale-95"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* 3 Key Feature Icons Row */}
            <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 text-xs font-bold text-slate-800 border-t border-blue-200/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Leaf size={16} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700">Plant Based</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100/80 text-[#1E40AF] flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700">Safe for Families</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700">Powerful Cleaning</span>
              </div>
            </div>

          </div>

          {/* Right Column: Full Hero Product Showcase Photo */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-xl shadow-blue-900/10 border border-white/80 bg-white/40 backdrop-blur-xs group"
            >
              <img
                src="/images/matrin-full-hero-banner.png"
                alt="MATRIN Clean Home Better Living Product Lineup"
                className="w-full h-auto object-cover rounded-3xl transition-transform duration-700 group-hover:scale-102"
              />
            </motion.div>
          </div>

        </div>

        {/* Bottom Floating Brand Value Bar */}
        <div className="mt-10 rounded-3xl bg-white p-6 sm:p-7 shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          <div className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
              <Users size={22} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#0B2545] leading-tight">Every Indian Home</div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Built for Local Needs</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
              <Shield size={22} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#0B2545] leading-tight">Plant-Based</div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Non-Toxic Formulas</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
            <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100 shadow-2xs">
              <Leaf size={22} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#0B2545] leading-tight">Dermatologically</div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Tested & Gentle</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}