"use client";

import { Sparkles, Users, Leaf, Truck, ShieldCheck } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: <Sparkles className="text-[#0645B5]" size={20} />,
      title: "Powerful Cleaning",
      subtitle: "Tough on stains",
    },
    {
      icon: <Users className="text-[#0645B5]" size={20} />,
      title: "Safe for Families",
      subtitle: "Gentle on hands",
    },
    {
      icon: <Leaf className="text-[#0645B5]" size={20} />,
      title: "Eco Friendly",
      subtitle: "Better for environment",
    },
    {
      icon: <Truck className="text-[#0645B5]" size={20} />,
      title: "Fast Delivery",
      subtitle: "Across India",
    },
    {
      icon: <ShieldCheck className="text-[#0645B5]" size={20} />,
      title: "Trusted Brand",
      subtitle: "Quality you can trust",
    },
  ];

  return (
    <section className="border-y border-[#DCE8F5] bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5FAFF] transition"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF5FF] border border-[#DCE8F5] shadow-2xs">
                {badge.icon}
              </div>
              <div>
                <h4 className="text-xs font-black text-[#102A5C] leading-snug">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-[#5F6B7A] font-medium leading-tight">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
