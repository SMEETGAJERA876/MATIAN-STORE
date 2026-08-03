import React, { useState, useMemo } from 'react';
import {
  Plus,
  Package,
  Barcode,
  Trash2,
  Download,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const ProductsView: React.FC = () => {
  const {
    products,
    deleteProduct,
    setAddProductModalOpen,
    addToast,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState('all');

  // Convert products store array to DataTable format
  const catalogData = useMemo(() => {
    return products.map((p) => {
      const stockVal = p.stock ?? 50;
      const isLow = stockVal <= 10;
      return {
        id: p.id,
        image: p.image || 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=300&auto=format&fit=crop&q=80',
        name: p.name,
        brandSub: p.brand || p.vendor || 'MATRIN Enterprise',
        category: p.category || 'General',
        sku: p.sku || `SKU-${p.id}`,
        price: p.price,
        stock: stockVal,
        stockPercentage: Math.min(100, Math.round((stockVal / 100) * 100)),
        status: p.visibility === 'Published' ? 'Active' : 'Draft',
        isLowStock: isLow,
      };
    });
  }, [products]);

  // Filter Data based on Active Tab
  const filteredData = useMemo(() => {
    if (activeTab === 'active') return catalogData.filter((p) => p.status === 'Active');
    if (activeTab === 'low_stock') return catalogData.filter((p) => p.isLowStock);
    if (activeTab === 'draft') return catalogData.filter((p) => p.status === 'Draft');
    return catalogData;
  }, [catalogData, activeTab]);

  const activeCount = useMemo(() => catalogData.filter((p) => p.status === 'Active').length, [catalogData]);
  const lowStockCount = useMemo(() => catalogData.filter((p) => p.isLowStock).length, [catalogData]);

  const filterTabs = [
    { id: 'all', label: `All Products (${catalogData.length})`, count: catalogData.length },
    { id: 'active', label: `Active (${activeCount})`, count: activeCount },
    { id: 'low_stock', label: `Low Stock (${lowStockCount})`, count: lowStockCount },
  ];

  const columns: Column<typeof catalogData[0]>[] = [
    {
      header: 'PRODUCT',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt={row.name}
            className="w-11 h-11 rounded-xl object-cover ring-1 ring-matrin-border dark:ring-matrin-darkborder bg-slate-100 dark:bg-slate-800 shrink-0"
          />
          <div>
            <div className="font-extrabold text-xs text-matrin-text dark:text-white line-clamp-1">
              {row.name}
            </div>
            <div className="text-[10px] text-matrin-gray dark:text-slate-400">
              {row.brandSub}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'CATEGORY',
      accessorKey: 'category',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-matrin-text dark:text-slate-200">
          {row.category}
        </span>
      ),
    },
    {
      header: 'SKU',
      accessorKey: 'sku',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-matrin-gray dark:text-slate-400">
          {row.sku}
        </span>
      ),
    },
    {
      header: 'PRICE',
      accessorKey: 'price',
      sortable: true,
      cell: (row) => (
        <span className="text-sm font-black text-matrin-text dark:text-white">
          {formatCurrency(row.price)}
        </span>
      ),
    },
    {
      header: 'STOCK',
      accessorKey: 'stock',
      sortable: true,
      cell: (row) => (
        <div className="w-32 space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className={row.isLowStock ? 'text-rose-600 font-extrabold' : 'text-matrin-text dark:text-white'}>
              {row.stock} units
            </span>
            <span className="text-slate-400">{row.stockPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${row.isLowStock ? 'bg-rose-500' : 'bg-matrin-secondary'}`}
              style={{ width: `${Math.max(5, row.stockPercentage)}%` }}
            />
          </div>
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
    {
      header: 'ACTIONS',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addToast('info', `SKU: ${row.sku}`)}
            className="p-1.5 text-slate-400 hover:text-matrin-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View Details"
          >
            <Barcode className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              deleteProduct(row.id);
              addToast('warning', `Deleted ${row.name}`);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Dynamic stock calculations
  const totalStockValue = useMemo(() => products.reduce((sum, p) => sum + (p.price * (p.stock || 1)), 0), [products]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Products Catalog
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Manage your product catalog, pricing, and live inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            onClick={() => addToast('success', 'Exported products catalog to CSV')}
          >
            Export
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAddProductModalOpen(true)}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Products Catalog"
        data={filteredData}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search product by title, SKU, or category..."
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        exportFilename="matrin_products_catalog"
      />

      {/* Bottom Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-matrin-primary dark:text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-matrin-gray dark:text-slate-400">Total Stock Value</div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white">{formatCurrency(totalStockValue)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-matrin-gray dark:text-slate-400">Unique SKUs</div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white">{products.length}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-matrin-gray dark:text-slate-400">Low Stock Alerts</div>
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{lowStockCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
