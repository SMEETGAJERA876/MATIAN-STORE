"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Leaf, Users, Award, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

/* ==========================================================================
   FESTIVAL & BANNER SETTINGS:
   Whenever you want to change your poster (e.g. for Diwali, New Year, or Sale):
   1. Place your new image in: public/images/
   2. Change 'posterImage' below to your new file name (e.g. "/images/diwali-poster.jpg")
   3. You can edit the title, subtitle, or toggle showTextOverlay below anytime!
   ========================================================================== */
export const HERO_BANNER_CONFIG = {
  // Your poster / background image:
  posterImage: "/images/matrin-hero-banner.png",

  // Set to false if your festival poster ALREADY has text designed on it:
  showTextOverlay: true,

  // Headline lines:
  headlineLine1: "Pure Cleaning.",
  headlineLine2: "Better Living.",

  // Subtitle:
  subtitleLine1: "Powerful formulas. Safe for your home.",
  subtitleLine2: "Trusted by thousands of happy families.",

  // Buttons:
  primaryBtnText: "Shop Now",
  primaryBtnLink: "/products",
  secondaryBtnText: "Explore Products",
  secondaryBtnLink: "/products",
};

export default function Hero() {
  const stats = [
    {
      icon: <Users size={22} className="text-[#0645B5]" />,
      value: "50K+",
      label: "Happy Customers",
    },
    {
      icon: <ShieldCheck size={22} className="text-[#0645B5]" />,
      value: "100%",
      label: "Safe & Effective",
    },
    {
      icon: <Leaf size={22} className="text-[#0645B5]" />,
      value: "Eco Friendly",
      label: "Better for Nature",
    },
    {
      icon: <Award size={22} className="text-[#0645B5]" />,
      value: "Premium Quality",
      label: "Trusted Products",
    },
  ];

  return (
    <div className="relative bg-gradient-to-b from-[#F2F8FD] via-[#F8FBFE] to-white pb-12 lg:pb-16 overflow-hidden">
      {/* ========================================================
          HERO POSTER & TEXT SECTION
          ======================================================== */}
      <section className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Background Poster Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={HERO_BANNER_CONFIG.posterImage}
            alt="Matrin Clean Home Poster"
            className="w-full h-full object-cover object-center lg:object-right select-none"
          />

          {/* Smart Gradient Overlay: Ensures text on the left is 100% crisp and readable on ANY poster */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent sm:w-4/5 lg:w-[58%] pointer-events-none" />

          {/* Subtle Mobile Overlay */}
          <div className="absolute inset-0 bg-white/60 sm:hidden pointer-events-none" />
        </div>

        {/* Content Layer (Upper Side of the Picture) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 sm:py-16">
          {HERER_TEXT_OVERLAY(HERO_BANNER_CONFIG)}
        </div>
      </section>

      {/* ========================================================
          FLOATING 4-METRIC TRUST BAR (Matching Reference Mockup)
          ======================================================== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-[#DCE8F5] shadow-xl shadow-blue-900/10 p-4 sm:p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${
                  idx > 0 ? "pt-3 md:pt-0 md:pl-6" : ""
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF5FF] border border-[#DCE8F5] text-[#0645B5] shadow-2xs">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-[#102A5C] leading-tight tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#5F6B7A] font-semibold leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function HERER_TEXT_OVERLAY(config: typeof HERO_BANNER_CONFIG) {
  if (!config.showTextOverlay) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="max-w-xl space-y-6"
    >
      {/* Main Headline */}
      <div className="space-y-1">
        <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#102A5C] leading-[1.1]">
          {config.headlineLine1}
        </h1>
        <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#0645B5] leading-[1.1] inline-flex items-center gap-2">
          <span>{config.headlineLine2}</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mb-2" />
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-[#475569] font-medium leading-relaxed max-w-md">
        {config.subtitleLine1}
        <br className="hidden sm:inline" />
        {" "}{config.subtitleLine2}
      </p>

      {/* CTA Buttons */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <Link
          href={config.primaryBtnLink}
          className="group inline-flex items-center gap-2 rounded-full bg-[#0645B5] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-blue-900/25 transition-all hover:bg-[#043694] active:scale-95"
        >
          <span>{config.primaryBtnText}</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href={config.secondaryBtnLink}
          className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white px-7 py-3.5 text-xs font-black uppercase tracking-wider text-[#102A5C] border border-[#CBD5E1] transition-all shadow-2xs hover:shadow-sm active:scale-95"
        >
          <span>{config.secondaryBtnText}</span>
        </Link>
      </div>

      {/* 3 Key Badges Row */}
      <div className="pt-4 grid grid-cols-3 gap-3 sm:gap-4 text-xs font-bold text-[#102A5C] border-t border-slate-200/70 max-w-lg">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Leaf size={14} />
          </div>
          <span className="text-[11px] font-bold text-[#102A5C] leading-tight">
            Plant Based Ingredients
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-blue-50 text-[#0645B5] flex items-center justify-center shrink-0 border border-blue-100">
            <ShieldCheck size={14} />
          </div>
          <span className="text-[11px] font-bold text-[#102A5C] leading-tight">
            Tough on Stains, Gentle on Hands
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <FlaskConical size={14} />
          </div>
          <span className="text-[11px] font-bold text-[#102A5C] leading-tight">
            No Harmful Chemicals
          </span>
        </div>
      </div>
    </motion.div>
  );
}