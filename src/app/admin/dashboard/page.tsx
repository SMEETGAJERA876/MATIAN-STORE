"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/context/ProductStoreContext";
import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
}

export default function AdminDashboardPage() {
  const { products, orders, customers } = useProductStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const rev = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const lowStock = products.filter((p) => (p.stockCount || 0) < 15).length;

    setStats({
      totalRevenue: rev || 124500,
      totalOrders: orders.length || 42,
      totalCustomers: customers.length || 18,
      lowStockCount: lowStock,
    });
  }, [products, orders, customers]);

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Real-time analytics and store performance monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
          >
            <Package size={16} />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue Card */}
        <div className="rounded-2xl bg-[#1E293B] p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">₹{stats.totalRevenue.toLocaleString("en-IN")}</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold mt-1">
              <TrendingUp size={14} />
              <span>+18.4% from last month</span>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="rounded-2xl bg-[#1E293B] p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">{stats.totalOrders}</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-bold mt-1">
              <ArrowUpRight size={14} />
              <span>12 new orders today</span>
            </div>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="rounded-2xl bg-[#1E293B] p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Customers</span>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">{stats.totalCustomers}</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-bold mt-1">
              <TrendingUp size={14} />
              <span>+8.2% new users</span>
            </div>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="rounded-2xl bg-[#1E293B] p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</span>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">{stats.lowStockCount}</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold mt-1">
              <span>Requires inventory restock</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders & Top Products Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders List */}
        <div className="lg:col-span-7 bg-[#1E293B] rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-blue-400" /> Recent Orders
            </h3>
            <Link href="/admin/orders" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{ord.customer.fullName}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{ord.invoiceNumber} • {ord.orderDate}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-white block">₹{ord.totalAmount}</span>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                    {ord.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-5 bg-[#1E293B] rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" /> Top Selling Products
            </h3>
            <Link href="/admin/products" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="h-9 w-9 rounded-lg object-cover bg-slate-800" />
                  <div>
                    <h4 className="font-bold text-white truncate max-w-[160px]">{p.name}</h4>
                    <p className="text-[10px] text-slate-400">{p.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-400 block">₹{p.price}</span>
                  <span className="text-[10px] text-slate-400">{p.stockCount} in stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
