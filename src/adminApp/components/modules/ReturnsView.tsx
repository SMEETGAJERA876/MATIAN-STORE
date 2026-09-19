import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, DollarSign } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DataTable, Column } from '../ui/DataTable';
import { EmptyState } from '../ui/EmptyState';
import { useAdminStore } from '../../store/adminStore';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const ReturnsView: React.FC = () => {
  const { orders, updateShippingInfo, processRefund, addToast } = useAdminStore();

  // Returns/RMA workflow is driven directly off order shipping & payment status
  const returnableOrders = orders.filter(
    (o) => o.shippingStatus !== 'Returned' && o.shippingStatus !== 'Cancelled' && o.paymentStatus !== 'Refunded'
  );
  const returnedOrders = orders.filter((o) => o.shippingStatus === 'Returned');
  const refundedOrders = orders.filter((o) => o.paymentStatus === 'Refunded');

  const [tab, setTab] = useState<'active' | 'processed'>('active');

  const initiateReturn = (order: Order) => {
    updateShippingInfo(order.id, { shippingStatus: 'Returned' });
    addToast('info', `Return initiated for order ${order.orderNumber}`);
  };

  const columnsActive: Column<Order>[] = [
    {
      header: 'ORDER',
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
      header: 'AMOUNT',
      accessorKey: 'totalAmount',
      sortable: true,
      cell: (row) => <span className="font-bold text-xs text-matrin-text dark:text-white">{formatCurrency(row.totalAmount)}</span>,
    },
    {
      header: 'SHIPPING STATUS',
      accessorKey: 'shippingStatus',
      sortable: true,
      cell: (row) => <Badge variant="info">{row.shippingStatus}</Badge>,
    },
    {
      header: 'ACTIONS',
      cell: (row) => (
        <Button variant="outline" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={() => initiateReturn(row)}>
          Initiate Return
        </Button>
      ),
    },
  ];

  const columnsReturned: Column<Order>[] = [
    {
      header: 'ORDER',
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
      header: 'AMOUNT',
      accessorKey: 'totalAmount',
      sortable: true,
      cell: (row) => <span className="font-bold text-xs text-matrin-text dark:text-white">{formatCurrency(row.totalAmount)}</span>,
    },
    {
      header: 'PAYMENT STATUS',
      accessorKey: 'paymentStatus',
      sortable: true,
      cell: (row) => (
        <Badge variant={row.paymentStatus === 'Refunded' ? 'success' : 'warning'} dot>
          {row.paymentStatus}
        </Badge>
      ),
    },
    {
      header: 'ACTIONS',
      cell: (row) =>
        row.paymentStatus === 'Refunded' ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="w-4 h-4" /> Refund Complete
          </span>
        ) : (
          <Button variant="secondary" size="sm" icon={<DollarSign className="w-3.5 h-3.5" />} onClick={() => processRefund(row.id)}>
            Process Refund
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          Returns & RMA Management
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Initiate customer returns, inspect RMA workflows, and issue refunds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Eligible Orders</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">{returnableOrders.length}</div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Returned Items</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{returnedOrders.length}</div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Refunds Issued</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">{refundedOrders.length}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-3xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-matrin-border dark:border-matrin-darkborder flex items-center gap-1">
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              tab === 'active' ? 'bg-matrin-primary text-white shadow-soft' : 'text-matrin-gray dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Eligible for Return
          </button>
          <button
            onClick={() => setTab('processed')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              tab === 'processed' ? 'bg-matrin-primary text-white shadow-soft' : 'text-matrin-gray dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Returned & Refund Queue
          </button>
        </div>

        <div className="p-4">
          {tab === 'active' ? (
            returnableOrders.length === 0 ? (
              <EmptyState title="No Eligible Orders" description="All orders are either delivered without return requests, already returned, or refunded." icon={<RotateCcw className="w-8 h-8" />} />
            ) : (
              <SimpleTable columns={columnsActive} data={returnableOrders} />
            )
          ) : returnedOrders.length === 0 ? (
            <EmptyState title="No Returns Yet" description="Returned orders awaiting refund will appear here." icon={<DollarSign className="w-8 h-8" />} />
          ) : (
            <SimpleTable columns={columnsReturned} data={returnedOrders} />
          )}
        </div>
      </div>
    </div>
  );
};

function SimpleTable<T extends { id: string }>({ columns, data }: { columns: Column<T>[]; data: T[] }) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-matrin-border dark:border-matrin-darkborder text-xs font-semibold text-matrin-gray uppercase tracking-wider">
          {columns.map((col, idx) => (
            <th key={idx} className="p-4">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-matrin-border dark:divide-matrin-darkborder text-sm">
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-matrin-bg/60 dark:hover:bg-slate-800/50 transition-colors">
            {columns.map((col, cIdx) => (
              <td key={cIdx} className="p-4 text-matrin-text dark:text-matrin-darktext font-medium">
                {col.cell ? col.cell(row) : col.accessorKey ? (row as any)[col.accessorKey] : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
