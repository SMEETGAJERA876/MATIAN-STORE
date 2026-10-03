import React, { useMemo, useState } from 'react';
import { DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Order } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  Paid: '#10B981',
  Pending: '#F59E0B',
  Failed: '#EF4444',
  Refunded: '#94A3B8',
};

export const RevenueView: React.FC = () => {
  const { orders } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');

  const grossRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [orders]);

  const refundedAmount = useMemo(
    () => orders.filter((o) => o.paymentStatus === 'Refunded').reduce((sum, o) => sum + o.totalAmount, 0),
    [orders]
  );

  const failedAmount = useMemo(
    () => orders.filter((o) => o.paymentStatus === 'Failed').reduce((sum, o) => sum + o.totalAmount, 0),
    [orders]
  );

  const netRevenue = grossRevenue - refundedAmount - failedAmount;

  const pendingPayouts = useMemo(
    () => orders.filter((o) => o.paymentStatus === 'Paid' && o.shippingStatus !== 'Delivered').reduce((sum, o) => sum + o.totalAmount, 0),
    [orders]
  );

  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      map[o.paymentStatus] = (map[o.paymentStatus] || 0) + o.totalAmount;
    });
    return Object.entries(map).map(([status, value]) => ({ name: status, value }));
  }, [orders]);

  const filterTabs = [
    { id: 'all', label: 'All', count: orders.length },
    { id: 'Paid', label: 'Paid', count: orders.filter((o) => o.paymentStatus === 'Paid').length },
    { id: 'Pending', label: 'Pending', count: orders.filter((o) => o.paymentStatus === 'Pending').length },
    { id: 'Refunded', label: 'Refunded', count: orders.filter((o) => o.paymentStatus === 'Refunded').length },
    { id: 'Failed', label: 'Failed', count: orders.filter((o) => o.paymentStatus === 'Failed').length },
  ];

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter((o) => o.paymentStatus === activeTab);
  }, [orders, activeTab]);

  const columns: Column<Order>[] = [
    {
      header: 'ORDER',
      accessorKey: 'orderNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-matrin-primary dark:text-blue-400">{row.orderNumber}</span>
      ),
    },
    {
      header: 'CUSTOMER',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => <span className="text-xs font-semibold text-matrin-text dark:text-white">{row.customerName}</span>,
    },
    {
      header: 'DATE',
      accessorKey: 'date',
      sortable: true,
      cell: (row) => <span className="text-xs text-matrin-gray dark:text-slate-400">{formatDate(row.date)}</span>,
    },
    {
      header: 'AMOUNT',
      accessorKey: 'totalAmount',
      sortable: true,
      cell: (row) => (
        <span className="text-sm font-black text-matrin-text dark:text-white">{formatCurrency(row.totalAmount)}</span>
      ),
    },
    {
      header: 'PAYMENT STATUS',
      accessorKey: 'paymentStatus',
      sortable: true,
      cell: (row) => (
        <Badge
          variant={
            row.paymentStatus === 'Paid' ? 'success' : row.paymentStatus === 'Pending' ? 'warning' : 'danger'
          }
          dot
        >
          {row.paymentStatus}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          Revenue & Financial Ledger
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Gross revenue, refunds, and outstanding payouts computed live from your order history.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <DollarSign className="w-4 h-4" /> Gross Revenue
          </div>
          <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">
            {formatCurrency(grossRevenue)}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <TrendingDown className="w-4 h-4" /> Refunded / Failed
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(refundedAmount + failedAmount)}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <TrendingUp className="w-4 h-4" /> Net Revenue
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(netRevenue)}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <Wallet className="w-4 h-4" /> Pending Payouts
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {formatCurrency(pendingPayouts)}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Payment Status</CardTitle>
        </CardHeader>
        {statusBreakdown.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {statusBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={STATUS_COLORS[entry.name] || '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-matrin-gray dark:text-slate-400 py-8 text-center">
            No orders recorded yet.
          </p>
        )}
      </Card>

      <DataTable
        title="Transaction Ledger"
        data={filteredOrders}
        columns={columns}
        searchKey="orderNumber"
        searchPlaceholder="Search order number or customer..."
        exportFilename="matrin_revenue_ledger"
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};
