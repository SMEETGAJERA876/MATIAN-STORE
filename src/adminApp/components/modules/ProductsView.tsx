import React, { useState } from 'react';
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
import { Modal } from '../ui/Modal';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { Product } from '../../types';
import { formatCurrency, generateSKU, generateBarcode } from '../../utils/formatters';

export const ProductsView: React.FC = () => {
  const {
    products,
    addProduct,
    deleteProduct,
    bulkDeleteProducts,
    isAddProductModalOpen,
    setAddProductModalOpen,
    addToast,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState('all');

  const catalogData = [
    {
      id: 'p-1',
      image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&auto=format&fit=crop&q=80',
      name: 'Liquid Detergent 5L',
      brandSub: 'MATRIN Professional',
      category: 'Fabric Care',
      sku: 'MTRN-DET-502',
      price: 24.99,
      stock: 840,
      stockPercentage: 84,
      status: 'Active',
    },
    {
      id: 'p-2',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      name: 'Eco-Glass Cleaner',
      brandSub: 'MATRIN Home',
      category: 'Surface Care',
      sku: 'MTRN-GLS-101',
      price: 12.50,
      stock: 42,
      stockPercentage: 15,
      status: 'Active',
      isLowStock: true,
    },
    {
      id: 'p-3',
      image: 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=300&auto=format&fit=crop&q=80',
      name: 'Bio-Sponge Set',
      brandSub: 'MATRIN Eco',
      category: 'Utensils',
      sku: 'MTRN-SPN-221',
      price: 8.99,
      stock: 0,
      stockPercentage: 0,
      status: 'Draft',
    },
    {
      id: 'p-4',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&auto=format&fit=crop&q=80',
      name: 'Surface Sanitizer',
      brandSub: 'MATRIN Professional',
      category: 'Surface Care',
      sku: 'MTRN-SAN-904',
      price: 34.00,
      stock: 1200,
      stockPercentage: 100,
      status: 'Active',
    },
  ];

  const filterTabs = [
    { id: 'all', label: 'All Products (128)', count: 128 },
    { id: 'active', label: 'Active (112)', count: 112 },
    { id: 'draft', label: 'Draft (12)', count: 12 },
    { id: 'archived', label: 'Archived (4)', count: 4 },
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
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'ACTIONS',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToast('info', `Editing ${row.name}`)}
            className="p-1.5 text-slate-400 hover:text-matrin-primary rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Barcode className="w-4 h-4" />
          </button>
          <button
            onClick={() => addToast('warning', `Deleted ${row.name}`)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
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
            Products
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Manage your product catalog, pricing, and stock levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            onClick={() => addToast('success', 'Exported products catalog')}
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

      {/* Main DataTable (Matching Reference Image 3) */}
      <DataTable
        title="Products Catalog"
        data={catalogData}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search product by title, SKU, or category..."
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        exportFilename="matrin_products_catalog"
      />

      {/* Bottom Metrics Cards Row (Matching Reference Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-matrin-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-matrin-gray">Total Stock Value</div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white">$42,390.00</div>
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-matrin-gray">Unique SKUs</div>
            <div className="text-xl font-extrabold text-matrin-text dark:text-white">128</div>
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-matrin-gray">Low Stock Alerts</div>
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">12</div>
          </div>
        </div>
      </div>
    </div>
  );
};
