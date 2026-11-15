"use client";

import { useState, useEffect } from "react";
import { ProductCategory } from "@/types/product";
import { SlidersHorizontal, Layers } from "lucide-react";

const DEFAULT_CATEGORIES: ProductCategory[] = [
  "All",
  "Laundry Care",
  "Dish Care",
  "Floor Care",
  "Toilet & Bath",
  "Multi-Surface",
];

const sizeOptions = [
  "All Sizes",
  "500 ml",
  "1 L",
  "2 L",
  "5 L",
];

export type SortOption = "featured" | "price-low" | "price-high" | "rating";

type CategoryFilterProps = {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
  sortBy: SortOption;
  onSelectSort: (sort: SortOption) => void;
};

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  selectedSize = "All Sizes",
  onSelectSize,
  sortBy,
  onSelectSort,
}: CategoryFilterProps) {
  const [categoriesList, setCategoriesList] = useState<ProductCategory[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const loadCategories = () => {
      fetch("/api/categories")
        .then(async (response) => {
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Failed to load categories.");
          if (!Array.isArray(result)) throw new Error("Invalid category data from the store.");
          const names = result
            .filter((category) => category.isActive !== false && category.status !== "Inactive")
            .map((category) => category.name)
            .filter((name): name is string => typeof name === "string" && name.length > 0);
          setCategoriesList(Array.from(new Set(["All", ...names])) as ProductCategory[]);
        })
        .catch((error) => console.error("Could not load categories:", error));
    };
    loadCategories();
    window.addEventListener("matrin_categories_updated", loadCategories);
    return () => window.removeEventListener("matrin_categories_updated", loadCategories);
  }, []);

  return (
    <div className="space-y-4 mb-8 border-b border-[#DCE8F5] pb-6">
      {/* Category Pills & Sort Selector Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categoriesList.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-[#0645B5] text-white shadow-xs scale-102"
                    : "bg-[#EAF5FF] text-[#102A5C] hover:bg-[#DCE8F5] border border-[#DCE8F5]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <SlidersHorizontal size={15} className="text-[#0645B5]" />
          <select
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="rounded-xl border border-[#DCE8F5] bg-white px-3.5 py-2 text-xs font-bold text-[#102A5C] focus:border-[#0645B5] focus:outline-hidden shadow-2xs"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Size / Variant Filter Row */}
      {onSelectSize && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#102A5C] uppercase tracking-wider mr-2">
            <Layers size={14} className="text-[#0645B5]" />
            <span>Filter By Size:</span>
          </div>
          {sizeOptions.map((sz) => {
            const isSizeActive = selectedSize === sz;
            return (
              <button
                key={sz}
                onClick={() => onSelectSize(sz)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isSizeActive
                    ? "bg-[#102A5C] text-white shadow-xs font-black ring-1 ring-[#102A5C]"
                    : "bg-white text-[#5F6B7A] hover:text-[#102A5C] hover:bg-[#F0F5FA] border border-[#DCE8F5]"
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
