"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("MATRIN Enterprise Store");
  const [supportEmail, setSupportEmail] = useState("support@matrin.com");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("499");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully!", { icon: "⚙️" });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">System Settings</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Configure global store preferences</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#1E293B] rounded-2xl border border-slate-800 p-6 space-y-5 text-xs shadow-xl">
        <div>
          <label className="block text-slate-300 font-bold mb-1.5">Store Brand Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1.5">Customer Support Email</label>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1.5">Free Shipping Minimum Amount (₹)</label>
          <input
            type="number"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
          >
            Save Store Settings
          </button>
        </div>
      </form>
    </div>
  );
}
