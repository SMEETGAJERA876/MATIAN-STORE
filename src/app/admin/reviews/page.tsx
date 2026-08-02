"use client";

import { useProductStore } from "@/context/ProductStoreContext";
import { Star, CheckCircle2, Flag, Trash2 } from "lucide-react";

export default function AdminReviewsPage() {
  const { reviews, approveReview, flagReview, deleteReview } = useProductStore();

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">Review Moderation</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Approve, flag, or remove customer feedback before publishing to storefront
        </p>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Review Comment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{r.productName}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">{r.customerName}</td>
                  <td className="px-6 py-4 font-extrabold text-amber-400 flex items-center gap-1">
                    <Star size={14} className="fill-amber-400" />
                    <span>{r.rating}.0</span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{r.comment}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        r.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : r.status === "Flagged"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => approveReview(r.id)}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                      title="Approve Review"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <button
                      onClick={() => flagReview(r.id)}
                      className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition"
                      title="Flag Review"
                    >
                      <Flag size={16} />
                    </button>
                    <button
                      onClick={() => deleteReview(r.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
