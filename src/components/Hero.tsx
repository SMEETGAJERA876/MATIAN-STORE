"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Headline & Editorial Copy */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#0A2E4E]">
              CLEAN HOME.
              <br />
              BETTER LIVING.
            </h1>

            <p className="mt-6 text-base md:text-lg text-slate-700 leading-relaxed max-w-lg font-light">
              Powerful cleaning. Gentle on hands.
              <br />
              Safe for your home and the planet.
            </p>

            {/* Primary CTA */}
            <div className="mt-8">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 rounded-full bg-[#0A2E4E] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] shadow-md transition-all hover:bg-[#13426B] hover:shadow-lg active:scale-95"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Inline Minimal Trust Badges */}
            <div className="mt-12 pt-8 border-t border-[#EFEAE4] flex flex-wrap items-center gap-8 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <Leaf size={18} className="text-[#0A2E4E] stroke-1" />
                <span>Plant Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#0A2E4E] stroke-1" />
                <span>Safe for Families</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#0A2E4E] stroke-1" />
                <span>Powerful Cleaning</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Product Range Showcase on Arch Pedestal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-xl">
              
              {/* Background Arch Overlay */}
              <div className="absolute inset-0 bg-[#F4EBE1] rounded-t-full rounded-b-3xl transform -rotate-1 opacity-70 -z-10 scale-95" />

              {/* High Resolution Product Display Card */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#F5F1EB] to-[#FAF7F2] p-8 shadow-xs border border-[#EFEAE4]">
                <img
                  src="/images/hero.png"
                  alt="Matrin Luxury Cleaning Products Range"
                  className="h-auto w-full object-contain mx-auto transition-transform duration-700 hover:scale-103"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/products/detergent.png";
                  }}
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}