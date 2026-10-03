import React, { useMemo, useState } from 'react';
import { Warehouse as WarehouseIcon, Boxes, AlertTriangle, Plus, Trash2, Clock, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { Product } from '../../types';

const REORDER_THRESHOLD = 10;

export const WarehouseView: React.FC = () => {
  const {
    products,
    warehouses,
    addWarehouse,
    deleteWarehouse,
    stockLogs,
    cancelStockLog,
    setSelectedProductId,
    setStockAdjustmentModalOpen,
  } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');
  const [isAddWarehouseOpen, setAddWarehouseOpen] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState('');

  const openRestock = (product: Product) => {
    setSelectedProductId(product.id);
    setStockAdjustmentModalOpen(true);
  };

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    addWarehouse(newWarehouseName);
    setNewWarehouseName('');
    setAddWarehouseOpen(false);
  };

  // Derived directly from the live product catalog so every restock is reflected immediately —
  // a separate warehouse/inventory ledger would drift out of sync with actual product stock.
  // Every admin-created warehouse gets a card even before any stock is assigned to it.
  const warehouseGroups = useMemo(() => {
    const map = new Map<string, Product[]>();
    warehouses.forEach((w) => map.set(w, []));
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
  }, [products, warehouses]);

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
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<WarehouseIcon className="w-4 h-4" />}
            onClick={() => setAddWarehouseOpen(true)}
          >
            Add Warehouse
          </Button>
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
              <div className="flex flex-col items-end gap-2">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-matrin-primary dark:text-blue-400">
                  <WarehouseIcon className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => deleteWarehouse(g.warehouse)}
                  title={g.skuCount > 0 ? 'Move or clear its products before deleting' : 'Delete warehouse'}
                  className="p-1.5 rounded-lg text-matrin-gray hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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

      {/* Recent Stock Movements — lets an admin cancel/undo a specific adjustment */}
      <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-3xl shadow-card p-5">
        <h3 className="text-sm font-bold text-matrin-text dark:text-white flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-matrin-secondary" />
          <span>Recent Stock Movements</span>
        </h3>

        {stockLogs.length === 0 ? (
          <p className="text-xs text-matrin-gray dark:text-slate-400">No stock movements recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {stockLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-matrin-bg/60 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder rounded-2xl"
              >
                <div>
                  <div className="text-xs font-bold text-matrin-text dark:text-white">{log.productName}</div>
                  <div className="text-[10px] text-matrin-gray mt-0.5">
                    {log.warehouse} • {log.reason} • {log.timestamp}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-black text-xs px-2.5 py-1 rounded-full ${
                      log.quantityChange >= 0
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                    }`}
                  >
                    {log.quantityChange >= 0 ? `+${log.quantityChange}` : log.quantityChange}
                  </span>
                  <button
                    type="button"
                    onClick={() => cancelStockLog(log.id)}
                    title="Cancel this stock change"
                    className="flex items-center gap-1 text-[11px] font-semibold text-matrin-gray hover:text-rose-600 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Warehouse Modal */}
      <Modal
        isOpen={isAddWarehouseOpen}
        onClose={() => setAddWarehouseOpen(false)}
        title="Add New Warehouse"
        maxWidth="sm"
      >
        <form onSubmit={handleAddWarehouse} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1.5">
              Warehouse Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={newWarehouseName}
              onChange={(e) => setNewWarehouseName(e.target.value)}
              placeholder="e.g. Pune Distribution Hub"
              className="w-full px-4 py-2.5 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-matrin-border dark:border-matrin-darkborder">
            <Button variant="outline" type="button" onClick={() => setAddWarehouseOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Warehouse
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
