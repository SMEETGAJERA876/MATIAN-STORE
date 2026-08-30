"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Leaf, HandHeart, Sparkles } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Sparkles size={22} className="text-[#0645B5]" />,
      title: "Powerful Cleaning",
      description: "Tough on stains and germs",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      icon: <ShieldCheck size={22} className="text-emerald-600" />,
      title: "Safe Ingredients",
      description: "Non-toxic and eco-friendly",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      icon: <HandHeart size={22} className="text-purple-600" />,
      title: "Gentle on Hands",
      description: "Dermatologically tested",
      bg: "bg-purple-50 border-purple-100",
    },
    {
      icon: <Leaf size={22} className="text-teal-600" />,
      title: "Plant Based",
      description: "Made with natural ingredients",
      bg: "bg-teal-50 border-teal-100",
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-20 border-y border-[#FFFFFF]" id="why-matrin">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 items-center">

          {/* Left Column: Headline & Description */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0645B5] bg-blue-50 px-3 py-1 rounded-md border border-blue-100 inline-block">
              WHY CHOOSE MATRIN?
            </span>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#102A5C] tracking-tight leading-tight">
              Cleans Better.
              <br />
              <span className="text-[#0645B5]">Cares More.</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#5F6B7A] leading-relaxed font-medium">
              We create products that deliver exceptional cleaning while being safe for your family and the environment.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-[#0645B5] px-6 py-3 text-xs font-bold text-[#0645B5] hover:bg-[#0645B5] hover:text-white transition-all active:scale-95 shadow-2xs"
              >
                <span>LEARN MORE</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Middle Column: 4 Feature Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-3xl bg-white p-5 border border-[#DCE8F5] shadow-2xs space-y-3"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${feature.bg} border`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#102A5C]">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-[#5F6B7A] font-medium leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Lifestyle Product Image */}
          <div className="lg:col-span-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#EAF5FF] to-white aspect-4/3 lg:aspect-square border border-[#DCE8F5] shadow-md p-2 flex items-center justify-center">
              <img
                src="/images/matrin-lifestyle-clean.png"
                alt="Matrin Product Lineup Lifestyle"
                className="h-full w-full object-cover rounded-2xl transition-transform duration-700 hover:scale-105 drop-shadow-md"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}