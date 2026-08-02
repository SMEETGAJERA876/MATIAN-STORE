"use client";

import { ShieldCheck, Truck, Award } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: <Truck className="text-[#1E40AF]" size={22} />,
      title: "Free Express Delivery",
      subtitle: "On all orders above ₹499",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      icon: <ShieldCheck className="text-emerald-600" size={22} />,
      title: "99.9% Germ Shield",
      subtitle: "Lab-certified antibacterial formula",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      icon: <Award className="text-[#1E40AF]" size={22} />,
      title: "100% Quality Assured",
      subtitle: "Non-toxic & pet-safe chemistry",
      bg: "bg-[#EBF3FB] border-blue-100",
    },
  ];

  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 border border-slate-100 shadow-2xs transition-shadow hover:shadow-md"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${badge.bg} border shadow-2xs`}>
                {badge.icon}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0B2545]">
                  {badge.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
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
