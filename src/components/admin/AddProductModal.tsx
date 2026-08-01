"use client";

import { useState } from "react";
import { useProductStore } from "@/context/ProductStoreContext";
import { ProductCategory } from "@/types/product";
import { X, Image as ImageIcon, Plus, Tag, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories: ProductCategory[] = [
  "Laundry Care",
  "Dish Care",
  "Floor Care",
  "Toilet & Bath",
  "Multi-Surface",
];

const samplePhotoPresets = [
  { name: "Liquid Detergent", url: "/images/products/liquid-detergent.webp" },
  { name: "Floor Cleaner", url: "/images/products/floor-cleaner.webp" },
  { name: "Dishwash Gel", url: "/images/products/dishwash-gel.webp" },
  { name: "Toilet Cleaner", url: "/images/products/toilet-cleaner.webp" },
  { name: "Glass Spray", url: "/images/products/glass-spray.webp" },
];

export default function AddProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addProduct } = useProductStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Laundry Care");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [image, setImage] = useState(samplePhotoPresets[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [stockCount, setStockCount] = useState("50");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "Lab-tested 99.9% antibacterial action",
    "Non-toxic and skin-friendly chemistry",
  ]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const numPrice = Number(price);
    const numOldPrice = oldPrice ? Number(oldPrice) : Math.round(numPrice * 1.25);
    const discountPerc = numOldPrice > numPrice ? Math.round(((numOldPrice - numPrice) / numOldPrice) * 100) : 0;
    const finalImage = customImageUrl.trim() || image;

    addProduct({
      name: name.trim(),
      category,
      price: numPrice,
      oldPrice: numOldPrice,
      discountPercentage: discountPerc,
      image: finalImage,
      galleryImages: [finalImage],
      description: description.trim() || "Premium Indian home care solution with lab-certified formulation.",
      features: features.length > 0 ? features : ["99.9% Germ Shield", "Eco-friendly bio surfactants"],
      specifications: {
        volume: "1 Litre",
        scent: "Fresh Breeze",
        shelfLife: "24 Months",
        origin: "India",
        formulation: "Concentrated Liquid",
        usageInstructions: "Dilute 1 capful in 5 litres of water or apply directly for tough stains.",
      },
      inStock: Number(stockCount) > 0,
      stockCount: Number(stockCount) || 50,
      tags: [category.toLowerCase(), "new"],
    });

    // Reset fields & close
    setName("");
    setPrice("");
    setOldPrice("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF7F2] border border-[#EFEAE4] shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-[#0A2E4E] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-normal">Add New Product</h3>
                <p className="text-xs text-slate-300">Create new item with photos & custom pricing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-1.5 text-slate-200 hover:bg-white/20 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Product Photo Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <ImageIcon size={16} /> Select Product Photo / Image Preset
              </label>

              {/* Photo Presets */}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {samplePhotoPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setImage(preset.url);
                      setCustomImageUrl("");
                    }}
                    className={`relative overflow-hidden rounded-xl border-2 p-1.5 transition text-center flex flex-col items-center bg-white ${
                      image === preset.url && !customImageUrl
                        ? "border-[#0A2E4E] shadow-sm bg-blue-50/50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="h-12 w-auto object-contain mb-1" />
                    <span className="text-[9px] font-semibold text-slate-700 line-clamp-1">{preset.name}</span>
                    {image === preset.url && !customImageUrl && (
                      <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#0A2E4E] text-white text-[8px] flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Or enter custom Image URL */}
              <input
                type="text"
                placeholder="Or paste external image URL (https://...)"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
              />
            </div>

            {/* Title & Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Matrin Ultra Dishwash Gel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price, Old Price & Stock */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Original Price MRP (₹)
                </label>
                <input
                  type="number"
                  placeholder="399"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Initial Stock Count
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Product highlights and benefits..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
              />
            </div>

            {/* Key Features List */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Product Features
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add a feature point..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="rounded-xl bg-[#0A2E4E] px-4 py-2 text-xs font-bold text-white hover:bg-[#13426B] transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F1EB] px-3 py-1 text-xs font-medium text-[#0A2E4E] border border-[#EFEAE4]"
                  >
                    <Check size={12} className="text-emerald-600" />
                    {feat}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="ml-1 text-slate-400 hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#0A2E4E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#13426B] transition"
              >
                Save & Publish Product
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
