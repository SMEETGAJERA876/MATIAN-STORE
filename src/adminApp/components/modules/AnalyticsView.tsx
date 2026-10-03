import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  Wallet,
  Award,
  AlertTriangle,
  Star,
  Tag,
  UserCheck,
  Lightbulb,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/csv';

export const AnalyticsView: React.FC = () => {
  const { orders, products, customers, promotions, addToast } = useAdminStore();

  const validOrders = useMemo(
    () => orders.filter((o) => o.paymentStatus !== 'Failed' && o.shippingStatus !== 'Cancelled'),
    [orders]
  );

  const totalRevenue = useMemo(() => validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [validOrders]);
  const orderCount = validOrders.length;
  const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  const returningShare = customers.length
    ? Math.round((customers.filter((c) => c.segment === 'Returning' || c.segment === 'VIP').length / customers.length) * 100)
    : 0;

  // Revenue by category, reused to surface a "top category" KPI and its share of total revenue
  const categoryRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    validOrders.forEach((o) => {
      o.items.forEach((it) => {
        const product = products.find((p) => p.id === it.productId);
        const cat = product?.category || 'General';
        map[cat] = (map[cat] || 0) + it.totalPrice;
      });
    });
    return Object.entries(map)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [validOrders, products]);

  const topCategory = categoryRevenue[0];
  const topCategoryShare = topCategory && totalRevenue > 0 ? Math.round((topCategory.revenue / totalRevenue) * 100) : 0;

  const lowStockCount = products.filter((p) => p.status !== 'In Stock').length;
  const avgRating = products.length
    ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
    : '0.0';

  const activeCoupons = promotions.filter((p) => p.status === 'Active');
  const couponRevenue = promotions.reduce((sum, p) => sum + (p.revenueAttributed || 0), 0);

  // Monthly revenue trend computed live from order history (falls back gracefully with no data)
  const monthlyTrend = useMemo(() => {
    const map: Record<string, { label: string; sortKey: string; revenue: number; orders: number }> = {};
    validOrders.forEach((o) => {
      const d = new Date(o.date);
      if (isNaN(d.getTime())) return;
      const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!map[sortKey]) map[sortKey] = { label, sortKey, revenue: 0, orders: 0 };
      map[sortKey].revenue += o.totalAmount || 0;
      map[sortKey].orders += 1;
    });
    return Object.values(map).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [validOrders]);

  const revenueTrendChange = useMemo(() => {
    if (monthlyTrend.length < 2) return null;
    const last = monthlyTrend[monthlyTrend.length - 1];
    const prev = monthlyTrend[monthlyTrend.length - 2];
    if (prev.revenue === 0) return null;
    return Math.round(((last.revenue - prev.revenue) / prev.revenue) * 100);
  }, [monthlyTrend]);

  const insights = useMemo(() => {
    const list: { icon: React.ReactNode; text: string }[] = [];

    if (revenueTrendChange !== null) {
      list.push({
        icon: revenueTrendChange >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-rose-600" />,
        text: `Revenue ${revenueTrendChange >= 0 ? 'grew' : 'declined'} ${Math.abs(revenueTrendChange)}% last month vs. the month before.`,
      });
    }

    if (topCategory) {
      list.push({
        icon: <Award className="w-4 h-4 text-matrin-primary" />,
        text: `${topCategory.category} is your top category, driving ${topCategoryShare}% of total revenue.`,
      });
    }

    list.push({
      icon: <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? 'text-amber-500' : 'text-emerald-600'}`} />,
      text: lowStockCount > 0
        ? `${lowStockCount} product${lowStockCount === 1 ? ' is' : 's are'} running low or out of stock — consider restocking soon.`
        : 'All products are adequately stocked right now.',
    });

    list.push({
      icon: <UserCheck className="w-4 h-4 text-matrin-secondary" />,
      text: `${returningShare}% of your customers are returning or VIP buyers.`,
    });

    list.push({
      icon: <Tag className="w-4 h-4 text-matrin-primary" />,
      text: activeCoupons.length > 0
        ? `${activeCoupons.length} active coupon${activeCoupons.length === 1 ? '' : 's'} ${activeCoupons.length === 1 ? 'has' : 'have'} driven ${formatCurrency(couponRevenue)} in attributed revenue.`
        : 'No active coupons right now — launching one could help lift conversions.',
    });

    return list;
  }, [revenueTrendChange, topCategory, topCategoryShare, lowStockCount, returningShare, activeCoupons, couponRevenue]);

  const handleExport = () => {
    if (monthlyTrend.length === 0) {
      addToast('warning', 'No order history yet to export.');
      return;
    }
    exportToCSV(
      monthlyTrend.map((m) => ({ month: m.label, revenue: m.revenue.toFixed(2), orders: m.orders })),
      'matrin_analytics_monthly'
    );
    addToast('success', 'Analytics report exported!');
  };

  const kpiCards = [
    {
      label: 'Realtime Active Visitors',
      value: (
        <span className="flex items-center gap-2">
          184 <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
        </span>
      ),
      sub: '+24 active checkouts',
      subClass: 'text-emerald-600',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      sub: `${orderCount} orders counted`,
      subClass: 'text-matrin-gray',
    },
    {
      label: 'Avg. Order Value',
      value: formatCurrency(avgOrderValue),
      sub: revenueTrendChange !== null ? `${revenueTrendChange >= 0 ? '+' : ''}${revenueTrendChange}% MoM` : 'Awaiting more order history',
      subClass: revenueTrendChange !== null && revenueTrendChange >= 0 ? 'text-emerald-600' : revenueTrendChange !== null ? 'text-rose-600' : 'text-matrin-gray',
    },
    {
      label: 'Conversion Rate',
      value: '3.42%',
      sub: 'Benchmark: 2.8%',
      subClass: 'text-blue-600',
    },
    {
      label: 'Total Customers',
      value: customers.length,
      sub: `${returningShare}% returning or VIP`,
      subClass: 'text-matrin-secondary',
    },
    {
      label: 'Top Category',
      value: topCategory?.category || 'N/A',
      sub: topCategory ? `${topCategoryShare}% of revenue` : 'No sales yet',
      subClass: 'text-matrin-gray',
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockCount,
      sub: lowStockCount > 0 ? 'Needs restocking' : 'All stocked up',
      subClass: lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600',
    },
    {
      label: 'Avg. Product Rating',
      value: (
        <span className="flex items-center gap-1.5">
          {avgRating} <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
        </span>
      ),
      sub: `${products.length} products rated`,
      subClass: 'text-matrin-gray',
    },
    {
      label: 'Active Coupons',
      value: activeCoupons.length,
      sub: `${formatCurrency(couponRevenue)} attributed`,
      subClass: 'text-matrin-primary',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Enterprise Analytics & BI
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Revenue growth, category performance, stock health, and customer insights computed live from your store data.
          </p>
        </div>
        <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
          Export Report
        </Button>
      </div>

      {/* Dense KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-4 shadow-card"
          >
            <div className="text-[11px] font-bold text-matrin-gray uppercase tracking-wider leading-tight">{kpi.label}</div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white mt-1.5">{kpi.value}</div>
            <div className={`text-[11px] font-semibold mt-1.5 ${kpi.subClass}`}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue Growth</CardTitle>
          </CardHeader>
          {monthlyTrend.length > 0 ? (
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1F5EFF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1F5EFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#1F5EFF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-matrin-gray dark:text-slate-400 py-16 text-center">
              No order history yet — revenue trends will appear once orders come in.
            </p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Insights
            </CardTitle>
          </CardHeader>
          <ul className="space-y-3">
            {insights.map((insight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-matrin-bg/60 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder"
              >
                <span className="shrink-0 mt-0.5">{insight.icon}</span>
                <span className="text-xs font-medium text-matrin-text dark:text-slate-200 leading-relaxed">{insight.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        {categoryRevenue.length > 0 ? (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRevenue}>
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenue']} />
                <Bar dataKey="revenue" fill="#0B3A75" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-matrin-gray dark:text-slate-400 py-8 text-center">
            No sales recorded yet — category breakdown will appear once orders come in.
          </p>
        )}
      </Card>
    </div>
  );
};
