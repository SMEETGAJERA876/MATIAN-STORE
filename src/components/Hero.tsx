"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Leaf, Sparkles, Users, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF5FF] via-[#F5FAFF] to-white pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-[#DCE8F5]">
      
      {/* Background Water Splash FX Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Text Content & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Eyebrow Tag matching reference image */}
            <div className="inline-block">
              <span className="inline-block bg-[#EAF5FF] text-[#0645B5] px-3.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border border-[#DCE8F5] shadow-2xs">
                NEW & IMPROVED
              </span>
            </div>

            {/* Main Headline matching reference image */}
            <div className="space-y-1">
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-[#102A5C] leading-[1.1]">
                POWERFUL CLEANING
              </h1>
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-[#0645B5] leading-[1.1]">
                YOU CAN TRUST
              </h1>
            </div>

            {/* Subtitle matching reference image */}
            <p className="text-sm sm:text-base text-[#5F6B7A] font-medium max-w-md leading-relaxed">
              Matrin brings you superior cleaning with advanced formula for a healthier home.
            </p>

            {/* CTA Buttons matching reference image */}
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-lg bg-[#0645B5] px-7 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-blue-900/20 transition-all hover:bg-[#043694] active:scale-95"
              >
                <span>SHOP NOW</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#102A5C] border border-[#DCE8F5] transition-all hover:bg-[#EAF5FF] active:scale-95"
              >
                <span>EXPLORE PRODUCTS</span>
              </Link>
            </div>

            {/* 3 Key Feature Icons Row */}
            <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 text-xs font-bold text-[#12213F] border-t border-[#DCE8F5]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Leaf size={16} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#12213F]">Plant Based</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-50 text-[#0645B5] flex items-center justify-center shrink-0 border border-blue-100">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#12213F]">Safe for Families</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <Sparkles size={16} />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#12213F]">Powerful Cleaning</span>
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

      </div>
    </section>
  );
}