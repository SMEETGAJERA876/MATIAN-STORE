"use client";

import { useState } from "react";
import { useProductStore } from "@/context/ProductStoreContext";
import { DiscountType } from "@/types/coupon";
import { Tag, Plus, Trash2, CheckCircle2, XCircle, AlertCircle, Percent, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function CouponManager() {
  const { coupons, addCoupon, deleteCoupon, toggleCouponStatus } = useProductStore();

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [couponLimit, setCouponLimit] = useState("50");
  const [minOrderAmount, setMinOrderAmount] = useState("399");

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue || !couponLimit) {
      toast.error("Please fill all coupon fields!");
      return;
    }

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      couponLimit: Number(couponLimit),
      minOrderAmount: Number(minOrderAmount) || 0,
      isActive: true,
    });

    // Reset form
    setCode("");
    setDiscountValue("");
  };

  return (
    <div className="space-y-8">
      {/* Create New Coupon Code Form */}
      <div className="rounded-3xl bg-white p-6 md:p-8 border border-[#EFEAE4] shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Tag size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0A2E4E]">Create Discount Coupon Code</h3>
            <p className="text-xs text-slate-500">Set discount rate, minimum spend, and total redemption limits</p>
          </div>
        </div>

        <form onSubmit={handleCreateCoupon} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Coupon Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MATRIN25"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 uppercase focus:border-[#0A2E4E] focus:outline-hidden font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Discount Type
            </label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountType)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
            >
              <option value="percentage">Percentage Off (%)</option>
              <option value="fixed">Flat Amount Off (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Discount Amount *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                placeholder={discountType === "percentage" ? "15" : "100"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-8 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
              />
              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                {discountType === "percentage" ? "%" : "₹"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Coupon Limit (Max Uses) *
            </label>
            <input
              type="number"
              required
              placeholder="50"
              value={couponLimit}
              onChange={(e) => setCouponLimit(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#0A2E4E] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#13426B] transition flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Coupon
            </button>
          </div>
        </form>
      </div>

      {/* Active Coupons List Table */}
      <div className="rounded-3xl bg-white p-6 md:p-8 border border-[#EFEAE4] shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0A2E4E]">Active Store Coupons</h3>
            <p className="text-xs text-slate-500">Live discount codes and redemption limit trackers</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0A2E4E]">
            Total Coupons: {coupons.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-[#0A2E4E] border-b border-[#EFEAE4]">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Spend</th>
                <th className="py-3 px-4">Redemption Limit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEAE4]">
              {coupons.map((cpn) => {
                const percentUsed = Math.round((cpn.timesUsed / cpn.couponLimit) * 100);
                const isLimitReached = cpn.timesUsed >= cpn.couponLimit;

                return (
                  <tr key={cpn.id} className="hover:bg-[#FAF7F2]/50 transition">
                    <td className="py-4 px-4 font-mono font-bold text-[#0A2E4E] text-sm">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 border border-amber-200 text-amber-900">
                        <Tag size={12} /> {cpn.code}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {cpn.discountType === "percentage" ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} OFF`}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">₹{cpn.minOrderAmount}</td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                          <span>{cpn.timesUsed} / {cpn.couponLimit} used</span>
                          <span>{percentUsed}%</span>
                        </div>
                        <div className="h-2 w-32 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                            className={`h-full rounded-full transition-all ${
                              isLimitReached ? "bg-rose-500" : percentUsed > 75 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {isLimitReached ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 border border-rose-200">
                          <AlertCircle size={12} /> Limit Exhausted
                        </span>
                      ) : cpn.isActive ? (
                        <button
                          onClick={() => toggleCouponStatus(cpn.id)}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                        >
                          <CheckCircle2 size={12} /> Active
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleCouponStatus(cpn.id)}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 border border-slate-300 hover:bg-slate-200 transition"
                        >
                          <XCircle size={12} /> Inactive
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => deleteCoupon(cpn.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete Coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
