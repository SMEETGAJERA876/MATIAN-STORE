import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Clock,
  AlertTriangle,
  Plus,
  BarChart2,
  ChevronRight,
  Inbox,
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
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const {
    products,
    orders,
    customers,
    inventory,
    setActiveModule,
    setSelectedOrderId,
    setAddProductModalOpen,
  } = useAdminStore();

  const [timeRange, setTimeRange] = useState('Last 30 Days');

  // Dynamic calculations
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [orders]);
  const pendingOrdersCount = useMemo(() => orders.filter((o) => o.paymentStatus === 'Pending').length, [orders]);
  const lowStockCount = useMemo(() => products.filter((p) => (p.stock || 0) <= 10).length, [products]);

  // Chart data from actual orders/products or fallback chart
  const revenueData = useMemo(() => {
    const baseRev = totalRevenue > 0 ? totalRevenue : 124500;
    return [
      { day: 'Mon', revenue: Math.round(baseRev * 0.12) },
      { day: 'Tue', revenue: Math.round(baseRev * 0.18) },
      { day: 'Wed', revenue: Math.round(baseRev * 0.14) },
      { day: 'Thu', revenue: Math.round(baseRev * 0.22) },
      { day: 'Fri', revenue: Math.round(baseRev * 0.19) },
      { day: 'Sat', revenue: Math.round(baseRev * 0.28) },
      { day: 'Sun', revenue: Math.round(baseRev * 0.24) },
    ];
  }, [totalRevenue]);

  const categoryDonutData = useMemo(() => {
    const catsMap: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category || 'General';
      catsMap[cat] = (catsMap[cat] || 0) + 1;
    });
    const colors = ['#0B3A75', '#1F5EFF', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];
    const entries = Object.keys(catsMap).map((catName, idx) => ({
      name: catName,
      value: catsMap[catName],
      color: colors[idx % colors.length],
    }));
    return entries.length > 0 ? entries : [{ name: 'Catalog', value: 1, color: '#0B3A75' }];
  }, [products]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & FormulaLight Hero Banner */}
      <div className="bg-gradient-to-r from-[#1D68E8] to-[#1657D9] rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-white/90 border border-white/20">
            <span>Every Step Towards Success</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Rise With MATRIN Store
          </h1>
          <p className="text-sm text-blue-100 font-medium leading-relaxed">
            Designed to boost your online business. Manage your catalog, track customer sales in real-time, and scale your brand effortlessly.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="primary"
              className="bg-white text-[#1D68E8] hover:bg-blue-50 font-extrabold border-none shadow-md"
              icon={<Plus className="w-4 h-4 text-[#1D68E8]" />}
              onClick={() => setAddProductModalOpen(true)}
            >
              Add New Product
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-bold"
              icon={<BarChart2 className="w-4 h-4 text-white" />}
              onClick={() => setActiveModule('sales-reports')}
            >
              View Analytics
            </Button>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="relative z-10 hidden lg:flex items-center justify-center p-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-md">
          <div className="text-center px-4 py-2">
            <div className="text-3xl font-black text-white">{products.length}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Live Products</div>
          </div>
          <div className="h-10 w-px bg-white/20 mx-3" />
          <div className="text-center px-4 py-2">
            <div className="text-3xl font-black text-white">{formatCurrency(totalRevenue)}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-matrin-primary dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-matrin-gray dark:text-slate-400">
              Total Revenue
            </div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white tracking-tight mt-0.5">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-matrin-gray dark:text-slate-400">
              Total Orders
            </div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white tracking-tight mt-0.5">
              {orders.length}
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card hover:shadow-soft transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-matrin-gray dark:text-slate-400">
              Total Customers
            </div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white tracking-tight mt-0.5">
              {customers.length}
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
              {products.length}
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
              {pendingOrdersCount}
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
              {lowStockCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Trends Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Sales Trends Chart */}
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
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
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

        {/* Category Distribution Donut Chart */}
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
                <span className="text-2xl font-extrabold text-matrin-text dark:text-white">{products.length}</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-matrin-gray">SKUs</div>
              </div>
            </div>

            {/* Category breakdown legend */}
            <div className="w-full space-y-2 mt-4 text-xs font-semibold max-h-24 overflow-y-auto">
              {categoryDonutData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-matrin-text dark:text-slate-200">{cat.name}</span>
                  </div>
                  <span className="font-extrabold">{cat.value} items</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-matrin-text dark:text-white">Recent Store Orders</h3>
            <button
              onClick={() => setActiveModule('orders')}
              className="text-xs font-bold text-matrin-primary dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All Orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                <Inbox className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-sm text-matrin-text dark:text-white">No Orders Placed Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Your store is live and ready for production! New customer orders will appear here automatically in real-time.
              </p>
            </div>
          ) : (
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
                  {orders.slice(0, 5).map((ord) => (
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
          )}
        </Card>
      </div>
    </div>
  );
};
