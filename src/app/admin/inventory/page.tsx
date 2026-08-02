"use client";

import { useState } from "react";
import { useProductStore } from "@/context/ProductStoreContext";
import { Warehouse, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminInventoryPage() {
  const { products, inventoryLogs, updateInventoryStock } = useProductStore();
  const [selectedProdId, setSelectedProdId] = useState<number>(products[0]?.id || 1);
  const [adjustQty, setAdjustQty] = useState("10");
  const [adjustReason, setAdjustReason] = useState("Warehouse Restock");

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdId || !adjustQty) return;

    updateInventoryStock(Number(selectedProdId), Number(adjustQty), adjustReason);
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">Inventory & Stock Controls</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Monitor warehouse stock, adjust inventory levels, and view real-time audit logs
        </p>
      </div>

      {/* Adjustment Form & Inventory Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stock Adjustment Form */}
        <div className="lg:col-span-5 bg-[#1E293B] rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RefreshCw size={18} className="text-blue-400" /> Stock Adjustment Tool
          </h3>

          <form onSubmit={handleStockAdjustment} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Select Product *</label>
              <select
                value={selectedProdId}
                onChange={(e) => setSelectedProdId(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current Stock: {p.stockCount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Quantity Change (+ or -) *</label>
              <input
                type="number"
                required
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Adjustment Reason *</label>
              <input
                type="text"
                required
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
            >
              <span>Apply Stock Adjustment</span>
            </button>
          </form>
        </div>

        {/* Real-time Inventory Table */}
        <div className="lg:col-span-7 bg-[#1E293B] rounded-2xl border border-slate-800 p-6 space-y-4 overflow-hidden">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Warehouse size={18} className="text-emerald-400" /> Current Stock Levels
          </h3>

          <div className="overflow-x-auto max-h-[320px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-white">{p.name}</td>
                    <td className="px-4 py-3 text-slate-400">{p.category}</td>
                    <td className="px-4 py-3 font-extrabold text-blue-400">{p.stockCount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                          p.stockCount > 15
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {p.stockCount > 15 ? "Sufficient" : "Low Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
