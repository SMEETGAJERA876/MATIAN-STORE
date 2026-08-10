import React, { useState } from 'react';
import {
  ShoppingCart,
  FileText,
  CheckCircle,
  Clock,
  Printer,
  Calendar,
  Search,
  Download,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const OrdersView: React.FC = () => {
  const { orders, setSelectedOrderId, addToast } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');

  const defaultMockOrders = [
    {
      id: 'ord-101',
      orderNumber: '#INV-2026-8842',
      date: 'Nov 28, 14:22',
      customerName: 'Rahul Patel',
      customerInitials: 'RP',
      customerEmail: 'rahul@example.com',
      paymentStatus: 'PAID',
      fulfillment: 'PROCESSING',
      totalAmount: 1240.00,
    },
    {
      id: 'ord-102',
      orderNumber: '#INV-2026-8841',
      date: 'Nov 28, 11:05',
      customerName: 'Smeet Gajera',
      customerInitials: 'SG',
      customerEmail: 'smeet@example.com',
      paymentStatus: 'PAID',
      fulfillment: 'FULFILLED',
      totalAmount: 845.50,
    },
  ];

  const mappedOrders = (orders && orders.length > 0)
    ? orders.map((o) => {
        const name = o.customerName || 'Customer';
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        return {
          id: o.id,
          orderNumber: o.orderNumber || `#${o.id}`,
          date: o.date || 'Today',
          customerName: name,
          customerInitials: initials || 'C',
          customerEmail: o.customerEmail || 'N/A',
          paymentStatus: (o.paymentStatus || 'PAID').toUpperCase(),
          fulfillment: (o.shippingStatus || 'PROCESSING').toUpperCase(),
          totalAmount: o.totalAmount || 0,
        };
      })
    : defaultMockOrders;

  const ordersData = mappedOrders;

  const filterTabs = [
    { id: 'all', label: 'All', count: ordersData.length },
    { id: 'unfulfilled', label: 'Unfulfilled', count: ordersData.filter(o => o.fulfillment !== 'FULFILLED').length },
    { id: 'unpaid', label: 'Unpaid', count: ordersData.filter(o => o.paymentStatus !== 'PAID').length },
  ];

  const columns: Column<typeof ordersData[0]>[] = [
    {
      header: 'ORDER ID',
      accessorKey: 'orderNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-extrabold text-xs text-matrin-primary dark:text-blue-400">
          {row.orderNumber}
        </span>
      ),
    },
    {
      header: 'DATE',
      accessorKey: 'date',
      sortable: true,
      cell: (row) => (
        <span className="text-xs text-matrin-gray font-medium">{row.date}</span>
      ),
    },
    {
      header: 'CUSTOMER',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-matrin-primary font-bold text-xs flex items-center justify-center">
            {row.customerInitials}
          </div>
          <span className="font-bold text-xs text-matrin-text dark:text-white">
            {row.customerName}
          </span>
        </div>
      ),
    },
    {
      header: 'PAYMENT STATUS',
      accessorKey: 'paymentStatus',
      sortable: true,
      cell: (row) => (
        <Badge variant={row.paymentStatus === 'PAID' ? 'success' : 'warning'} size="sm">
          {row.paymentStatus}
        </Badge>
      ),
    },
    {
      header: 'FULFILLMENT',
      accessorKey: 'fulfillment',
      sortable: true,
      cell: (row) => {
        const variants: Record<string, any> = {
          FULFILLED: 'info',
          UNFULFILLED: 'warning',
          RESTOCKED: 'danger',
        };
        return <Badge variant={variants[row.fulfillment] || 'neutral'} size="sm">{row.fulfillment}</Badge>;
      },
    },
    {
      header: 'TOTAL',
      accessorKey: 'totalAmount',
      sortable: true,
      cell: (row) => (
        <span className="text-sm font-black text-matrin-text dark:text-white">
          {formatCurrency(row.totalAmount)}
        </span>
      ),
    },
    {
      header: 'INVOICE',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrderId('ord-1');
          }}
        >
          Print Invoice
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Orders
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Manage, track, and fulfill your customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            onClick={() => addToast('success', 'Exporting orders to CSV')}
          >
            Export
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => addToast('info', 'Create Order Modal')}
          >
            Create Order
          </Button>
        </div>
      </div>

      {/* Main Orders DataTable (Matching Reference Image 2) */}
      <DataTable
        title="Orders Directory"
        data={ordersData}
        columns={columns}
        searchKey="orderNumber"
        searchPlaceholder="Filter orders by customer, SKU, or order ID..."
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        onRowClick={() => setSelectedOrderId('ord-1')}
        exportFilename="matrin_orders_fulfillment"
      />

      {/* Bottom Metrics Stack (Matching Reference Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Volume Bar Card */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold text-matrin-text dark:text-white">Order Volume</div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>

          <div className="flex items-end gap-2 h-20 pt-4">
            {[40, 65, 50, 80, 70, 90].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-matrin-primary rounded-t-lg transition-all"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Avg Fulfillment Time */}
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold text-matrin-text dark:text-white">Avg. Fulfillment Time</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-2 flex items-baseline gap-2">
            1.4 days <span className="text-xs font-bold text-slate-400">(-0.2d)</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-matrin-secondary rounded-full" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Quick Help Dark Blue Card */}
        <div className="bg-matrin-primary text-white rounded-3xl p-6 shadow-elevated flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Quick Help</div>
            <h4 className="text-sm font-bold mt-1">Streamline your shipping today.</h4>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              Learn how to automate bulk fulfillment with Matrin Shipping.
            </p>
          </div>
          <div className="pt-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-matrin-primary hover:bg-slate-100 border-none font-bold text-xs"
              onClick={() => addToast('info', 'Opening Shipping Docs')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
