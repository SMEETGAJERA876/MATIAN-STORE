"use client";

import { ProductCategory } from "@/types/product";
import { SlidersHorizontal } from "lucide-react";

const categories: ProductCategory[] = [
  "All",
  "Laundry Care",
  "Dish Care",
  "Floor Care",
  "Toilet & Bath",
  "Multi-Surface",
];

export type SortOption = "featured" | "price-low" | "price-high" | "rating";

type CategoryFilterProps = {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  sortBy: SortOption;
  onSelectSort: (sort: SortOption) => void;
};

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSort,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 border-b border-[#EFEAE4] pb-6">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider transition-all duration-200 ${
                isActive
                  ? "bg-[#0A2E4E] text-[#FAF7F2] shadow-xs scale-102"
                  : "bg-[#F5F1EB] text-slate-700 hover:bg-[#EFEAE4]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <SlidersHorizontal size={15} className="text-slate-500" />
        <select
          value={sortBy}
          onChange={(e) => onSelectSort(e.target.value as SortOption)}
          className="rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#0A2E4E] focus:outline-hidden"
        >
          <option value="featured">Sort by: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
