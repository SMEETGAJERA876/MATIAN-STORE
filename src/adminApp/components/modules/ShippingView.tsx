import React, { useState } from 'react';
import { Truck, MapPin, Package, Edit3 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DataTable, Column } from '../ui/DataTable';
import { Tooltip } from '../ui/Tooltip';
import { useAdminStore } from '../../store/adminStore';
import { Order } from '../../types';

const couriers = ['FedEx Express', 'UPS Ground', 'DHL Express', 'USPS Priority'];

export const ShippingView: React.FC = () => {
  const { orders, updateShippingInfo } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [courier, setCourier] = useState('');
  const [tracking, setTracking] = useState('');
  const [status, setStatus] = useState<Order['shippingStatus']>('Processing');

  const filterTabs = [
    { id: 'all', label: 'All Shipments', count: orders.length },
    { id: 'Processing', label: 'Processing', count: orders.filter((o) => o.shippingStatus === 'Processing').length },
    { id: 'In Transit', label: 'In Transit', count: orders.filter((o) => o.shippingStatus === 'In Transit').length },
    { id: 'Delivered', label: 'Delivered', count: orders.filter((o) => o.shippingStatus === 'Delivered').length },
  ];

  const filteredOrders = orders.filter((o) => activeTab === 'all' || o.shippingStatus === activeTab);

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setCourier(order.courier || couriers[0]);
    setTracking(order.trackingNumber || '');
    setStatus(order.shippingStatus);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateShippingInfo(editingOrder.id, { courier, trackingNumber: tracking, shippingStatus: status });
    setEditingOrder(null);
  };

  const inTransitCount = orders.filter((o) => o.shippingStatus === 'In Transit').length;
  const deliveredCount = orders.filter((o) => o.shippingStatus === 'Delivered').length;

  const columns: Column<Order>[] = [
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
      header: 'DESTINATION',
      accessorKey: 'shippingAddress',
      cell: (row) => (
        <span className="flex items-center gap-1.5 text-xs text-matrin-gray dark:text-slate-400 max-w-xs truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" /> {row.shippingAddress}
        </span>
      ),
    },
    {
      header: 'COURIER',
      accessorKey: 'courier',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1.5 text-xs font-bold text-matrin-text dark:text-white">
          <Truck className="w-3.5 h-3.5 text-matrin-gray" /> {row.courier || '—'}
        </span>
      ),
    },
    {
      header: 'TRACKING #',
      accessorKey: 'trackingNumber',
      cell: (row) => <span className="font-mono text-xs text-matrin-gray dark:text-slate-400">{row.trackingNumber || '—'}</span>,
    },
    {
      header: 'STATUS',
      accessorKey: 'shippingStatus',
      sortable: true,
      cell: (row) => {
        const variants: Record<string, any> = {
          Delivered: 'success',
          'In Transit': 'info',
          Processing: 'warning',
          Cancelled: 'danger',
          Returned: 'neutral',
        };
        return <Badge variant={variants[row.shippingStatus] || 'neutral'} dot>{row.shippingStatus}</Badge>;
      },
    },
    {
      header: 'ACTIONS',
      cell: (row) => (
        <Tooltip label="Update Shipment">
          <button
            onClick={() => openEdit(row)}
            className="p-2 text-matrin-gray hover:text-matrin-primary dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          Shipping & Courier Dispatch
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Assign couriers, update tracking numbers, and monitor delivery progress for every order.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Total Shipments</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1 flex items-center gap-2">
            <Package className="w-6 h-6 text-matrin-primary" /> {orders.length}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">In Transit</div>
          <div className="text-3xl font-extrabold text-matrin-primary dark:text-blue-400 mt-1">{inTransitCount}</div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Delivered</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">{deliveredCount}</div>
        </div>
      </div>

      <DataTable
        title="Shipment Tracking"
        data={filteredOrders}
        columns={columns}
        searchKey="orderNumber"
        searchPlaceholder="Search by order number, customer, or tracking..."
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        exportFilename="matrin_shipments"
      />

      <Modal isOpen={!!editingOrder} onClose={() => setEditingOrder(null)} title={`Update Shipment — ${editingOrder?.orderNumber}`} maxWidth="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Courier</label>
            <select
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            >
              {couriers.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Tracking Number</label>
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Shipping Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Order['shippingStatus'])}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            >
              <option>Processing</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Cancelled</option>
              <option>Returned</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-matrin-border dark:border-matrin-darkborder">
            <Button variant="outline" type="button" onClick={() => setEditingOrder(null)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Shipment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
