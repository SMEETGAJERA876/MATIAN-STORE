import React, { useState } from 'react';
import { Plus, Edit3, ArrowUpRight, AlertTriangle, Layers, Award, PackageCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency } from '../../utils/formatters';

export const CategoriesView: React.FC = () => {
  const { categories, addCategory, toggleCategoryStatus, setAddCategoryModalOpen, isAddCategoryModalOpen, addToast } = useAdminStore();

  const [newCatName, setNewCatName] = useState('');
  const [newCatParent, setNewCatParent] = useState('Kitchen Essentials');
  const [newCatImg, setNewCatImg] = useState('https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName,
      image: newCatImg,
      parentCategory: newCatParent,
      productCount: 12,
      revenue: 8500,
      status: 'Active',
      topLevel: false,
      subcategories: ['General Accessories'],
    });
    setNewCatName('');
    setAddCategoryModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Category Management
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Organize catalog hierarchies, sub-categories, and seasonal collections.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddCategoryModalOpen(true)}
        >
          Add New Category
        </Button>
      </div>

      {/* Top 4 Metrics Cards (Matching Reference Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">
            TOTAL CATEGORIES
          </div>
          <div className="text-3xl font-extrabold text-matrin-primary dark:text-white mt-1">
            24
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +2 this month
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">
            ACTIVE PRODUCTS
          </div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">
            1,482
          </div>
          <div className="text-xs font-medium text-matrin-gray dark:text-slate-400 mt-2">
            Across all categories
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">
            TOP PERFORMER
          </div>
          <div className="text-2xl font-extrabold text-matrin-primary dark:text-blue-400 mt-1">
            Fabric Care
          </div>
          <div className="text-xs font-medium text-matrin-gray dark:text-slate-400 mt-2">
            45% of total sales
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">
            INVENTORY ALERTS
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            3
          </div>
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2">
            Restock required
          </div>
        </div>
      </div>

      {/* Category Cards Grid (Matching Reference Image 1 layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-200 group flex flex-col justify-between"
          >
            {/* Header Image with Tag Badges */}
            <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {cat.topLevel && (
                <span className="absolute top-3 left-3 bg-matrin-primary text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-soft tracking-wider">
                  TOP LEVEL
                </span>
              )}

              {cat.status === 'Draft' && (
                <span className="absolute top-3 left-3 bg-slate-700 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                  DRAFT
                </span>
              )}

              <h3 className="absolute bottom-3 left-4 text-xl font-extrabold text-white drop-shadow-md">
                {cat.name}
              </h3>
            </div>

            {/* Body Info */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-matrin-gray dark:text-slate-400 font-medium">Parent Category</div>
                  <div className="font-bold text-matrin-text dark:text-white mt-0.5 truncate">
                    {cat.parentCategory}
                  </div>
                </div>
                <div>
                  <div className="text-matrin-gray dark:text-slate-400 font-medium">Product Count</div>
                  <div className="font-bold text-matrin-text dark:text-white mt-0.5">
                    {cat.productCount} Items
                  </div>
                </div>
              </div>

              {/* Subcategories tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {cat.subcategories.map((sub, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold bg-matrin-bg dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-matrin-border dark:border-matrin-darkborder"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Status Toggle & Edit */}
            <div className="px-5 py-4 border-t border-matrin-border dark:border-matrin-darkborder bg-matrin-bg/40 dark:bg-slate-900/40 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cat.status === 'Active'}
                  onChange={() => toggleCategoryStatus(cat.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-matrin-secondary relative" />
                <span className="text-xs font-semibold text-matrin-text dark:text-white">
                  {cat.status}
                </span>
              </label>

              <button
                onClick={() => addToast('info', `Editing category "${cat.name}"`)}
                className="p-2 text-matrin-gray hover:text-matrin-primary dark:hover:text-blue-400 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Add New Category */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        title="Add New Category"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Smart Floor Cleaners"
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">
              Parent Category
            </label>
            <select
              value={newCatParent}
              onChange={(e) => setNewCatParent(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            >
              <option>Top Level (No Parent)</option>
              <option>Kitchen Essentials</option>
              <option>Universal Care</option>
              <option>Sustainability</option>
              <option>Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">
              Category Cover Image URL
            </label>
            <input
              type="text"
              value={newCatImg}
              onChange={(e) => setNewCatImg(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-matrin-border">
            <Button variant="outline" type="button" onClick={() => setAddCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
