import React, { useState } from 'react';
import { Package, Plus, Minus, Warehouse, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';

export const StockAdjustmentModal: React.FC = () => {
  const {
    isStockAdjustmentModalOpen,
    setStockAdjustmentModalOpen,
    products,
    adjustProductStockByName,
    addToast,
  } = useAdminStore();

  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(50);
  const [warehouse, setWarehouse] = useState<string>('San Jose Logistics Hub');
  const [reason, setReason] = useState<string>('Purchase Order Restock');

  const selectedProduct = products.find((p) => p.id === selectedProdId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      addToast('error', 'Please select a valid product');
      return;
    }

    if (quantity === 0) {
      addToast('error', 'Stock quantity change must be non-zero');
      return;
    }

    adjustProductStockByName(selectedProduct.id, Number(quantity), warehouse, reason);
    setStockAdjustmentModalOpen(false);
  };

  return (
    <Modal
      isOpen={isStockAdjustmentModalOpen}
      onClose={() => setStockAdjustmentModalOpen(false)}
      title="Add / Adjust Product Stock by Name"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Selector */}
        <div>
          <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1.5">
            Select Product by Name
          </label>
          <select
            value={selectedProdId}
            onChange={(e) => setSelectedProdId(e.target.value)}
            className="w-full px-4 py-2.5 text-sm font-semibold bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — Current Stock: {p.stock}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Product Quick Card Preview */}
        {selectedProduct && (
          <div className="p-4 bg-matrin-bg/60 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-matrin-border"
              />
              <div>
                <div className="font-extrabold text-xs text-matrin-text dark:text-white">
                  {selectedProduct.name}
                </div>
                <div className="text-[11px] font-mono text-matrin-primary dark:text-blue-400 mt-0.5">
                  SKU: {selectedProduct.sku} • {selectedProduct.category}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-matrin-gray">Current Stock</div>
              <div className="text-lg font-black text-matrin-text dark:text-white">
                {selectedProduct.stock} units
              </div>
            </div>
          </div>
        )}

        {/* Quantity Adjustment Row */}
        <div>
          <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1.5">
            Stock Quantity to Add (Use negative number to deduct)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => q - 10)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              type="number"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="flex-1 px-4 py-2 text-center text-base font-extrabold bg-white dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />

            <button
              type="button"
              onClick={() => setQuantity((q) => q + 10)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[11px] text-matrin-gray mt-1">
            New Projected Stock Level:{' '}
            <strong className="text-matrin-primary dark:text-blue-400">
              {Math.max(0, (selectedProduct?.stock || 0) + quantity)} units
            </strong>
          </div>
        </div>

        {/* Target Warehouse */}
        <div>
          <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1.5">
            Target Warehouse Hub
          </label>
          <select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
          >
            <option>San Jose Logistics Hub</option>
            <option>Austin Distribution Facility</option>
            <option>Chicago Regional Hub</option>
          </select>
        </div>

        {/* Adjustment Reason */}
        <div>
          <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1.5">
            Adjustment Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
          >
            <option>Purchase Order Restock</option>
            <option>Supplier Shipment Received</option>
            <option>Inventory Audit Correction</option>
            <option>Customer Return Restock</option>
            <option>Damage Write-off (-)</option>
          </select>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-matrin-border dark:border-matrin-darkborder">
          <Button
            variant="outline"
            type="button"
            onClick={() => setStockAdjustmentModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Update Product Stock
          </Button>
        </div>
      </form>
    </Modal>
  );
};
