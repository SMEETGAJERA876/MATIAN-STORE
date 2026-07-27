"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Leaf, HandHeart, Sparkles } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Sparkles size={22} className="text-[#0A2E4E] stroke-1.5" />,
      title: "Powerful Cleaning",
      description: "Tough on stains and germs",
    },
    {
      icon: <ShieldCheck size={22} className="text-[#0A2E4E] stroke-1.5" />,
      title: "Safe Ingredients",
      description: "Non-toxic and eco-friendly",
    },
    {
      icon: <HandHeart size={22} className="text-[#0A2E4E] stroke-1.5" />,
      title: "Gentle on Hands",
      description: "Dermatologically tested",
    },
    {
      icon: <Leaf size={22} className="text-[#0A2E4E] stroke-1.5" />,
      title: "Plant Based",
      description: "Made with natural ingredients",
    },
  ];

  return (
    <section className="bg-[#F5F1EB] py-20 border-y border-[#EFEAE4]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column: Headline & Description */}
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              WHY CHOOSE MATRIN?
            </span>

            <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-normal text-[#0A2E4E] leading-tight">
              Cleans Better.
              <br />
              Cares More.
            </h2>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed font-light">
              We create products that deliver exceptional cleaning while being safe for your family and the environment.
            </p>

            <div className="mt-8">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full border border-[#0A2E4E] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#0A2E4E] hover:bg-[#0A2E4E] hover:text-[#FAF7F2] transition-all"
              >
                <span>LEARN MORE</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Middle Column: 4 Feature Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl bg-[#FAF7F2] p-5 border border-[#EFEAE4]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F1EB]">
                  {feature.icon}
                </div>
                <h3 className="text-xs font-bold text-[#0A2E4E]">
                  {feature.title}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 leading-normal">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Lifestyle Product Image */}
          <div className="lg:col-span-4">
            <div className="relative overflow-hidden rounded-3xl bg-slate-200 aspect-4/3 lg:aspect-square border border-[#EFEAE4]">
              <img
                src="/images/products/dishwash-cleaning.png"
                alt="Matrin Product Lifestyle"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/products/dishwash.png";
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}