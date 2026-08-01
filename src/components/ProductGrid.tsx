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

export default function ProductGrid() {
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
  }, [search, category, sortBy]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16" id="products-grid">
      
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            OUR BESTSELLERS
          </span>
          <h2 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0A2E4E]">
            Shop Our Most Loved Products
          </h2>
        </div>

        <Link
          href="/products"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0A2E4E] hover:text-[#13426B]"
        >
          <span>VIEW ALL PRODUCTS</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="mb-8">
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* Category Pills & Sorting Bar */}
      <CategoryFilter
        selectedCategory={category}
        onSelectCategory={setCategory}
        sortBy={sortBy}
        onSelectSort={setSortBy}
      />

      {/* Product Cards Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#EFEAE4] bg-[#F5F1EB] p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF7F2] text-slate-500">
            <RefreshCw size={24} />
          </div>
          <h3 className="mt-4 font-serif text-2xl font-normal text-[#0A2E4E]">
            No products found matching &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Try clearing your search term or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0A2E4E] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#13426B]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}