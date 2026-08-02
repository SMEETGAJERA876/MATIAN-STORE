"use client";

import { useState } from "react";
import { useProductStore } from "@/context/ProductStoreContext";
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Tag, DollarSign, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // New product form
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState<"Laundry Care" | "Dish Care" | "Floor Care" | "Toilet Care">("Laundry Care");
  const [newProdPrice, setNewProdPrice] = useState("299");
  const [newProdStock, setNewProdStock] = useState("50");
  const [newProdDesc, setNewProdDesc] = useState("High quality eco-friendly cleaning product.");
  const [newProdImage, setNewProdImage] = useState("/images/products/detergent.webp");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    await addProduct({
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      oldPrice: Math.round(Number(newProdPrice) * 1.3),
      discountPercentage: 23,
      rating: 5.0,
      reviewCount: 0,
      image: newProdImage,
      galleryImages: [newProdImage],
      description: newProdDesc,
      features: ["Advanced Cleaning Formula", "Eco-friendly", "Safe for home"],
      specifications: { volume: "1 Litre" },
      inStock: Number(newProdStock) > 0,
      stockCount: Number(newProdStock),
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      tags: [newProdCategory, "Cleaning"],
    });

    setAddModalOpen(false);
    setNewProdName("");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Product Management</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Add, edit, and synchronize catalog products with the live website
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#1E293B] p-3 rounded-2xl border border-slate-800 max-w-md">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Filter products by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden w-full"
        />
      </div>

      {/* Products Table */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-xl object-cover bg-slate-800 border border-slate-700" />
                    <div>
                      <span className="block text-sm">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">ID: #{p.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-300">{p.category}</td>
                  <td className="px-6 py-4 font-extrabold text-blue-400">₹{p.price}</td>
                  <td className="px-6 py-4 font-bold text-white">{p.stockCount} units</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStock(p.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 transition ${
                        p.inStock ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {p.inStock ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] max-w-lg w-full rounded-3xl border border-slate-800 p-6 space-y-5">
            <h3 className="text-lg font-extrabold text-white">Add Product to Catalog</h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Ultra Stain Remover Gel"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as unknown as (typeof newProdCategory))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-white"
                  >
                    <option value="Laundry Care">Laundry Care</option>
                    <option value="Dish Care">Dish Care</option>
                    <option value="Floor Care">Floor Care</option>
                    <option value="Toilet Care">Toilet Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Initial Stock Count *</label>
                <input
                  type="number"
                  required
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-white"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 rounded-xl bg-slate-800 py-3 font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
