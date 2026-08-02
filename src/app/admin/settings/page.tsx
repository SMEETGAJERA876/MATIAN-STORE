"use client";

import { useState } from "react";
import { useProductStore } from "@/context/ProductStoreContext";
import { Settings, Save, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const { settings, updateStoreSettings } = useProductStore();
  const [siteTitle, setSiteTitle] = useState(settings.siteTitle || "MATRIN Store");
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || "support@matrin.com");
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || "+91 1800-200-8899");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold || 499);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      siteTitle,
      contactEmail,
      contactPhone,
      freeShippingThreshold: Number(freeShippingThreshold),
    });
    toast.success("Store configuration saved!");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">System Settings</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Configure global store parameters, contact details, and shipping thresholds
        </p>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
          <Settings size={18} className="text-blue-400" /> Store Configuration
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Site Title & Branding</label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Support Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
          >
            <Save size={16} />
            <span>Save Store Settings</span>
          </button>
        </form>
      </div>

    </div>
  );
}
