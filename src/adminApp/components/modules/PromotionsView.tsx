import React, { useState } from 'react';
import { Plus, Tag, TrendingUp, Sparkles, Clock, Rocket, Filter, Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { Promotion } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const PromotionsView: React.FC = () => {
  const {
    promotions,
    addPromotion,
    isCreateCouponModalOpen,
    setCreateCouponModalOpen,
    addToast,
  } = useAdminStore();

  const [code, setCode] = useState('');
  const [type, setType] = useState<'Percentage' | 'Fixed Amount' | 'Free Shipping'>('Percentage');
  const [val, setVal] = useState('15%');
  const [limit, setLimit] = useState(500);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    addPromotion({
      code: code.toUpperCase(),
      incentiveType: type,
      value: val,
      usageProgress: 0,
      usageLimit: limit,
      expiryDate: 'Nov 30, 2024',
      status: 'Active',
      revenueAttributed: 0,
    });
    setCode('');
    setCreateCouponModalOpen(false);
  };

  const columns: Column<Promotion>[] = [
    {
      header: 'COUPON CODE',
      accessorKey: 'code',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-matrin-secondary">
            <Tag className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-matrin-text dark:text-white tracking-wider">
            {row.code}
          </span>
        </div>
      ),
    },
    {
      header: 'INCENTIVE TYPE',
      accessorKey: 'incentiveType',
      sortable: true,
      cell: (row) => (
        <span className="text-matrin-gray dark:text-slate-400 font-medium">
          {row.incentiveType}
        </span>
      ),
    },
    {
      header: 'VALUE',
      accessorKey: 'value',
      sortable: true,
      cell: (row) => (
        <span className="text-lg font-black text-matrin-primary dark:text-blue-400">
          {row.value}
        </span>
      ),
    },
    {
      header: 'USAGE PROGRESS',
      accessorKey: 'usageProgress',
      sortable: true,
      cell: (row) => {
        const percentage = Math.min(100, Math.round((row.usageProgress / row.usageLimit) * 100));
        return (
          <div className="w-44 space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-matrin-text dark:text-white">
              <span>{row.usageProgress} / {row.usageLimit}</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-matrin-secondary rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'EXPIRY',
      accessorKey: 'expiryDate',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="text-xs font-semibold text-matrin-text dark:text-white">{row.expiryDate}</div>
          {row.status === 'Active' ? (
            <div className="text-[10px] text-amber-600 font-bold">Expires soon</div>
          ) : (
            <div className="text-[10px] text-rose-500 font-bold">Expired</div>
          )}
        </div>
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Promotions Manager
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Manage flash sales, coupon codes, and automated discount incentives.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateCouponModalOpen(true)}
        >
          Create Coupon
        </Button>
      </div>

      {/* 3 Metric Cards (Matching Reference Image 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold text-matrin-gray dark:text-slate-400">
            Active Campaigns
          </div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">
            12
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
            +2 this month
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold text-matrin-gray dark:text-slate-400">
            Total Redemptions
          </div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">
            2,841
          </div>
          <div className="text-xs font-medium text-matrin-gray dark:text-slate-400 mt-2">
            Updated 1h ago
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold text-matrin-gray dark:text-slate-400">
            Revenue Attributed
          </div>
          <div className="text-3xl font-extrabold text-matrin-primary dark:text-blue-400 mt-1">
            $42,900
          </div>
          <div className="text-xs font-semibold text-matrin-secondary mt-2">
            18% of total sales
          </div>
        </div>
      </div>

      {/* Main Campaign Performance DataTable */}
      <DataTable
        title="Campaign Performance"
        data={promotions}
        columns={columns}
        searchKey="code"
        searchPlaceholder="Search coupon codes..."
        exportFilename="matrin_promotions"
      />

      {/* Bottom Banners Grid (Matching Reference Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Blue Card: Maximize Q4 Impact */}
        <div className="lg:col-span-2 bg-gradient-to-r from-matrin-primary to-blue-900 text-white rounded-3xl p-8 shadow-elevated relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          {/* Decorative background blob */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-matrin-secondary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-md space-y-3 z-10">
            <h3 className="text-2xl font-black tracking-tight">Maximize Q4 Impact</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Our data suggests creating a 15% discount for recurring cleaning subscriptions could increase your retention by 22% this quarter.
            </p>
          </div>

          <div className="pt-6 z-10">
            <Button
              variant="outline"
              className="bg-white text-matrin-primary hover:bg-blue-50 font-extrabold border-none"
              icon={<Rocket className="w-4 h-4 text-matrin-secondary" />}
              onClick={() => addToast('success', 'Smart Campaign Launched!')}
            >
              Launch Smart Campaign
            </Button>
          </div>
        </div>

        {/* Right Stacked Insights */}
        <div className="space-y-4">
          <div className="bg-matrin-secondary/10 dark:bg-blue-950/40 border border-matrin-secondary/20 rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-matrin-secondary text-white">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-matrin-secondary text-white px-2 py-0.5 rounded-full">
                New Trend
              </span>
            </div>
            <h4 className="text-sm font-bold text-matrin-text dark:text-white mt-3">
              Bestselling Discount
            </h4>
            <p className="text-xs text-matrin-gray dark:text-slate-400 mt-1">
              Coupons with "$20 Off" have 40% higher conversion than "15% Off" this week.
            </p>
          </div>

          <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-matrin-text dark:text-white">
                  Upcoming Expiry
                </div>
                <div className="text-[11px] text-matrin-gray">3 coupons end soon</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 text-xs"
              onClick={() => addToast('info', 'Viewing campaign timelines')}
            >
              Review Timelines
            </Button>
          </div>
        </div>
      </div>

      {/* Modal for Create Coupon */}
      <Modal
        isOpen={isCreateCouponModalOpen}
        onClose={() => setCreateCouponModalOpen(false)}
        title="Generate New Coupon Code"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. FLASH2024"
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary font-mono uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">
                Incentive Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed Amount">Fixed Amount ($)</option>
                <option value="Free Shipping">Free Shipping</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">
                Discount Value
              </label>
              <input
                type="text"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="20% or $50"
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">
              Usage Limit
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-matrin-border">
            <Button variant="outline" type="button" onClick={() => setCreateCouponModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save & Launch Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
