"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import { useAuth } from "@/context/AuthContext";
import { useProductStore } from "@/context/ProductStoreContext";
import CouponManager from "@/components/admin/CouponManager";
import AddProductModal from "@/components/admin/AddProductModal";
import InvoiceModal from "@/components/InvoiceModal";
import { OrderInvoice } from "@/types/order";
import {
  BarChart3,
  Package,
  Tag,
  Users,
  Plus,
  Shield,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShoppingBag,
  FileText,
  DollarSign,
  UserCheck,
  TrendingUp,
  Boxes,
  Grid,
  ClipboardList,
  Star,
  Image as ImageIcon,
  Percent,
  Mail,
  MessageSquare,
  UserPlus,
  ShieldCheck,
  Settings,
  Bell,
  MessageCircle,
  Calendar,
  ChevronDown,
  Menu,
  Check,
  Leaf,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user, isAdmin, openAuthModal, quickAdminLogin } = useAuth();
  const { products, salesAnalytics, deleteProduct, toggleStock } = useProductStore();

  const [activeNav, setActiveNav] = useState("Dashboard");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Admin Invoice Modal state
  const [adminSelectedInvoice, setAdminSelectedInvoice] = useState<OrderInvoice | null>(null);
  const [isAdminInvoiceOpen, setIsAdminInvoiceOpen] = useState(false);

  // Access check
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
          <Shield size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-[#0B2545]">Admin Access Required</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md font-medium">
          Please log in with Admin privileges to access the Matrin Store Management Panel.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={quickAdminLogin}
            className="rounded-2xl bg-[#1E40AF] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-[#1a3899] transition flex items-center justify-center gap-2"
          >
            👑 Log In as Demo Admin
          </button>
          <button
            onClick={() => openAuthModal("login")}
            className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Custom Sign In
          </button>
        </div>
      </div>
    );
  }

  // Sidebar navigation menu definition (Matching Image 1)
  const sidebarSections = [
    {
      group: "MAIN",
      items: [{ id: "Dashboard", label: "Dashboard", icon: BarChart3 }],
    },
    {
      group: "MANAGE",
      items: [
        { id: "Products", label: "Products", icon: Package, badge: products.length },
        { id: "Categories", label: "Categories", icon: Grid },
        { id: "Orders", label: "Orders", icon: ClipboardList, badge: "32" },
        { id: "Customers", label: "Customers", icon: Users },
        { id: "Reviews", label: "Reviews", icon: Star },
        { id: "Coupons", label: "Coupons", icon: Tag },
        { id: "Banners", label: "Banners", icon: ImageIcon },
        { id: "Inventory", label: "Inventory", icon: Boxes },
      ],
    },
    {
      group: "MARKETING",
      items: [
        { id: "Offers", label: "Offers", icon: Percent },
        { id: "Newsletter", label: "Newsletter", icon: Mail },
        { id: "SMS / Email", label: "SMS / Email", icon: MessageSquare },
      ],
    },
    {
      group: "REPORTS",
      items: [
        { id: "Sales Report", label: "Sales Report", icon: TrendingUp },
        { id: "Customers Report", label: "Customers Report", icon: UserCheck },
        { id: "Inventory Report", label: "Inventory Report", icon: FileText },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        { id: "Users", label: "Users", icon: UserPlus },
        { id: "Roles & Permissions", label: "Roles & Permissions", icon: ShieldCheck },
        { id: "Settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  const recentOrders = [
    { id: "#ORD-2024-1256", customer: "Rahul Sharma", time: "2 mins ago", amount: "₹1,299", status: "Delivered", statusBg: "bg-emerald-100 text-emerald-800" },
    { id: "#ORD-2024-1255", customer: "Priya Verma", time: "15 mins ago", amount: "₹899", status: "Processing", statusBg: "bg-blue-100 text-blue-800" },
    { id: "#ORD-2024-1254", customer: "Aman Singh", time: "32 mins ago", amount: "₹1,549", status: "Shipped", statusBg: "bg-purple-100 text-purple-800" },
    { id: "#ORD-2024-1253", customer: "Sneha Patil", time: "1 hour ago", amount: "₹699", status: "Pending", statusBg: "bg-amber-100 text-amber-800" },
    { id: "#ORD-2024-1252", customer: "Vikram Joshi", time: "2 hours ago", amount: "₹2,399", status: "Delivered", statusBg: "bg-emerald-100 text-emerald-800" },
  ];

  const topSellingProducts = [
    { name: "Matrin Detergent Liquid 2L", sold: 420, revenue: "₹1,25,580", image: "/images/products/detergent.webp" },
    { name: "Matrin Dishwash Liquid 500ml", sold: 380, revenue: "₹56,620", image: "/images/products/dishwash.webp" },
    { name: "Matrin Floor Cleaner 1L", sold: 310, revenue: "₹49,690", image: "/images/products/floor-cleaner.webp" },
    { name: "Matrin Toilet Cleaner 500ml", sold: 290, revenue: "₹37,410", image: "/images/products/toilet-cleaner.webp" },
    { name: "Matrin Glass Cleaner 500ml", sold: 250, revenue: "₹26,380", image: "/images/products/bathroom-cleaner.webp" },
  ];

  const lowStockAlerts = [
    { name: "Matrin Toilet Cleaner 500ml", left: 12, image: "/images/products/toilet-cleaner.webp" },
    { name: "Matrin Glass Cleaner 500ml", left: 18, image: "/images/products/bathroom-cleaner.webp" },
    { name: "Matrin Floor Cleaner 1L", left: 20, image: "/images/products/floor-cleaner.webp" },
    { name: "Matrin Dishwash Liquid 500ml", left: 25, image: "/images/products/dishwash.webp" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
      
      {/* Left Navigation Sidebar (Exact Match with Reference Image 1) */}
      <aside className="w-64 bg-[#0A192F] text-white flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto border-r border-slate-800/80">
        <div>
          {/* Top Brand Logo */}
          <div className="p-6 border-b border-slate-800/60 flex flex-col items-start gap-1">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/matrin-logo-clean.webp"
                alt="MATRIN"
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-blue-500/20 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-400/20 mt-1">
              ADMIN PANEL
            </span>
          </div>

          {/* Navigation Items Group */}
          <div className="p-4 space-y-6">
            {sidebarSections.map((sec) => (
              <div key={sec.group} className="space-y-1">
                {sec.group !== "MAIN" && (
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
                    {sec.group}
                  </div>
                )}
                {sec.items.map((item) => {
                  const IconC = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#1E40AF] text-white shadow-md shadow-blue-600/30"
                          : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconC size={16} className={isActive ? "text-cyan-300" : "text-slate-400"} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Card (Exact Match with Image 1) */}
        <div className="p-4">
          <div className="rounded-2xl bg-slate-900/90 p-3.5 border border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/20">
              <Leaf size={18} />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">Matrin</div>
              <div className="text-[10px] text-slate-400 font-medium">Pure Cleaning. Better Living.</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content View (Exact Match with Reference Image 1) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar (Exact Match with Image 1) */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-2xs">
          {/* Search bar & Hamburger */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <button className="text-slate-500 hover:text-slate-800">
              <Menu size={20} />
            </button>

            <div className="relative w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1E40AF] focus:outline-hidden transition shadow-2xs"
              />
            </div>
          </div>

          {/* Right Notifications & Profile Info (Exact Match with Image 1) */}
          <div className="flex items-center gap-5">
            {/* Bell Icon with Badge 5 */}
            <button className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition">
              <Bell size={19} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-2xs">
                5
              </span>
            </button>

            {/* Message Icon with Badge 2 */}
            <button className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition">
              <MessageCircle size={19} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E40AF] text-[9px] font-bold text-white shadow-2xs">
                2
              </span>
            </button>

            {/* User Profile Info */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                alt="Admin User"
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-[#0B2545]">Admin User</div>
                <div className="text-[10px] text-slate-400 font-semibold">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main View */}
        <main className="p-6 space-y-6 flex-1">
          
          {/* Header Title & Date Range Dropdown (Exact Match with Image 1) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0B2545] tracking-tight">
                Dashboard
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Welcome back, Admin! Here&apos;s what&apos;s happening with your store today.
              </p>
            </div>

            {/* Date Range Button */}
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-50 transition">
              <Calendar size={15} className="text-slate-400" />
              <span>01 May 2024 - 31 May 2024</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>

          {/* Row 1: 5 Stat Cards (Exact Match with Reference Image 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Stat 1: Total Orders */}
            <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Total Orders</div>
                <div className="text-2xl font-extrabold text-[#0B2545] mt-1">1,248</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight size={13} />
                  <span>18.6% from last month</span>
                </div>
              </div>
            </div>

            {/* Stat 2: Total Sales */}
            <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <DollarSign size={20} />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Total Sales</div>
                <div className="text-2xl font-extrabold text-[#0B2545] mt-1">₹2,45,680</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight size={13} />
                  <span>22.4% from last month</span>
                </div>
              </div>
            </div>

            {/* Stat 3: Total Customers */}
            <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Total Customers</div>
                <div className="text-2xl font-extrabold text-[#0B2545] mt-1">5,432</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight size={13} />
                  <span>16.7% from last month</span>
                </div>
              </div>
            </div>

            {/* Stat 4: Products */}
            <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Package size={20} />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Products</div>
                <div className="text-2xl font-extrabold text-[#0B2545] mt-1">{products.length || 126}</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight size={13} />
                  <span>8.3% from last month</span>
                </div>
              </div>
            </div>

            {/* Stat 5: Pending Orders */}
            <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Pending Orders</div>
                <div className="text-2xl font-extrabold text-[#0B2545] mt-1">32</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1">
                  <ArrowDownRight size={13} />
                  <span>4.3% from last month</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Sales Overview Chart (Col 8) & Recent Orders List (Col 4) (Exact Match with Image 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sales Overview Chart Card (Col 8) */}
            <div className="lg:col-span-8 rounded-3xl bg-white p-6 border border-slate-100 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-[#0B2545] text-base">
                  Sales Overview
                </h3>
                <select className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#1E40AF]" />
                  <span>This Month</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-200 border border-dashed border-[#1E40AF]" />
                  <span>Last Month</span>
                </div>
              </div>

              {/* SVG Smooth Wave Chart Representation (Matching Image 1) */}
              <div className="h-56 w-full relative flex items-end">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="#F1F5F9" strokeWidth="1" />

                  {/* Last Month Dashed Curve */}
                  <path
                    d="M 0 110 Q 50 90, 100 80 T 200 70 T 300 90 T 400 60 T 500 80"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* This Month Solid Curve */}
                  <path
                    d="M 0 120 C 40 70, 80 90, 120 75 C 160 60, 200 85, 240 50 C 280 80, 320 65, 360 40 C 400 70, 440 55, 500 65"
                    fill="none"
                    stroke="#1E40AF"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* Chart Dates X-Axis Labels */}
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
                <span>01 May</span>
                <span>06 May</span>
                <span>11 May</span>
                <span>16 May</span>
                <span>21 May</span>
                <span>26 May</span>
                <span>31 May</span>
              </div>

              {/* Summary Metrics Row at bottom of chart */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <div className="text-slate-400 font-semibold">Total Revenue</div>
                  <div className="text-base font-extrabold text-[#0B2545] mt-0.5">₹2,45,680</div>
                  <div className="text-[11px] font-bold text-emerald-600">↑ 22.4%</div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">Total Orders</div>
                  <div className="text-base font-extrabold text-[#0B2545] mt-0.5">1,248</div>
                  <div className="text-[11px] font-bold text-emerald-600">↑ 18.6%</div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">Average Order Value</div>
                  <div className="text-base font-extrabold text-[#0B2545] mt-0.5">₹1,969</div>
                  <div className="text-[11px] font-bold text-emerald-600">↑ 3.2%</div>
                </div>

                <div>
                  <div className="text-slate-400 font-semibold">Refunds</div>
                  <div className="text-base font-extrabold text-[#0B2545] mt-0.5">₹4,520</div>
                  <div className="text-[11px] font-bold text-rose-600">↓ 2.1%</div>
                </div>
              </div>

            </div>

            {/* Recent Orders List Card (Col 4 - Exact Match with Image 1) */}
            <div className="lg:col-span-4 rounded-3xl bg-white p-6 border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-[#0B2545] text-base">
                    Recent Orders
                  </h3>
                  <button onClick={() => setActiveNav("Orders")} className="text-xs font-bold text-[#1E40AF] hover:underline">
                    View All
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {recentOrders.map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-extrabold text-[#0B2545]">{ord.id}</div>
                        <div className="text-slate-500 font-medium text-[11px]">{ord.customer} • <span className="text-slate-400">{ord.time}</span></div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-slate-800">{ord.amount}</div>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold mt-0.5 ${ord.statusBg}`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: Top Selling Products (Col 5), Sales by Category Donut (Col 4), Low Stock Alert (Col 3) (Exact Match with Image 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Top Selling Products Card (Col 5) */}
            <div className="lg:col-span-5 rounded-3xl bg-white p-6 border border-slate-100 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-[#0B2545] text-base">
                  Top Selling Products
                </h3>
                <button onClick={() => setActiveNav("Products")} className="text-xs font-bold text-[#1E40AF] hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {topSellingProducts.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-2xl hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0">
                        <ProductImage src={p.image} alt={p.name} fitMode="cover" roundedClassName="rounded-xl" />
                      </div>
                      <div>
                        <div className="font-bold text-[#0B2545] line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{p.sold} Sold</div>
                      </div>
                    </div>
                    <div className="font-extrabold text-[#1E40AF]">{p.revenue}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales by Category Donut Chart Card (Col 4) */}
            <div className="lg:col-span-4 rounded-3xl bg-white p-6 border border-slate-100 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-[#0B2545] text-base">
                  Sales by Category
                </h3>
                <button className="text-xs font-bold text-[#1E40AF] hover:underline">View All</button>
              </div>

              <div className="flex items-center justify-center py-2">
                <div className="relative flex items-center justify-center">
                  {/* SVG Donut Chart */}
                  <svg className="h-44 w-44" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#1E40AF" strokeWidth="16" strokeDasharray="100 140" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="16" strokeDasharray="44 200" strokeDashoffset="-100" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="16" strokeDasharray="32 200" strokeDashoffset="-144" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" strokeWidth="16" strokeDasharray="28 200" strokeDashoffset="-176" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#06B6D4" strokeWidth="16" strokeDasharray="21 200" strokeDashoffset="-204" />
                  </svg>

                  <div className="absolute text-center">
                    <div className="text-xs font-bold text-slate-800">₹2,45,680</div>
                    <div className="text-[9px] text-slate-400 font-semibold">Total Sales</div>
                  </div>
                </div>
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#1E40AF]" /> Detergent (41.7%)</div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Dishwash (18.4%)</div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Floor Cleaner (13.3%)</div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Toilet Cleaner (11.7%)</div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> Glass Cleaner (8.7%)</div>
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Others (6.2%)</div>
              </div>
            </div>

            {/* Low Stock Alert Card (Col 3 - Exact Match with Image 1) */}
            <div className="lg:col-span-3 rounded-3xl bg-white p-6 border border-slate-100 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-[#0B2545] text-base">
                  Low Stock Alert
                </h3>
                <button onClick={() => setActiveNav("Inventory")} className="text-xs font-bold text-[#1E40AF] hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {lowStockAlerts.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 shrink-0">
                        <ProductImage src={item.image} alt={item.name} fitMode="cover" roundedClassName="rounded-lg" />
                      </div>
                      <div className="font-bold text-[#0B2545] text-[11px] line-clamp-1">{item.name}</div>
                    </div>
                    <div className="text-[11px] font-extrabold text-rose-600 whitespace-nowrap">
                      Stock Left: {item.left}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>

        {/* Dashboard Footer (Exact Match with Image 1) */}
        <footer className="mt-auto bg-white border-t border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-2">
          <div>© 2024 Matrin Home Care Pvt. Ltd. All Rights Reserved.</div>
          <div>Made with ❤️ for a cleaner & better tomorrow.</div>
        </footer>

      </div>

      {/* Add Product Modal */}
      <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />

      {/* Admin Invoice Modal */}
      <InvoiceModal
        invoice={adminSelectedInvoice}
        isOpen={isAdminInvoiceOpen}
        onClose={() => setIsAdminInvoiceOpen(false)}
      />
    </div>
  );
}
