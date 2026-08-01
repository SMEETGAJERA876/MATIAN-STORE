"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Leaf,
  FlaskConical,
  Sparkles,
  Award,
  Grid,
  Droplet,
  Sparkle,
  Bath,
  SprayCan,
  Package,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import ProductImage from "@/components/ProductImage";

export default function CategoriesPage() {
  const [selectedPill, setSelectedPill] = useState("all");

  const categoriesPills = [
    { id: "all", label: "All Categories", icon: Grid },
    { id: "detergent", label: "Detergent", icon: Droplet },
    { id: "dishwash", label: "Dishwash", icon: Sparkle },
    { id: "floor-cleaner", label: "Floor Cleaner", icon: Layers },
    { id: "toilet-cleaner", label: "Toilet Cleaner", icon: Bath },
    { id: "glass-cleaner", label: "Glass Cleaner", icon: SprayCan },
    { id: "kitchen-cleaner", label: "Kitchen Cleaner", icon: Sparkles },
    { id: "fabric-softener", label: "Fabric Softener", icon: Droplet },
    { id: "combo-kits", label: "Combo & Kits", icon: Package },
  ];

  const categoryCards = [
    {
      id: "detergent",
      title: "Detergent",
      description: "Powerful clean that removes tough stains and keeps clothes bright.",
      count: "8 Products",
      image: "/images/products/detergent.webp",
      bgGradient: "from-[#EBF3FB] via-[#F2F7FD] to-white",
      href: "/products?category=Laundry Care",
    },
    {
      id: "dishwash",
      title: "Dishwash",
      description: "Cuts through grease effortlessly. Tough on oil, gentle on hands.",
      count: "6 Products",
      image: "/images/products/dishwash.webp",
      bgGradient: "from-[#ECFDF5] via-[#F4FBF7] to-white",
      href: "/products?category=Dish Care",
    },
    {
      id: "floor-cleaner",
      title: "Floor Cleaner",
      description: "Cleans, shines and spreads long-lasting fragrance in every corner.",
      count: "6 Products",
      image: "/images/products/floor-cleaner.webp",
      bgGradient: "from-[#F3E8FF] via-[#F8F2FF] to-white",
      href: "/products?category=Floor Care",
    },
    {
      id: "toilet-cleaner",
      title: "Toilet Cleaner",
      description: "10X better cleaning. Removes tough stains and kills germs.",
      count: "5 Products",
      image: "/images/products/toilet-cleaner.webp",
      bgGradient: "from-[#EFF6FF] via-[#F5F8FE] to-white",
      href: "/products?category=Toilet & Bath",
    },
    {
      id: "glass-cleaner",
      title: "Glass Cleaner",
      description: "Streak-free shine for crystal clear surfaces and windows.",
      count: "4 Products",
      image: "/images/products/bathroom-cleaner.webp",
      bgGradient: "from-[#E0F2FE] via-[#F0F9FF] to-white",
      href: "/products?category=Multi-Surface",
    },
    {
      id: "kitchen-cleaner",
      title: "Kitchen Cleaner",
      description: "Powerful degreaser that keeps your kitchen spotless and hygienic.",
      count: "5 Products",
      image: "/images/products/dish-cleaner.webp",
      bgGradient: "from-[#FEF3C7] via-[#FFFBEB] to-white",
      href: "/products?category=Dish Care",
    },
    {
      id: "fabric-softener",
      title: "Fabric Softener",
      description: "Makes clothes soft, fresh and fragrant for longer.",
      count: "4 Products",
      image: "/images/products/detergent.webp",
      bgGradient: "from-[#FCE7F3] via-[#FDF2F8] to-white",
      href: "/products?category=Laundry Care",
    },
    {
      id: "combo-kits",
      title: "Combo & Kits",
      description: "Best value packs for your complete cleaning needs.",
      count: "6 Products",
      image: "/images/matrin-hero-lineup.png",
      bgGradient: "from-[#E0E7FF] via-[#EEF2FF] to-white",
      href: "/products",
    },
  ];

  const filteredCards = selectedPill === "all"
    ? categoryCards
    : categoryCards.filter((card) => card.id === selectedPill);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* Top Banner Header (Exact Match with Reference Image 1) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#EBF3FB] via-[#F1F6FD] to-[#EBF3FB] py-10 lg:py-14 border-b border-slate-200/60">
        {/* Subtle Water Bubbles Decoration */}
        <div className="absolute top-4 left-10 text-cyan-400/30 text-3xl animate-pulse pointer-events-none">💧</div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B2545] tracking-tight">
              All Categories
            </h1>
            <nav className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/" className="hover:text-[#1E40AF]">Home</Link>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-[#1E40AF]">Categories</span>
            </nav>
          </div>

          {/* Right Callout Badge Box */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-sm border border-slate-200/80 backdrop-blur-md max-w-md">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-snug">
              Powerful cleaning solutions for every corner of your home.
            </p>
          </div>
        </div>
      </section>

      {/* Sub-Category Pills Bar (Exact Match with Reference Image 1) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-6 relative z-20">
        <div className="rounded-3xl bg-white p-3 shadow-lg border border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categoriesPills.map((pill) => {
            const IconComp = pill.icon;
            const isSelected = selectedPill === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedPill(pill.id)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? "bg-[#1E40AF] text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <IconComp size={16} className={isSelected ? "text-cyan-300" : "text-slate-500"} />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Category Cards Grid (Exact 2x4 Layout matching Reference Image 1) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCards.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Card Banner Artwork */}
              <div className="relative w-full p-2">
                <ProductImage
                  src={cat.image}
                  alt={cat.title}
                  fitMode="cover"
                />
              </div>

              {/* Card Content Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0B2545] group-hover:text-[#1E40AF] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400">
                    {cat.count}
                  </span>

                  <Link
                    href={cat.href}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1E40AF] px-4 py-1.5 text-xs font-bold text-[#1E40AF] transition-all hover:bg-[#1E40AF] hover:text-white"
                  >
                    <span>Shop Now</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom Trust Highlights Bar (Exact Match with Reference Image 1) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-14">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Leaf size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#0B2545]">Plant Based Ingredients</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Safe for your family and environment.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#0B2545]">Safe & Gentle</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Tough on stains, gentle on hands.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <FlaskConical size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#0B2545]">Powerful Formula</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Advanced cleaning with lasting freshness.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#0B2545]">Eco Friendly</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Sustainable products for a better tomorrow.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#0B2545]">Built for Every Home</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Formulated for Indian household needs.</p>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
