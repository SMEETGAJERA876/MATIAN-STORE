"use client";

import { useProductStore } from "@/context/ProductStoreContext";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useProductStore();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">Order Management</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Track and manage order fulfillment</p>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-blue-400">{ord.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <span className="block font-bold text-white">{ord.customer.fullName}</span>
                    <span className="text-[10px] text-slate-400">{ord.customer.email}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-300">{ord.orderDate}</td>
                  <td className="px-6 py-4 font-extrabold text-white">₹{ord.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as unknown as typeof ord.paymentStatus)}
                      className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-white text-[11px] font-bold"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Pending">Pending</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
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
