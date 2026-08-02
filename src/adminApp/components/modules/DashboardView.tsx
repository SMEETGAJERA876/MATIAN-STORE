import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart2,
  Sparkles,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency } from '../../utils/formatters';

const revenueData = [
  { day: 'Mon', revenue: 12400, sales: 120 },
  { day: 'Tue', revenue: 18900, sales: 180 },
  { day: 'Wed', revenue: 14200, sales: 140 },
  { day: 'Thu', revenue: 22400, sales: 210 },
  { day: 'Fri', revenue: 19800, sales: 190 },
  { day: 'Sat', revenue: 28900, sales: 290 },
  { day: 'Sun', revenue: 24500, sales: 240 },
];

const categoryDonutData = [
  { name: 'Floor Care', value: 45, color: '#0B3A75' },
  { name: 'Kitchenware', value: 30, color: '#1F5EFF' },
  { name: 'Eco-Cleaning', value: 25, color: '#22C55E' },
];

export const DashboardView: React.FC = () => {
  const {
    products,
    orders,
    customers,
    inventory,
    setActiveModule,
    setSelectedOrderId,
    setAddProductModalOpen,
    setAIChatOpen,
  } = useAdminStore();

  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const pendingOrdersCount = orders.filter((o) => o.paymentStatus === 'Pending').length;
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.criticalLevel).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Overview
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Real-time performance analytics for your home care enterprise.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<BarChart2 className="w-4 h-4" />}
            onClick={() => setActiveModule('sales-reports')}
          >
            View Reports
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAddProductModalOpen(true)}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Metric Cards Row (Matching Image 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-matrin-primary dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-matrin-gray dark:text-slate-400">
              Total Revenue
            </div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white tracking-tight mt-0.5">
              $124,500
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +5%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-matrin-gray dark:text-slate-400">
              Total Orders
            </div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white tracking-tight mt-0.5">
              1,240
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +8%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-matrin-gray dark:text-slate-400">
              Total Customers
            </div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white tracking-tight mt-0.5">
              850
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-matrin-gray dark:text-slate-400">
              Total Products
            </div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white tracking-tight mt-0.5">
              {products.length + 36}
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-matrin-gray dark:text-slate-400">
              Pending Orders
            </div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white tracking-tight mt-0.5">
              15
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-matrin-gray dark:text-slate-400">
              Low Stock
            </div>
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight mt-0.5">
              {lowStockCount || 3}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Trends Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Sales Trends Chart (Matching Image 5) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Sales Trends</CardTitle>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl px-3 py-1 text-xs font-semibold text-matrin-text dark:text-white focus:outline-none"
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Quarter</option>
            </select>
          </CardHeader>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" fill="#0B3A75" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution Donut Chart (Matching Image 5) */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>

          <div className="flex flex-col items-center justify-center py-2 relative">
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Center donut text */}
              <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-2xl font-extrabold text-matrin-text dark:text-white">42</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-matrin-gray">SKUs</div>
              </div>
            </div>

            {/* Category breakdown legend */}
            <div className="w-full space-y-2 mt-4 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#0B3A75]" />
                  <span className="text-matrin-text dark:text-slate-200">Floor Care</span>
                </div>
                <span className="font-extrabold">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#1F5EFF]" />
                  <span className="text-matrin-text dark:text-slate-200">Kitchenware</span>
                </div>
                <span className="font-extrabold">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                  <span className="text-matrin-text dark:text-slate-200">Eco-Cleaning</span>
                </div>
                <span className="font-extrabold">25%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Recent Orders & Activity Timeline (Matching Image 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-matrin-text dark:text-white">Recent Orders</h3>
            <button
              onClick={() => setActiveModule('orders')}
              className="text-xs font-bold text-matrin-primary dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All Orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-matrin-border dark:border-matrin-darkborder text-matrin-gray uppercase tracking-wider font-semibold">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-matrin-border dark:divide-matrin-darkborder font-medium">
                {orders.slice(0, 4).map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className="hover:bg-matrin-bg/60 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-2 font-bold text-matrin-primary dark:text-blue-400">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-2 text-matrin-text dark:text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-700 dark:text-slate-200">
                        {ord.customerName.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{ord.customerName}</span>
                    </td>
                    <td className="py-3.5 px-2">
                      <Badge variant={ord.paymentStatus === 'Paid' ? 'success' : 'warning'} size="sm">
                        {ord.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-2 text-right font-extrabold text-matrin-text dark:text-white">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activity Timeline (Matching Image 5) */}
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>

          <div className="space-y-6 pt-2">
            <div className="flex gap-3 relative">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-matrin-primary flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-matrin-text dark:text-white">
                  New Product Added
                </div>
                <div className="text-[11px] text-matrin-gray dark:text-slate-400 mt-0.5">
                  MATRIN X1 Robotic Cleaner
                </div>
                <div className="text-[10px] text-slate-400 mt-1">2 hours ago</div>
              </div>
            </div>

            <div className="flex gap-3 relative">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-matrin-text dark:text-white">
                  Bulk Order Received
                </div>
                <div className="text-[11px] text-matrin-gray dark:text-slate-400 mt-0.5">
                  Order #MTR-8901 - $1,120.00
                </div>
                <div className="text-[10px] text-slate-400 mt-1">5 hours ago</div>
              </div>
            </div>

            <div className="flex gap-3 relative">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Low Stock Alert
                </div>
                <div className="text-[11px] text-matrin-gray dark:text-slate-400 mt-0.5">
                  Eco-Spray Refills (3 left)
                </div>
                <div className="text-[10px] text-slate-400 mt-1">1 day ago</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
