import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, RotateCcw } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const FinanceView: React.FC = () => {
  const { orders, processRefund } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');

  const paidAmount = orders.filter((o) => o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingAmount = orders.filter((o) => o.paymentStatus === 'Pending').reduce((sum, o) => sum + o.totalAmount, 0);
  const refundedAmount = orders.filter((o) => o.paymentStatus === 'Refunded').reduce((sum, o) => sum + o.totalAmount, 0);
  const netRevenue = paidAmount - refundedAmount;

  const filterTabs = [
    { id: 'all', label: 'All Transactions', count: orders.length },
    { id: 'Paid', label: 'Paid', count: orders.filter((o) => o.paymentStatus === 'Paid').length },
    { id: 'Pending', label: 'Pending', count: orders.filter((o) => o.paymentStatus === 'Pending').length },
    { id: 'Refunded', label: 'Refunded', count: orders.filter((o) => o.paymentStatus === 'Refunded').length },
  ];

  const filteredOrders = orders.filter((o) => activeTab === 'all' || o.paymentStatus === activeTab);

  const columns: Column<Order>[] = [
    {
      header: 'TRANSACTION',
      accessorKey: 'orderNumber',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-mono font-bold text-xs text-matrin-primary dark:text-blue-400">{row.orderNumber}</div>
          <div className="text-[10px] text-matrin-gray mt-0.5">{row.customerName}</div>
        </div>
      ),
    },
    {
      header: 'DATE',
      accessorKey: 'date',
      sortable: true,
      cell: (row) => <span className="text-xs text-matrin-gray dark:text-slate-400">{row.date}</span>,
    },
    {
      header: 'GROSS AMOUNT',
      accessorKey: 'totalAmount',
      sortable: true,
      cell: (row) => <span className="font-bold text-xs text-matrin-text dark:text-white">{formatCurrency(row.totalAmount)}</span>,
    },
    {
      header: 'PAYMENT STATUS',
      accessorKey: 'paymentStatus',
      sortable: true,
      cell: (row) => {
        const variants: Record<string, any> = { Paid: 'success', Pending: 'warning', Failed: 'danger', Refunded: 'neutral' };
        return <Badge variant={variants[row.paymentStatus] || 'neutral'} dot>{row.paymentStatus}</Badge>;
      },
    },
    {
      header: 'ACTION',
      cell: (row) =>
        row.paymentStatus === 'Paid' ? (
          <Button variant="outline" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={() => processRefund(row.id)}>
            Issue Refund
          </Button>
        ) : (
          <span className="text-xs text-matrin-gray">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          Finance & Payouts
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Track gross revenue, pending settlements, and refund liabilities across all orders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Net Revenue</div>
          <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-matrin-primary" /> {formatCurrency(netRevenue)}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Collected (Paid)</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> {formatCurrency(paidAmount)}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Pending Settlement</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1 flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> {formatCurrency(pendingAmount)}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Refunded</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" /> {formatCurrency(refundedAmount)}
          </div>
        </div>
      </div>

      <DataTable
        title="Transaction Ledger"
        data={filteredOrders}
        columns={columns}
        searchKey="orderNumber"
        searchPlaceholder="Search transactions by order number or customer..."
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        exportFilename="matrin_finance_ledger"
      />
    </div>
  );
};
