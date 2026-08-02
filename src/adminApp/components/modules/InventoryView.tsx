import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  ArrowRightLeft,
  Warehouse,
  Plus,
  RefreshCcw,
  Sparkles,
  ArrowUpRight,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency } from '../../utils/formatters';

const inventoryChartData = [
  { month: 'Jan', stock: 32000 },
  { month: 'Feb', stock: 24000 },
  { month: 'Mar', stock: 41000 },
  { month: 'Apr', stock: 35000 },
  { month: 'May', stock: 48000 },
];

export const InventoryView: React.FC = () => {
  const { products, setStockAdjustmentModalOpen, stockLogs, addToast } = useAdminStore();
  const [chartMode, setChartMode] = useState<'Monthly' | 'Weekly'>('Monthly');

  const columns: Column<typeof products[0]>[] = [
    {
      header: 'PRODUCT DETAILS',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={row.name} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <div className="font-extrabold text-xs text-matrin-text dark:text-white">{row.name}</div>
            <div className="text-[10px] text-matrin-gray">{row.category}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'SKU',
      accessorKey: 'sku',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-matrin-primary dark:text-blue-400">
          {row.sku}
        </span>
      ),
    },
    {
      header: 'WAREHOUSE',
      accessorKey: 'warehouse',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-medium text-matrin-gray dark:text-slate-400">{row.warehouse}</span>
      ),
    },
    {
      header: 'CURRENT STOCK',
      accessorKey: 'stock',
      sortable: true,
      cell: (row) => (
        <span className={`font-black text-sm ${row.stock <= 5 ? 'text-rose-600' : 'text-matrin-text dark:text-white'}`}>
          {row.stock.toLocaleString()} units
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <Badge variant={row.stock <= 5 ? 'danger' : 'success'} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'STOCK MANAGEMENT',
      cell: (row) => (
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setStockAdjustmentModalOpen(true)}
        >
          Add Stock
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Add Stock Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Inventory Dynamics & Stock Control
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Manage product stock by name, monitor warehouse allocation, and track depletion logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setStockAdjustmentModalOpen(true)}
            className="shadow-glow"
          >
            Add Stock by Product Name
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-matrin-gray">Global Value</div>
              <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">$2,482,900.00</div>
              <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +4.2% from last month
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-matrin-gray">CENTRAL HUB (CH-01)</div>
              <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">45,210</div>
              <div className="text-xs text-matrin-gray font-medium mt-1">88% Capacity Used</div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-matrin-primary">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-matrin-primary rounded-full" style={{ width: '88%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-matrin-gray">WEST COAST (WC-02)</div>
              <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">12,840</div>
              <div className="text-xs text-matrin-gray font-medium mt-1">42% Capacity Used</div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-matrin-secondary">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-matrin-secondary rounded-full" style={{ width: '42%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-matrin-gray">IN-TRANSIT ITEMS</div>
              <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">2,105</div>
              <div className="text-xs text-matrin-gray font-medium mt-1">12 Active Shipments</div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex gap-1.5 mt-3">
            <span className="text-[10px] font-extrabold bg-matrin-primary text-white px-2 py-0.5 rounded-full">3 Express</span>
            <span className="text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">9 Standard</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-matrin-text dark:text-white">Inventory Dynamics</h3>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setChartMode('Monthly')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chartMode === 'Monthly' ? 'bg-matrin-primary text-white' : 'text-slate-500'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setChartMode('Weekly')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chartMode === 'Weekly' ? 'bg-matrin-primary text-white' : 'text-slate-500'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryChartData}>
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#0B3A75" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <DataTable
            title="Live Stock Inventory by Product Name"
            data={products}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search products by name, SKU, or category..."
            exportFilename="matrin_inventory_by_product_name"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Operations Card */}
          <div className="bg-matrin-primary text-white rounded-3xl p-6 shadow-elevated space-y-4">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-matrin-secondary" />
              <span>Stock Operations</span>
            </div>

            <Button
              variant="secondary"
              className="w-full py-3 text-xs font-bold shadow-glow"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setStockAdjustmentModalOpen(true)}
            >
              Add Product Stock by Name
            </Button>
          </div>

          {/* Stock Movement Logs */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-matrin-text dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-matrin-secondary" />
                <span>Recent Stock Movements</span>
              </h3>
            </div>

            <div className="space-y-3">
              {stockLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-matrin-bg/60 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-matrin-text dark:text-white">
                      {log.productName}
                    </div>
                    <div className="text-[10px] text-matrin-gray mt-0.5">
                      {log.reason} • {log.timestamp}
                    </div>
                  </div>
                  <span
                    className={`font-black text-xs px-2.5 py-1 rounded-full ${
                      log.quantityChange >= 0
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                    }`}
                  >
                    {log.quantityChange >= 0 ? `+${log.quantityChange}` : log.quantityChange}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
