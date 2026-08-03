import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';
import { Package, DollarSign, Tag, Layers, Sparkles } from 'lucide-react';

export const AddProductModal: React.FC = () => {
  const { isAddProductModalOpen, setAddProductModalOpen, addProduct, addToast } = useAdminStore();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Fabric Care');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('error', 'Product name is required');
      return;
    }

    const priceNum = parseFloat(price) || 299;
    const stockNum = parseInt(stock, 10) || 50;

    addProduct({
      name: name.trim(),
      sku: sku.trim() || `MTR-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
      category,
      brand: 'MATRIN Enterprise',
      price: priceNum,
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      gst: 18,
      stock: stockNum,
      reservedStock: 0,
      warehouse: 'San Jose Logistics Hub',
      vendor: 'MATRIN Systems',
      weight: '1.2 kg',
      dimensions: '20x15x30 cm',
      visibility: 'Published',
      status: stockNum > 10 ? 'In Stock' : stockNum > 0 ? 'Low Stock' : 'Out of Stock',
      rating: 4.8,
      reviewsCount: 0,
      image,
      description: description.trim() || 'Premium MATRIN home cleaning & care product formulation.',
    });

    // Reset form & close modal
    setName('');
    setSku('');
    setPrice('');
    setDiscountPrice('');
    setStock('50');
    setDescription('');
    setAddProductModalOpen(false);
  };

  return (
    <Modal
      isOpen={isAddProductModalOpen}
      onClose={() => setAddProductModalOpen(false)}
      title={
        <div className="flex items-center gap-2 text-matrin-text dark:text-white font-extrabold text-base">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-matrin-primary">
            <Package className="w-5 h-5" />
          </div>
          <span>Add New MATRIN Product</span>
        </div>
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
            Product Title *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MATRIN Ultra Multi-Surface Cleaner 5L"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-medium text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
          />
        </div>

        {/* Category & SKU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-medium text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
            >
              <option value="Fabric Care">Fabric Care</option>
              <option value="Dishwashing">Dishwashing</option>
              <option value="Surface Care">Surface Care</option>
              <option value="Floor Care">Floor Care</option>
              <option value="Eco-Series">Eco-Series</option>
              <option value="Fragrance">Fragrance</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              SKU Code
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. MTR-SURF-99 (auto-generated if empty)"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-mono text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
            />
          </div>
        </div>

        {/* Price, Discount & Initial Stock */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              Price ($ / ₹) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="299.00"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-bold text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              Offer Price
            </label>
            <input
              type="number"
              step="0.01"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="249.00"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-bold text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              Initial Stock *
            </label>
            <input
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-bold text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-medium text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product features, ingredients, or usage instructions..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-medium text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-matrin-border dark:border-matrin-darkborder">
          <Button
            type="button"
            variant="outline"
            onClick={() => setAddProductModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<Sparkles className="w-4 h-4" />}>
            Create Product
          </Button>
        </div>
      </form>
    </Modal>
  );
};
