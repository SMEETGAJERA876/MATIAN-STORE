"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Leaf,
  Sparkles,
  ArrowRight,
  Heart,
  Award,
  Users,
  CheckCircle2,
  Send,
  Droplet,
  FlaskConical,
  PackageCheck,
  Shield,
  Smile,
  Store,
  Compass,
  Check,
} from "lucide-react";
import Newsletter from "@/components/Newsletter";

export default function AboutPage() {
  // Option A Active Mission Statements (pre-launch value claims)
  const stats = [
    { title: "Every Indian Home", label: "Built for Local Needs", icon: Users, bg: "bg-blue-50 text-[#0645B5]" },
    { title: "Plant-Based", label: "Non-Toxic Formulas", icon: Droplet, bg: "bg-emerald-50 text-emerald-600" },
    { title: "Dermatologically", label: "Tested & Gentle", icon: Smile, bg: "bg-purple-50 text-purple-600" },
    { title: "Made in India", label: "Crafted with Care", icon: Store, bg: "bg-amber-50 text-amber-600" },
  ];

  /*
  ===================================================================
  Option B — Configurable Numeric Stats Array (Post-Launch Alternate)
  Import LAUNCH_NUMERIC_STATS from '@/data/stats' when real data is ready:
  ===================================================================
  const statsNumeric = [
    { value: LAUNCH_NUMERIC_STATS.happyCustomers, label: "Happy Customers", icon: Users, bg: "bg-blue-50 text-[#0645B5]" },
    { value: LAUNCH_NUMERIC_STATS.bottlesSold, label: "Bottles Sold", icon: Droplet, bg: "bg-emerald-50 text-emerald-600" },
    { value: LAUNCH_NUMERIC_STATS.customerSatisfaction, label: "Customer Satisfaction", icon: Smile, bg: "bg-purple-50 text-purple-600" },
    { value: LAUNCH_NUMERIC_STATS.retailPartners, label: "Retail Partners", icon: Store, bg: "bg-amber-50 text-amber-600" },
  ];
  */

  const teamMembers = [
    {
      name: "Rohit Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "Ananya Verma",
      role: "Head of Research",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "Vikram Patel",
      role: "Operations Head",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "Priya Nair",
      role: "Quality Head",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
      
      {/* Hero Section (Exact Match with Reference Image 2) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF3FB] via-[#F2F7FD] to-white py-12 lg:py-16 border-b border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#0645B5] bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                ABOUT MATRIN
              </span>

              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#102A5C] tracking-tight leading-tight">
                  Pure Cleaning.
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0645B5] tracking-tight leading-tight">
                  Better Living.
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                At Matrin, we believe a clean home leads to a healthier and happier life. Our eco-friendly cleaning solutions are safe for your family and tough on stains.
              </p>

              {/* Inline Feature Tags (Exact Image 2) */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <Leaf size={14} />
                  </div>
                  <span>Plant Based Ingredients</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-50 text-[#0645B5] flex items-center justify-center border border-blue-100">
                    <ShieldCheck size={14} />
                  </div>
                  <span>Safe for Your Family</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <Sparkles size={14} />
                  </div>
                  <span>Powerful Cleaning</span>
                </div>
              </div>
            </div>

            {/* Right Product Bottles Graphic */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                <img
                  src="/images/matrin-hero-lineup.png"
                  alt="Matrin Product Lineup"
                  className="h-auto w-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating 4 Metrics Stats Bar (Exact Match with Image 2) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-8 relative z-20">
        <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {stats.map((st, idx) => {
            const IconC = st.icon;
            return (
              <div key={idx} className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
                <div className={`h-12 w-12 rounded-2xl ${st.bg} flex items-center justify-center shrink-0 border border-slate-100`}>
                  <IconC size={22} />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#102A5C] leading-tight">{st.title}</div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">{st.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OUR STORY Section (Exact Match with Image 2) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0645B5]">OUR STORY</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A5C] tracking-tight">
              Built on Care. Driven by Quality.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Matrin was born from a simple idea - cleaning products should be effective, safe and environmentally responsible. We started our journey to create high-performance cleaning solutions using plant-based ingredients that care for your home and the planet.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#0645B5] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#1a3899] transition"
              >
                <span>Read Our Full Story</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* 3 Story Cards Grid (Exact Image 2) */}
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                {/* TODO: Replace with real MATRIN product/lifestyle photography before launch. */}
                <img
                  src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400"
                  alt="Safe & Tested"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#0645B5] flex items-center justify-center shrink-0 border border-blue-100">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102A5C]">Safe & Tested</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Dermatologically tested and family safe.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                {/* TODO: Replace with real MATRIN product/lifestyle photography before launch. */}
                <img
                  src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400"
                  alt="Eco-Friendly"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Leaf size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102A5C]">Eco-Friendly</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Biodegradable formulas that protect nature.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                {/* TODO: Replace with real MATRIN product/lifestyle photography before launch. */}
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400"
                  alt="Better Living"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102A5C]">Better Living</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Clean homes for a healthier tomorrow.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VALUES Section (Exact Match with Image 2) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="rounded-3xl bg-blue-50/50 p-8 sm:p-10 border border-blue-100/80 space-y-8">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0645B5]">OUR VALUES</span>
            <h2 className="text-3xl font-extrabold text-[#102A5C]">The Matrin Promise</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0645B5] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#102A5C]">Integrity</h4>
                <p className="text-[11px] text-slate-500 mt-1">Honest practices and transparent products.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#102A5C]">Quality</h4>
                <p className="text-[11px] text-slate-500 mt-1">Premium ingredients for powerful results.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Leaf size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#102A5C]">Sustainability</h4>
                <p className="text-[11px] text-slate-500 mt-1">Eco-conscious choices for a better planet.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#102A5C]">Customer First</h4>
                <p className="text-[11px] text-slate-500 mt-1">Your satisfaction is our top priority.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PROCESS Section (4 Steps - Exact Match with Image 2) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="space-y-8">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0645B5]">OUR PROCESS</span>
            <h2 className="text-3xl font-extrabold text-[#102A5C]">From Nature to Your Home</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              We carefully select the best natural ingredients, blend them with advanced science and deliver powerful cleaning solutions you can trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white p-6 border border-slate-100 text-center space-y-3 shadow-2xs">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Leaf size={22} />
              </div>
              <h4 className="text-xs font-extrabold text-[#102A5C]">1. Natural Ingredients</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Carefully sourced plant based ingredients.</p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-100 text-center space-y-3 shadow-2xs">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 text-[#0645B5] flex items-center justify-center border border-blue-100">
                <FlaskConical size={22} />
              </div>
              <h4 className="text-xs font-extrabold text-[#102A5C]">2. Advanced Research</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Scientifically formulated for maximum performance.</p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-100 text-center space-y-3 shadow-2xs">
              <div className="mx-auto h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <ShieldCheck size={22} />
              </div>
              <h4 className="text-xs font-extrabold text-[#102A5C]">3. Strict Quality Checks</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Tested for safety, purity and effectiveness.</p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-100 text-center space-y-3 shadow-2xs">
              <div className="mx-auto h-12 w-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                <PackageCheck size={22} />
              </div>
              <h4 className="text-xs font-extrabold text-[#102A5C]">4. Delivered to You</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Bringing safe, powerful cleaning to your home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MEET OUR TEAM Section (Exact Match with Image 2) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Left Text Card */}
          <div className="lg:col-span-4 rounded-3xl bg-[#EBF3FB] p-8 border border-blue-100 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0645B5]">MEET OUR TEAM</span>
            <h3 className="text-2xl font-extrabold text-[#102A5C]">The People Behind Matrin</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A passionate team of experts working every day to make your home cleaner, safer and better.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#0645B5] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#1a3899] transition"
              >
                <span>Join Our Journey</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right 4 Team Cards Grid (Exact Image 2) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-3 border border-slate-100 text-center space-y-2 shadow-2xs">
                <div className="h-40 w-full rounded-xl overflow-hidden bg-slate-100">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#102A5C]">{member.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFIED & TRUSTED Badges Bar (Exact Match with Image 2) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="rounded-3xl bg-white p-8 border border-slate-100 shadow-2xs space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0645B5]">CERTIFIED & TRUSTED</span>
            <p className="text-xs text-slate-500 font-medium">Our products are certified, tested and trusted by thousands of families.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs font-bold text-slate-700">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-blue-50 text-[#0645B5] flex items-center justify-center border border-blue-100 font-extrabold">
                ISO
              </div>
              <div>ISO Certified</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 font-extrabold">
                GMP
              </div>
              <div>Quality Certified</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Heart size={20} />
              </div>
              <div>Cruelty Free</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                <Leaf size={20} />
              </div>
              <div>Biodegradable Formula</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Banner */}
      <div className="mt-16">
        <Newsletter />
      </div>

    </main>
  );
}