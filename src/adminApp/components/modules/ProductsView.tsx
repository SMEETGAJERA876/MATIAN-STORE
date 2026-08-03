import React, { useState, useMemo } from 'react';
import {
  Plus,
  Package,
  Barcode,
  Trash2,
  Download,
  TrendingUp,
  AlertTriangle,
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

  // Format product items for DataTable
  const catalogData = useMemo(() => {
    return products.map((p) => {
      const stockVal = Number(p.stock) || 0;
      const isLow = stockVal > 0 && stockVal <= 10;
      const isOut = stockVal === 0;
      const pct = Math.min(100, Math.max(0, Math.round((stockVal / 500) * 100)));

      return {
        id: p.id,
        image: p.image || 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=300&auto=format&fit=crop&q=80',
        name: p.name,
        brandSub: p.brand || 'MATRIN Enterprise',
        category: p.category || 'General',
        sku: p.sku || `MTR-${p.id}`,
        price: p.price,
        stock: stockVal,
        stockPercentage: pct,
        status: isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Active',
        isLowStock: isLow || isOut,
      };
    });
  }, [products]);

  // Filter items based on selected tab
  const filteredData = useMemo(() => {
    if (activeTab === 'in_stock') {
      return catalogData.filter((item) => item.status === 'Active');
    }
    if (activeTab === 'low_stock') {
      return catalogData.filter((item) => item.status === 'Low Stock');
    }
    if (activeTab === 'out_of_stock') {
      return catalogData.filter((item) => item.status === 'Out of Stock');
    }
    return catalogData;
  }, [catalogData, activeTab]);

  const filterTabs = [
    { id: 'all', label: `All Products (${catalogData.length})`, count: catalogData.length },
    { id: 'in_stock', label: `In Stock (${catalogData.filter(p => p.status === 'Active').length})`, count: catalogData.filter(p => p.status === 'Active').length },
    { id: 'low_stock', label: `Low Stock (${catalogData.filter(p => p.status === 'Low Stock').length})`, count: catalogData.filter(p => p.status === 'Low Stock').length },
    { id: 'out_of_stock', label: `Out of Stock (${catalogData.filter(p => p.status === 'Out of Stock').length})`, count: catalogData.filter(p => p.status === 'Out of Stock').length },
  ];

  // Dynamic calculations for bottom metric cards
  const totalStockValue = useMemo(() => {
    return products.reduce((acc, p) => acc + p.price * (p.stock || 0), 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => (p.stock || 0) <= 10).length;
  }, [products]);

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
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-matrin-border"
          />
          <div>
            <div className="font-extrabold text-xs text-matrin-text dark:text-white">
              {row.name}
            </div>
            <div className="text-[10px] text-matrin-gray">
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
        <span className="font-mono text-xs font-bold text-matrin-gray">
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
              style={{ width: `${row.stockPercentage}%` }}
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
        <Badge variant={row.status === 'Active' ? 'success' : row.status === 'Low Stock' ? 'warning' : 'neutral'} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'ACTIONS',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToast('info', `SKU Code: ${row.sku}`)}
            title="View Barcode / SKU"
            className="p-1.5 text-slate-400 hover:text-matrin-primary rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Barcode className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteProduct(row.id)}
            title="Delete Product"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Products Catalog
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Manage your live MATRIN cleaning product inventory, pricing, and stock status.
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
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-matrin-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-matrin-gray">Total Stock Value</div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white">{formatCurrency(totalStockValue)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-matrin-gray">Unique SKUs</div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white">{products.length}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-matrin-gray">Low Stock Alerts</div>
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{lowStockCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
