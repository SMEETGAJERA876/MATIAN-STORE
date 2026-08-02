import React from 'react';
import { BarChart3, TrendingUp, Users, Eye, ArrowUpRight } from 'lucide-react';
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
import { formatCurrency } from '../../utils/formatters';

const analyticsMonthlyData = [
  { month: 'Jan', revenue: 65000, customers: 420 },
  { month: 'Feb', revenue: 78000, customers: 490 },
  { month: 'Mar', revenue: 82000, customers: 560 },
  { month: 'Apr', revenue: 95000, customers: 680 },
  { month: 'May', revenue: 110000, customers: 740 },
  { month: 'Jun', revenue: 124500, customers: 850 },
];

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          Enterprise Analytics & BI
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Deep customer acquisition, revenue growth rates, conversion funnels, and real-time visitors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold text-matrin-gray">Realtime Active Visitors</div>
          <div className="text-3xl font-extrabold text-matrin-primary dark:text-white mt-1 flex items-center gap-2">
            184 <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div className="text-xs font-semibold text-emerald-600 mt-2">+24 active checkouts</div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold text-matrin-gray">Avg. Order Value (AOV)</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">$284.50</div>
          <div className="text-xs font-semibold text-emerald-600 mt-2">+6.4% YoY</div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold text-matrin-gray">Conversion Rate</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">3.42%</div>
          <div className="text-xs font-semibold text-blue-600 mt-2">Benchmark: 2.8%</div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold text-matrin-gray">Customer Retention</div>
          <div className="text-3xl font-extrabold text-matrin-secondary mt-1">68.4%</div>
          <div className="text-xs font-semibold text-emerald-600 mt-2">Top 5% SaaS Tier</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Growth ($ USD)</CardTitle>
        </CardHeader>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsMonthlyData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F5EFF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#1F5EFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#1F5EFF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
