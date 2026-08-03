import React, { useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';
import {
  Package,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  UploadCloud,
  CheckCircle,
  Layers,
  FileImage,
  Link as LinkIcon,
} from 'lucide-react';

// Helper to convert & compress JPEG/PNG files from PC into high-quality base64 Data URLs
const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const AddProductModal: React.FC = () => {
  const { isAddProductModalOpen, setAddProductModalOpen, addProduct, addToast } = useAdminStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Laundry Care');
  const [brand, setBrand] = useState('MATRIN Enterprise');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [warehouse, setWarehouse] = useState('Central Logistics Hub');
  const [vendor, setVendor] = useState('MATRIN Systems');

  // Multiple Photos state
  const [primaryImage, setPrimaryImage] = useState(
    'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [photoInputMode, setPhotoInputMode] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  // Specs & Features
  const [volume, setVolume] = useState('5 Liter');
  const [scent, setScent] = useState('Fresh Lavender');
  const [formulation, setFormulation] = useState('Ultra Concentrated Liquid');
  const [description, setDescription] = useState('');
  const [featureInputs, setFeatureInputs] = useState<string[]>([
    'Eliminates 99.9% of tough stains & bacteria',
    'Biodegradable eco-friendly formulation',
    'Gentle on skin & safe for all machine types',
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Badges
  const [isBestSeller, setIsBestSeller] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Handle direct file uploads from PC (.jpeg, .jpg, .png, .webp)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);
    const newPhotos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const base64Data = await processImageFile(file);
          newPhotos.push(base64Data);
        } catch (err) {
          console.error('Failed to read image file:', file.name);
        }
      }
    }

    if (newPhotos.length > 0) {
      // First uploaded photo becomes primary cover if using default or empty
      if (!primaryImage || primaryImage.includes('unsplash.com')) {
        setPrimaryImage(newPhotos[0]);
        if (newPhotos.length > 1) {
          setGalleryImages((prev) => [...prev, ...newPhotos.slice(1)]);
        }
      } else {
        setGalleryImages((prev) => [...prev, ...newPhotos]);
      }
      addToast('success', `Uploaded ${newPhotos.length} JPEG/PNG photo(s) from PC!`);
    }

    setIsProcessingFiles(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Add gallery photo URL link
  const handleAddUrlPhoto = () => {
    if (!urlInput.trim()) return;
    if (!primaryImage || primaryImage.includes('unsplash.com')) {
      setPrimaryImage(urlInput.trim());
    } else {
      setGalleryImages((prev) => [...prev, urlInput.trim()]);
    }
    setUrlInput('');
  };

  // Remove photo from gallery
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

    const finalPrimaryImage = primaryImage.trim() || 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80';
    const allPhotos = [finalPrimaryImage, ...galleryImages].filter(Boolean);

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
      rating: 5.0,
      reviewsCount: 0,
      image: finalPrimaryImage,
      galleryImages: allPhotos,
      description: description.trim() || 'Premium MATRIN cleaning formulation.',
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

    addToast('success', `Product "${name.trim()}" published with ${allPhotos.length} photos!`);

    // Reset & Close
    setName('');
    setSku('');
    setPrice('');
    setOldPrice('');
    setStock('50');
    setDescription('');
    setGalleryImages([]);
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

        {/* Section 2: Direct PC File Upload & Multiple Photos */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-matrin-border dark:border-matrin-darkborder pb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-matrin-primary dark:text-blue-400 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" /> 2. Upload Photos Directly From PC (JPEG, PNG)
            </h4>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setPhotoInputMode('file')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  photoInputMode === 'file'
                    ? 'bg-white dark:bg-slate-700 text-matrin-primary dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileImage className="w-3.5 h-3.5" /> Upload from PC
              </button>
              <button
                type="button"
                onClick={() => setPhotoInputMode('url')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  photoInputMode === 'url'
                    ? 'bg-white dark:bg-slate-700 text-matrin-primary dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" /> Web Image Link
              </button>
            </div>
          </div>

          {/* PC File Upload Dropzone */}
          {photoInputMode === 'file' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-matrin-primary/30 dark:border-blue-500/40 hover:border-matrin-primary dark:hover:border-blue-400 rounded-2xl p-6 bg-blue-50/40 dark:bg-blue-950/20 text-center cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center mx-auto text-matrin-primary dark:text-blue-400 group-hover:scale-110 transition-transform mb-2">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-xs font-extrabold text-matrin-text dark:text-white">
                {isProcessingFiles ? 'Processing JPEG images...' : 'Click to select JPEG/PNG photos from your PC'}
              </div>
              <p className="text-[11px] text-matrin-gray dark:text-slate-400 mt-1">
                Supports multiple <strong>.JPEG, .JPG, .PNG, .WEBP</strong> image files. Select multiple photos at once.
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste product image URL (e.g. https://domain.com/photo.jpeg)..."
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-xs font-medium text-matrin-text dark:text-white focus:outline-none"
              />
              <Button
                type="button"
                variant="outline"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleAddUrlPhoto}
              >
                Add Link
              </Button>
            </div>
          )}

          {/* Selected Photos Thumbnails Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-matrin-text dark:text-slate-300">
              <span>Attached Product Photos ({1 + galleryImages.length})</span>
              <span className="text-[11px] text-matrin-primary dark:text-blue-400 font-semibold">First photo is Primary Cover</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder min-h-[72px]">
              {/* Primary Cover Thumbnail */}
              {primaryImage && (
                <div className="relative group w-16 h-16 rounded-xl overflow-hidden ring-2 ring-matrin-primary shrink-0 bg-white dark:bg-slate-800">
                  <img src={primaryImage} alt="Primary Cover" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-matrin-primary text-white text-[9px] font-black text-center py-0.5 uppercase tracking-tighter">
                    Cover
                  </span>
                </div>
              )}

              {/* Gallery Thumbnails */}
              {galleryImages.map((url, idx) => (
                <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden ring-1 ring-matrin-border shrink-0 bg-white dark:bg-slate-800">
                  <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryPhoto(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Swap with primary cover
                      const oldPrimary = primaryImage;
                      setPrimaryImage(url);
                      setGalleryImages((prev) => prev.map((item, i) => (i === idx ? oldPrimary : item)));
                    }}
                    className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[8px] font-bold text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Make Cover
                  </button>
                </div>
              ))}

              {!primaryImage && galleryImages.length === 0 && (
                <div className="text-xs text-slate-400 py-2 px-1 font-medium">
                  No photos uploaded yet. Click the upload area above to choose photos from your computer.
                </div>
              )}
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
                placeholder="Add feature highlight (e.g. Tough on grease, gentle on hands)..."
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
