"use client";

import { useProductStore } from "@/context/ProductStoreContext";

export default function AdminInventoryPage() {
  const { products, updateProduct } = useProductStore();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">Warehouse Inventory</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Adjust product stock quantities in real time</p>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{p.name}</td>
                  <td className="px-6 py-4 text-slate-300">{p.category}</td>
                  <td className="px-6 py-4 font-extrabold text-blue-400 text-sm">{p.stockCount} units</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        p.stockCount > 15
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {p.stockCount > 15 ? "Healthy Stock" : "Low Stock Alert"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => updateProduct(p.id, { stockCount: Math.max(0, p.stockCount - 5) })}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                    >
                      - 5
                    </button>
                    <button
                      onClick={() => updateProduct(p.id, { stockCount: p.stockCount + 10 })}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-md shadow-blue-600/30"
                    >
                      + 10 Restock
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
