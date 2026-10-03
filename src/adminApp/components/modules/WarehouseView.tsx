import React, { useMemo, useState } from 'react';
import { Warehouse as WarehouseIcon, Boxes, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { Product } from '../../types';

const REORDER_THRESHOLD = 10;

export const WarehouseView: React.FC = () => {
  const { products, setSelectedProductId, setStockAdjustmentModalOpen } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');

  const openRestock = (product: Product) => {
    setSelectedProductId(product.id);
    setStockAdjustmentModalOpen(true);
  };

  // Derived directly from the live product catalog so every restock is reflected immediately —
  // a separate warehouse/inventory ledger would drift out of sync with actual product stock.
  const warehouseGroups = useMemo(() => {
    const map = new Map<string, Product[]>();
    products.forEach((p) => {
      const list = map.get(p.warehouse) || [];
      list.push(p);
      map.set(p.warehouse, list);
    });
    return Array.from(map.entries()).map(([warehouse, items]) => {
      const totalStock = items.reduce((sum, i) => sum + i.stock, 0);
      const critical = items.filter((i) => i.status !== 'In Stock').length;
      return { warehouse, items, totalStock, critical, skuCount: items.length };
    });
  }, [products]);

  const totalCritical = products.filter((p) => p.status !== 'In Stock').length;
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const filterTabs = [
    { id: 'all', label: 'All', count: products.length },
    { id: 'In Stock', label: 'In Stock', count: products.filter((p) => p.status === 'In Stock').length },
    { id: 'Low Stock', label: 'Low Stock', count: products.filter((p) => p.status === 'Low Stock').length },
    { id: 'Out of Stock', label: 'Out of Stock', count: products.filter((p) => p.status === 'Out of Stock').length },
  ];

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return products;
    return products.filter((p) => p.status === activeTab);
  }, [products, activeTab]);

  const columns: Column<Product>[] = [
    {
      header: 'SKU / ITEM',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-extrabold text-xs text-matrin-text dark:text-white">{row.name}</div>
          <div className="font-mono text-[10px] text-matrin-gray">{row.sku}</div>
        </div>
      ),
    },
    {
      header: 'WAREHOUSE',
      accessorKey: 'warehouse',
      sortable: true,
      cell: (row) => <span className="text-xs font-medium text-matrin-gray dark:text-slate-400">{row.warehouse}</span>,
    },
    {
      header: 'STOCK',
      accessorKey: 'stock',
      sortable: true,
      cell: (row) => (
        <span className={`font-black text-sm ${row.stock <= REORDER_THRESHOLD ? 'text-rose-600' : 'text-matrin-text dark:text-white'}`}>
          {row.stock.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'REORDER TRIGGER',
      cell: () => <span className="text-xs text-matrin-gray dark:text-slate-400">{REORDER_THRESHOLD} units</span>,
    },
    {
      header: 'STATUS',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => {
        const variants: Record<string, 'success' | 'warning' | 'danger'> = {
          'In Stock': 'success',
          'Low Stock': 'warning',
          'Out of Stock': 'danger',
        };
        return <Badge variant={variants[row.status] || 'neutral'} dot>{row.status}</Badge>;
      },
    },
    {
      header: 'ACTION',
      cell: (row) => (
        <Button variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => openRestock(row)}>
          Restock
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Warehouse Map & Stock Rules
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Monitor bin-level stock across facilities and trigger reorders before shortages occur.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedProductId(null);
            setStockAdjustmentModalOpen(true);
          }}
        >
          Add Stock by Product Name
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Warehouse Facilities</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1 flex items-center gap-2">
            <WarehouseIcon className="w-6 h-6 text-matrin-primary" /> {warehouseGroups.length}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Total Units Stored</div>
          <div className="text-3xl font-extrabold text-matrin-primary dark:text-blue-400 mt-1 flex items-center gap-2">
            <Boxes className="w-6 h-6" /> {totalUnits.toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Critical Reorder Alerts</div>
          <div className="text-3xl font-extrabold text-rose-600 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" /> {totalCritical}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouseGroups.map((g) => (
          <div key={g.warehouse} className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">{g.warehouse}</div>
                <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">{g.totalStock.toLocaleString()}</div>
                <div className="text-xs text-matrin-gray mt-1">{g.skuCount} SKUs tracked</div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-matrin-primary dark:text-blue-400">
                <WarehouseIcon className="w-5 h-5" />
              </div>
            </div>
            {g.critical > 0 && (
              <div className="mt-3 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> {g.critical} item(s) below reorder threshold
              </div>
            )}
          </div>
        ))}
      </div>

      <DataTable
        title="Warehouse Stock Ledger"
        data={filteredProducts}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search by item name, SKU, or warehouse..."
        exportFilename="matrin_warehouse_stock"
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};
