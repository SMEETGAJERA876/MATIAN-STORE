"use client";

import { useProductStore } from "@/context/ProductStoreContext";
import { Users, UserX, UserCheck, Shield } from "lucide-react";

export default function AdminCustomersPage() {
  const { customers, toggleBlockCustomer } = useProductStore();

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">Customer Management</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Manage registered customer accounts and access permissions
        </p>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                    <span>{c.name}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-300">{c.email}</td>
                  <td className="px-6 py-4 font-bold text-white">{c.totalOrders || 0}</td>
                  <td className="px-6 py-4 font-extrabold text-blue-400">₹{c.totalSpent || 0}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        c.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleBlockCustomer(c.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        c.status === "Active"
                          ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                    >
                      {c.status === "Active" ? "Block Access" : "Unblock User"}
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
