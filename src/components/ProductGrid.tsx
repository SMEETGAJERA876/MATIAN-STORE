"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import CategoryFilter, { SortOption } from "./CategoryFilter";
import { useProductStore } from "@/context/ProductStoreContext";
import { ProductCategory } from "@/types/product";
import { ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface ProductGridProps {
  isTeaser?: boolean;
  title?: string;
  badge?: string;
}

export default function ProductGrid({
  isTeaser = false,
  title,
  badge,
}: ProductGridProps) {
  const { products } = useProductStore();
  const searchParams = useSearchParams();
  const initialQuery = searchParams ? searchParams.get("search") || "" : "";
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState<ProductCategory>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    const q = searchParams ? searchParams.get("search") : null;
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          category === "All" || product.category === category;
        const matchesSearch =
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, search, category, sortBy]);

  // Teaser mode displays a curated 4-product preview
  const displayedProducts = isTeaser
    ? filteredAndSortedProducts.slice(0, 4)
    : filteredAndSortedProducts;

  const sectionBadge = badge || (isTeaser ? "OUR BESTSELLERS" : "FULL CATALOG");
  const sectionTitle = title || (isTeaser ? "Best Sellers" : "Our Products");

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12 my-4" id="products-grid">
      
      {/* Section Header matching reference image */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-[#0A1C3E] dark:text-white tracking-tight">
          {sectionTitle}
        </h2>

        {isTeaser && (
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 rounded-lg bg-[#EBF4FE] hover:bg-[#DCEFFA] border border-[#0038A8]/30 px-3.5 py-1.5 text-xs font-bold text-[#0038A8] transition"
          >
            <span>View All Products</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar (Only shown on full catalog mode) */}
      {!isTeaser && (
        <>
          <div className="mb-6">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <CategoryFilter
            selectedCategory={category}
            onSelectCategory={setCategory}
            sortBy={sortBy}
            onSelectSort={setSortBy}
          />
        </>
      )}

      {/* Product Cards Grid */}
      {displayedProducts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Teaser Mode Bottom CTA Link Button */}
          {isTeaser && (
            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-[#1E40AF] hover:bg-[#1a3899] dark:bg-blue-600 dark:hover:bg-blue-500 px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-blue-600/20 transition"
              >
                <span>View Full Catalog ({products.length} Products)</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-2xs border border-slate-200/60 dark:border-slate-700">
            <RefreshCw size={24} />
          </div>
          <h3 className="mt-4 text-xl font-bold text-[#0B2545] dark:text-white">
            No products found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            Try clearing your search term or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1E40AF] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#1a3899] transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}