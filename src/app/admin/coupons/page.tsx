"use client";

import { useState } from "react";
import { useProductStore } from "@/context/ProductStoreContext";
import { Ticket, Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function AdminCouponsPage() {
  const { coupons, addCoupon, deleteCoupon, toggleCouponStatus } = useProductStore();
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("10");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [minSpend, setMinSpend] = useState("299");

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    addCoupon({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minSpend),
      couponLimit: 100,
      isActive: true,
      expiryDate: "2026-12-31",
    });

    setCode("");
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">Coupons & Promotions</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Create, issue, and manage discount promo codes for customer checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Create Coupon Form */}
        <div className="lg:col-span-5 bg-[#1E293B] rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Ticket size={18} className="text-blue-400" /> Create New Coupon
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. MATRIN20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white uppercase font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Discount Type *</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Discount Value *</label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Minimum Spend (₹)</label>
              <input
                type="number"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
            >
              <Plus size={16} />
              <span>Issue Coupon</span>
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-7 bg-[#1E293B] rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" /> Active Coupons
          </h3>

          <div className="divide-y divide-slate-800/80">
            {coupons.map((c) => (
              <div key={c.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-blue-400 font-mono text-sm block">{c.code}</span>
                  <span className="text-[11px] text-slate-400">
                    {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`} (Min spend ₹{c.minOrderAmount || 0})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleCouponStatus(c.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      c.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {c.isActive ? "Active" : "Disabled"}
                  </button>
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
