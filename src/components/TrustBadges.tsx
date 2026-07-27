"use client";

import { ShieldCheck, Truck, RefreshCw, Award } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: <Truck className="text-[#0A2E4E]" size={22} />,
      title: "Free Express Delivery",
      subtitle: "On all orders above ₹499",
    },
    {
      icon: <ShieldCheck className="text-[#0A2E4E]" size={22} />,
      title: "99.9% Germ Shield",
      subtitle: "Lab-certified antibacterial formula",
    },
    {
      icon: <RefreshCw className="text-[#0A2E4E]" size={22} />,
      title: "7-Day Easy Returns",
      subtitle: "Hassle-free replacement policy",
    },
    {
      icon: <Award className="text-[#0A2E4E]" size={22} />,
      title: "100% Quality Assured",
      subtitle: "Non-toxic & pet-safe chemistry",
    },
  ];

  return (
    <section className="border-y border-[#EFEAE4] bg-[#F5F1EB] py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-2xl bg-[#FAF7F2] p-4 border border-[#EFEAE4]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F1EB]">
                {badge.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0A2E4E]">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-light mt-0.5">
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
