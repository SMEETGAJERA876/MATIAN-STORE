import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';
import {
  Package,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Tag,
  CheckCircle,
  Layers,
  DollarSign,
} from 'lucide-react';

export const AddProductModal: React.FC = () => {
  const { isAddProductModalOpen, setAddProductModalOpen, addProduct, addToast } = useAdminStore();

  // Form fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Laundry Care');
  const [brand, setBrand] = useState('MATRIN Enterprise');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [warehouse, setWarehouse] = useState('San Jose Central Hub');
  const [vendor, setVendor] = useState('MATRIN Systems');

  // Multiple Photos state
  const [primaryImage, setPrimaryImage] = useState(
    'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop&q=80',
  ]);
  const [newGalleryInput, setNewGalleryInput] = useState('');

  // Product Specs & Features
  const [volume, setVolume] = useState('5 Liter');
  const [scent, setScent] = useState('Fresh Lavender');
  const [formulation, setFormulation] = useState('Ultra Concentrated Liquid');
  const [description, setDescription] = useState('');
  const [featureInputs, setFeatureInputs] = useState<string[]>([
    'Eliminates 99.9% of bacteria and tough stains',
    'Eco-friendly biodegradable formula',
    'Safe for high-efficiency washing machines',
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Badges
  const [isBestSeller, setIsBestSeller] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true);

  // Add gallery photo URL
  const handleAddGalleryPhoto = () => {
    if (!newGalleryInput.trim()) return;
    setGalleryImages((prev) => [...prev, newGalleryInput.trim()]);
    setNewGalleryInput('');
  };

  // Remove gallery photo
  const handleRemoveGalleryPhoto = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Add Feature bullet point
  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFeatureInputs((prev) => [...prev, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  // Remove Feature bullet point
  const handleRemoveFeature = (index: number) => {
    setFeatureInputs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('error', 'Product title is required.');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      addToast('error', 'Please enter a valid product price.');
      return;
    }

    const priceNum = parseFloat(price);
    const oldPriceNum = oldPrice ? parseFloat(oldPrice) : Math.round(priceNum * 1.25);
    const stockNum = parseInt(stock, 10) || 50;
    const finalSku = sku.trim() || `MTR-${category.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProdPayload = {
      name: name.trim(),
      sku: finalSku,
      barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
      category,
      brand,
      price: priceNum,
      discountPrice: oldPriceNum > priceNum ? priceNum : undefined,
      gst: 18,
      stock: stockNum,
      reservedStock: 0,
      warehouse,
      vendor,
      weight: volume || '1.2 kg',
      dimensions: '20x15x30 cm',
      visibility: 'Published' as const,
      status: stockNum > 10 ? ('In Stock' as const) : stockNum > 0 ? ('Low Stock' as const) : ('Out of Stock' as const),
      rating: 4.9,
      reviewsCount: 0,
      image: primaryImage.trim() || 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
      galleryImages: [primaryImage, ...galleryImages].filter(Boolean),
      description: description.trim() || 'Premium MATRIN home cleaning & care product formulation.',
      features: featureInputs,
      specifications: {
        volume,
        scent,
        formulation,
        origin: 'India',
      },
    };

    // 1. Add to Admin Store State
    addProduct(newProdPayload);

    // 2. Post to Next.js API for backend sync
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdPayload.name,
          sku: newProdPayload.sku,
          category: newProdPayload.category,
          price: newProdPayload.price,
          originalPrice: oldPriceNum,
          stock: newProdPayload.stock,
          image: newProdPayload.image,
          images: newProdPayload.galleryImages,
          description: newProdPayload.description,
          features: newProdPayload.features,
          specifications: newProdPayload.specifications,
          inStock: stockNum > 0,
          badge: isBestSeller ? 'Bestseller' : isNewArrival ? 'New' : undefined,
        }),
      });
    } catch (err) {
      console.log('Synced locally in Admin Store');
    }

    addToast('success', `Product "${name.trim()}" published to catalog with ${galleryImages.length + 1} photos!`);

    // Reset & Close
    setName('');
    setSku('');
    setPrice('');
    setOldPrice('');
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
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-matrin-primary dark:text-blue-400 flex items-center gap-1.5 border-b border-matrin-border dark:border-matrin-darkborder pb-2">
            <Layers className="w-4 h-4" /> 1. Product Identification & Pricing
          </h4>

          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              Product Title / Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MATRIN Ultra Liquid Detergent 5L Container"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-semibold text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-semibold text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
              >
                <option value="Laundry Care">Laundry Care</option>
                <option value="Dish Care">Dish Care</option>
                <option value="Floor Care">Floor Care</option>
                <option value="Toilet Care">Toilet Care</option>
                <option value="Multi-Surface">Multi-Surface</option>
                <option value="Eco-Series">Eco-Series</option>
                <option value="Fragrance">Fragrance</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
                Price (₹ / $) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299.00"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-extrabold text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
                Original Price (MSRP)
              </label>
              <input
                type="number"
                step="0.01"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="399.00"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-semibold text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-extrabold text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
                SKU Code
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Auto-generated if empty"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-mono text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="MATRIN Enterprise"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-sm font-semibold text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Multiple Product Photos */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-matrin-primary dark:text-blue-400 flex items-center gap-1.5 border-b border-matrin-border dark:border-matrin-darkborder pb-2">
            <ImageIcon className="w-4 h-4" /> 2. Multiple Product Photos & Gallery
          </h4>

          {/* Primary Cover Photo */}
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              Primary Cover Photo URL *
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                required
                value={primaryImage}
                onChange={(e) => setPrimaryImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-medium text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
              />
              <img
                src={primaryImage}
                alt="Primary Cover Preview"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-matrin-primary/30 shrink-0 bg-slate-100 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Gallery Images List */}
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              Additional Product Gallery Photos ({galleryImages.length})
            </label>

            {/* Thumbnail Strip */}
            <div className="flex flex-wrap items-center gap-3 mb-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder">
              <div className="text-center p-2 rounded-xl border border-dashed border-matrin-border dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] text-slate-400 font-bold">
                Cover Image
              </div>
              {galleryImages.map((url, idx) => (
                <div key={idx} className="relative group w-14 h-14 rounded-xl overflow-hidden ring-1 ring-matrin-border shrink-0">
                  <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryPhoto(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Photo Input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newGalleryInput}
                onChange={(e) => setNewGalleryInput(e.target.value)}
                placeholder="Paste additional product image URL..."
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-medium text-matrin-text dark:text-white focus:outline-none"
              />
              <Button
                type="button"
                variant="outline"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleAddGalleryPhoto}
              >
                Add Photo
              </Button>
            </div>
          </div>
        </div>

        {/* Section 3: Specifications & Features */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-matrin-primary dark:text-blue-400 flex items-center gap-1.5 border-b border-matrin-border dark:border-matrin-darkborder pb-2">
            <Sparkles className="w-4 h-4" /> 3. Specifications & Highlights
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
                Volume / Weight
              </label>
              <input
                type="text"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g. 5 Liters / 1 Kg"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-semibold text-matrin-text dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
                Fragrance / Scent
              </label>
              <input
                type="text"
                value={scent}
                onChange={(e) => setScent(e.target.value)}
                placeholder="e.g. Lavender Fresh"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-semibold text-matrin-text dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
                Formulation
              </label>
              <input
                type="text"
                value={formulation}
                onChange={(e) => setFormulation(e.target.value)}
                placeholder="e.g. Concentrated Liquid"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-semibold text-matrin-text dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Features Bullets */}
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              Key Product Features ({featureInputs.length})
            </label>

            <ul className="space-y-1.5 mb-2">
              {featureInputs.map((feat, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-medium text-matrin-text dark:text-slate-200 border border-matrin-border dark:border-matrin-darkborder">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {feat}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                placeholder="Add new feature highlight (e.g. Non-toxic stain remover)..."
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-medium text-matrin-text dark:text-white focus:outline-none"
              />
              <Button
                type="button"
                variant="outline"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleAddFeature}
              >
                Add Feature
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Description & Usage
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description, recommended usage amounts, and surface compatibility..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-medium text-matrin-text dark:text-white focus:outline-none focus:border-matrin-primary"
            />
          </div>
        </div>

        {/* Section 4: Badges */}
        <div className="flex items-center gap-6 pt-2 border-t border-matrin-border dark:border-matrin-darkborder text-xs font-bold text-matrin-text dark:text-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="rounded border-slate-300 text-matrin-primary focus:ring-matrin-primary"
            />
            <span>Mark as Bestseller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="rounded border-slate-300 text-matrin-primary focus:ring-matrin-primary"
            />
            <span>Mark as New Arrival</span>
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-matrin-border dark:border-matrin-darkborder">
          <Button
            type="button"
            variant="outline"
            onClick={() => setAddProductModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<Sparkles className="w-4 h-4" />}>
            Publish Product to Store
          </Button>
        </div>
      </form>
    </Modal>
  );
};
