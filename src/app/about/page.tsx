"use client";

import WhyChooseUs from "@/components/WhyChooseUs";
import Newsletter from "@/components/Newsletter";
import { Target, Compass, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "HAPPY HOUSEHOLDS", value: "50,000+" },
    { label: "GERM DEFENSE", value: "99.9%" },
    { label: "CITIES DELIVERED", value: "50+" },
    { label: "CUSTOMER RATING", value: "4.9 ★" },
  ];

  const milestones = [
    {
      year: "2021",
      title: "Founded in Ahmedabad",
      description: "Started with a vision to create non-toxic, skin-friendly home cleaning formulations.",
    },
    {
      year: "2023",
      title: "Nationwide Expansion",
      description: "Expanded shipping to over 50 major cities across India with 99.9% lab certification.",
    },
    {
      year: "2024",
      title: "Eco-Concentrated Launch",
      description: "Introduced 3x ultra-concentrated liquid detergents reducing plastic waste by 40%.",
    },
    {
      year: "2026",
      title: "Leading Home Care Brand",
      description: "Serving over 50,000 families with premium liquid cleaning products daily.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Hero Section */}
        <div className="rounded-3xl bg-[#0A2E4E] p-10 md:p-16 text-[#FAF7F2] shadow-md mb-16 text-center max-w-5xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E5D3C4]">
            OUR STORY & VALUES
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
            Redefining Home Hygiene with Safe & Effective Chemistry
          </h1>
          <p className="mt-4 text-slate-300 text-xs sm:text-sm font-light max-w-2xl mx-auto leading-relaxed">
            At Matrin, we believe that a clean home should never come at the cost of your family&apos;s health or the environment.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-[#F5F1EB] p-8 text-center border border-[#EFEAE4]"
            >
              <div className="font-serif text-4xl sm:text-5xl font-normal text-[#0A2E4E]">
                {stat.value}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid gap-12 lg:grid-cols-2 items-center mb-20 rounded-3xl bg-[#FAF7F2] p-8 md:p-12 border border-[#EFEAE4]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              THE JOURNEY
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#0A2E4E]">
              Built on Science, Driven by Pure Care
            </h2>
            <p className="mt-4 text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
              Matrin was created to address a major gap in the market: traditional cleaning products relied heavily on harsh industrial bleach and corrosive acids that damaged surfaces and irritated skin.
            </p>
            <p className="mt-3 text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
              Our team of chemical engineers spent 2 years formulating non-toxic, bio-degradable active ingredients that match or exceed commercial cleaning strength while remaining completely safe for daily home use.
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0A2E4E]">
                <CheckCircle2 size={15} className="text-emerald-700" /> 100% Dermatologically Tested Formulations
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0A2E4E]">
                <CheckCircle2 size={15} className="text-emerald-700" /> Bio-degradable Surfactants & Recyclable Bottles
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0A2E4E]">
                <CheckCircle2 size={15} className="text-emerald-700" /> Certified 99.9% Antibacterial Efficacy
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-[#0A2E4E] p-8 text-[#FAF7F2] shadow-md border border-[#13426B]">
            <div className="font-serif text-2xl font-normal text-[#E5D3C4] mb-4">Matrin Quality Guarantee</div>
            <p className="text-xs text-slate-300 font-light leading-relaxed italic font-serif">
              &ldquo;Every bottle of Matrin that leaves our facility represents our unyielding commitment to your family&apos;s health and home hygiene.&rdquo;
            </p>
            <div className="mt-6 pt-4 border-t border-[#13426B] flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#FAF7F2] text-[#0A2E4E] flex items-center justify-center font-bold text-sm font-serif">
                M
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">The Matrin Founding Team</div>
                <div className="text-[10px] text-slate-400 font-light">Ahmedabad, Gujarat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-8 md:grid-cols-2 mb-20">
          <div className="rounded-3xl bg-[#F5F1EB] p-8 border border-[#EFEAE4]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#0A2E4E] mb-6">
              <Target size={24} />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0A2E4E]">Our Mission</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              To empower every household with accessible, high-performance, non-toxic cleaning solutions that elevate daily hygiene without compromising personal health or environmental sustainability.
            </p>
          </div>

          <div className="rounded-3xl bg-[#F5F1EB] p-8 border border-[#EFEAE4]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#0A2E4E] mb-6">
              <Compass size={24} />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0A2E4E]">Our Vision</h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              To become India&apos;s most trusted eco-conscious home care brand, setting new standards for zero-waste packaging, sustainable manufacturing, and lab-certified antibacterial efficacy.
            </p>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              GROWTH JOURNEY
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#0A2E4E]">
              Company Milestones
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl bg-[#FAF7F2] p-6 border border-[#EFEAE4]"
              >
                <span className="inline-block rounded-full bg-[#E5D3C4] px-3 py-1 text-[10px] font-bold text-[#0A2E4E]">
                  {m.year}
                </span>
                <h4 className="mt-3 font-serif text-xl font-normal text-[#0A2E4E]">
                  {m.title}
                </h4>
                <p className="mt-2 text-xs text-slate-500 font-light leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Newsletter */}
        <Newsletter />

      </div>
    </main>
  );
}