"use client";

import { useProductStore } from "@/context/ProductStoreContext";

export default function AdminCouponsPage() {
  const { coupons } = useProductStore();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">Coupons & Promo Codes</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Discount codes for customer checkout</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((c) => (
          <div key={c.id} className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-blue-400 tracking-wider px-3 py-1 bg-blue-500/10 rounded-xl border border-blue-500/20">
                {c.code}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                Active
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white">
                {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Min Order: ₹{(c as { minSubtotal?: number; minOrderAmount?: number }).minSubtotal || (c as { minOrderAmount?: number }).minOrderAmount || 499}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
