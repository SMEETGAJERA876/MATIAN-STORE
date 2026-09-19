import React, { useMemo } from 'react';
import { Megaphone, Tag, Users, TrendingUp, Mail, Bell, MessageSquare, Share2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency } from '../../utils/formatters';
import { Promotion } from '../../types';

export const MarketingView: React.FC = () => {
  const { promotions, setActiveModule } = useAdminStore();

  const activeCampaigns = promotions.filter((p) => p.status === 'Active').length;
  const totalRedemptions = promotions.reduce((sum, p) => sum + p.usageProgress, 0);
  const revenueAttributed = promotions.reduce((sum, p) => sum + p.revenueAttributed, 0);
  const avgRedemptionRate = useMemo(() => {
    const rates = promotions.filter((p) => p.usageLimit > 0).map((p) => p.usageProgress / p.usageLimit);
    return rates.length > 0 ? Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100) : 0;
  }, [promotions]);

  const columns: Column<Promotion>[] = [
    {
      header: 'CAMPAIGN',
      accessorKey: 'code',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-matrin-secondary">
            <Tag className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-matrin-text dark:text-white tracking-wider">{row.code}</span>
        </div>
      ),
    },
    {
      header: 'INCENTIVE',
      accessorKey: 'incentiveType',
      sortable: true,
      cell: (row) => <span className="text-xs font-medium text-matrin-gray dark:text-slate-400">{row.incentiveType}</span>,
    },
    {
      header: 'REDEMPTIONS',
      accessorKey: 'usageProgress',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-bold text-matrin-text dark:text-white">
          {row.usageProgress} / {row.usageLimit}
        </span>
      ),
    },
    {
      header: 'REVENUE ATTRIBUTED',
      accessorKey: 'revenueAttributed',
      sortable: true,
      cell: (row) => (
        <span className="text-sm font-black text-matrin-primary dark:text-blue-400">
          {formatCurrency(row.revenueAttributed)}
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'} dot>
          {row.status}
        </Badge>
      ),
    },
  ];

  const channels = [
    { id: 'email', label: 'Email Campaigns', icon: <Mail className="w-4 h-4" />, desc: 'Managed via your promotions & coupon codes above' },
    { id: 'push', label: 'Push Notifications', icon: <Bell className="w-4 h-4" />, desc: 'Configure alerts from Notifications settings' },
    { id: 'sms', label: 'SMS Engagement', icon: <MessageSquare className="w-4 h-4" />, desc: 'Not yet connected — requires an SMS provider' },
    { id: 'referral', label: 'Referral Tracking', icon: <Share2 className="w-4 h-4" />, desc: 'Not yet connected — requires a referral program setup' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Marketing Campaigns
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Coupon-driven campaign performance, computed live from your Promotions data.
          </p>
        </div>
        <button
          onClick={() => setActiveModule('promotions')}
          className="text-xs font-bold text-matrin-primary dark:text-blue-400 hover:underline"
        >
          Manage in Promotions &rarr;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <Megaphone className="w-4 h-4" /> Active Campaigns
          </div>
          <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">{activeCampaigns}</div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <Users className="w-4 h-4" /> Total Redemptions
          </div>
          <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">{totalRedemptions}</div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <TrendingUp className="w-4 h-4" /> Revenue Attributed
          </div>
          <div className="text-2xl font-extrabold text-matrin-primary dark:text-blue-400 mt-1">
            {formatCurrency(revenueAttributed)}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <Tag className="w-4 h-4" /> Avg. Redemption Rate
          </div>
          <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">{avgRedemptionRate}%</div>
        </div>
      </div>

      <DataTable
        title="Campaign Performance"
        data={promotions}
        columns={columns}
        searchKey="code"
        searchPlaceholder="Search coupon codes..."
        exportFilename="matrin_marketing_campaigns"
      />

      <Card>
        <CardHeader>
          <CardTitle>Channels</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-matrin-border dark:border-matrin-darkborder bg-matrin-bg/40 dark:bg-slate-900/40"
            >
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 text-matrin-primary dark:text-blue-400 border border-matrin-border dark:border-matrin-darkborder">
                {ch.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-matrin-text dark:text-white">{ch.label}</div>
                <div className="text-[11px] text-matrin-gray dark:text-slate-400">{ch.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
