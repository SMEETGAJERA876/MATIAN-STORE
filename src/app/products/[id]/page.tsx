"use client";

import { useProductStore } from "@/context/ProductStoreContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import {
  Star,
  Heart,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Trash2,
  RefreshCw,
  Clock,
  Headphones,
  Leaf,
  Droplet,
  Check,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProductDetailsPage() {
  const { products, deleteProduct } = useProductStore();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const product = products.find((p) => p.id === Number(id)) || products[0];

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedFragrance, setSelectedFragrance] = useState("Lavender Fresh");
  const [selectedSize, setSelectedSize] = useState("1 L");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "usage" | "ingredients" | "reviews" | "faqs">("details");

  const SIZE_DETAILS: Record<string, { price: number; oldPrice: number; discount: string }> = {
    "500 ml": { price: 169, oldPrice: 219, discount: "23% OFF" },
    "1 L": { price: 299, oldPrice: 399, discount: "25% OFF" },
    "2 L": { price: 499, oldPrice: 649, discount: "23% OFF" },
    "5 L": { price: 999, oldPrice: 1299, discount: "23% OFF" },
  };

  const currentSizeInfo = SIZE_DETAILS[selectedSize] || {
    price: product ? product.price : 299,
    oldPrice: product ? product.oldPrice : 399,
    discount: product ? `${product.discountPercentage}% OFF` : "25% OFF",
  };

  const baseName = product ? product.name.replace(/\s*\([^)]*\)/g, "").trim() : "Liquid Detergent";
  const currentTitle = `${baseName} (${selectedSize})`;

  const customVariantProduct = product ? {
    ...product,
    name: currentTitle,
    price: currentSizeInfo.price,
    oldPrice: currentSizeInfo.oldPrice,
  } : product;

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-[#102A5C]">Product Not Found</h1>
        <Link href="/products" className="mt-4 inline-block rounded-full bg-[#0645B5] px-6 py-3 text-xs font-bold text-white">
          Back to Products
        </Link>
      </div>
    );
  }

  const isFav = isInWishlist(product.id);
  const gallery = [
    product.image,
    "/images/hero.webp",
    "/images/products/detergent.webp",
    "/images/products/dishwash.webp",
    "/images/products/floor-cleaner.webp",
    "/images/products/toilet-cleaner.webp",
  ];

  const handleSizeChange = (sz: string) => {
    setSelectedSize(sz);
    const info = SIZE_DETAILS[sz] || { price: product.price };
    toast.success(`Switched to ${sz} packing variant (₹${info.price})`, { icon: "🧴" });
  };

  const handleBuyNow = () => {
    addToCart(customVariantProduct, quantity);
    router.push("/cart");
  };

  const handleAddToCart = () => {
    addToCart(customVariantProduct, quantity);
    toast.success(`Added ${quantity}x ${currentTitle} to your cart!`, { icon: "🛒" });
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        
        {/* Breadcrumb Navigation (Exact Match with Image 3) */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#0645B5]">Home</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link href="/products" className="hover:text-[#0645B5]">Products</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link href="/categories" className="hover:text-[#0645B5]">{product.category}</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-[#102A5C] font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Layout: 3 Columns (Gallery Visuals, Product Specs, Sticky Purchase Sidebar) */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Gallery & Hero Image (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="flex gap-4">
              {/* Vertical Thumbnail List — uses plain <img> to avoid click interception */}
              <div className="flex flex-col gap-3 shrink-0">
                {gallery.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-16 w-16 rounded-2xl transition-all duration-200 overflow-hidden bg-[#F4F6FB] border cursor-pointer ${
                      activeImageIndex === idx
                        ? "ring-2 ring-[#0645B5] border-[#0645B5] opacity-100 scale-105"
                        : "border-slate-100 opacity-70 hover:opacity-100 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain p-1.5 rounded-2xl"
                    />
                  </button>
                ))}
              </div>

              {/* Hero Main Image Box */}
              <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden shadow-sm bg-white border border-slate-100">
                
                {/* Prev & Next Arrows */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition"
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition"
                  aria-label="Next Image"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Main product image — direct img for instant src switching */}
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#F4F6FB] p-4 flex items-center justify-center border border-slate-100/80">
                  <img
                    key={activeImageIndex}
                    src={gallery[activeImageIndex] || product.image}
                    alt={product.name}
                    className="h-full w-full object-contain rounded-3xl animate-[fadeIn_0.2s_ease-in-out]"
                  />
                </div>
              </div>
            </div>

            {/* 4 Feature Highlights Row Below Main Image (Exact Match with Image 3) */}
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-xs grid grid-cols-2 gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#0645B5] flex items-center justify-center shrink-0 border border-blue-100">
                  <Droplet size={15} />
                </div>
                <div>
                  <div className="font-extrabold text-[#102A5C]">3X Power Clean</div>
                  <div className="text-[10px] text-slate-500">Removes tough stains</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Leaf size={15} />
                </div>
                <div>
                  <div className="font-extrabold text-[#102A5C]">Plant Based Formula</div>
                  <div className="text-[10px] text-slate-500">Eco-friendly & safe</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Sparkles size={15} />
                </div>
                <div>
                  <div className="font-extrabold text-[#102A5C]">Fabric Protection</div>
                  <div className="text-[10px] text-slate-500">Gentle on clothes</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <div className="font-extrabold text-[#102A5C]">Dermatologically Tested</div>
                  <div className="text-[10px] text-slate-500">Safe for sensitive skin</div>
                </div>
              </div>
            </div>

          </div>

          {/* Middle Column: Specs & Options (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              {/* BEST SELLER Badge */}
              <span className="inline-block rounded-full bg-[#0645B5] px-3.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-2xs mb-2">
                BEST SELLER
              </span>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A5C] tracking-tight">
                {currentTitle}
              </h1>

              {/* Rating & Sales count (Exact Match with Image 3) */}
              <div className="mt-2 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-[#102A5C]">4.8</span>
                  <span className="text-slate-400 font-normal">(1,256 Reviews)</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="font-extrabold text-[#0645B5]">10K+ Sold</span>
              </div>

              {/* Short Description */}
              <p className="mt-3 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Powerful 3X cleaning with plant-based ingredients. Tough on stains, gentle on clothes & safe for your family.
              </p>

              {/* 4 Feature Tags Row */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                  <Leaf size={14} className="text-emerald-600" />
                  <span>Plant Based Ingredients</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                  <ShieldCheck size={14} className="text-[#0645B5]" />
                  <span>Safe for Your Family</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                  <Sparkles size={14} className="text-purple-600" />
                  <span>Tough on Stains</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 p-2 border border-slate-200/60">
                  <Droplet size={14} className="text-pink-600" />
                  <span>Color Safe Formula</span>
                </div>
              </div>
            </div>

            {/* Fragrance Selector Pills (Matching Image 3) */}
            <div>
              <label className="block text-xs font-bold text-[#102A5C] mb-2">
                Fragrance
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Lavender Fresh", icon: "🪻" },
                  { name: "Lime Power", icon: "🍋" },
                  { name: "Ocean Fresh", icon: "🌊" },
                ].map((frag) => (
                  <button
                    key={frag.name}
                    onClick={() => setSelectedFragrance(frag.name)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                      selectedFragrance === frag.name
                        ? "border-[#0645B5] bg-blue-50/60 text-[#0645B5] ring-1 ring-[#0645B5]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{frag.icon}</span>
                    <span>{frag.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Callout (Matching Image 3: Dynamic Price per selected size) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#0645B5]">
                  ₹{currentSizeInfo.price}
                </span>
                <span className="text-base font-semibold text-slate-400 line-through">
                  ₹{currentSizeInfo.oldPrice}
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-800">
                  {currentSizeInfo.discount}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">
                (Inclusive of all taxes)
              </p>
            </div>

            {/* Size Selector Pills (Matching Image 3) */}
            <div>
              <label className="block text-xs font-bold text-[#102A5C] mb-2">
                Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["500 ml", "1 L", "2 L", "5 L"].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => handleSizeChange(sz)}
                    className={`rounded-xl border py-2 text-xs font-extrabold transition text-center ${
                      selectedSize === sz
                        ? "border-[#0645B5] bg-blue-50/60 text-[#0645B5] ring-1 ring-[#0645B5]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sticky Sidebar Purchase Box (Col 3 matching Image 3) */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
            
            <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-md space-y-4">
              
              {/* Free Delivery Promo Header */}
              <div className="flex items-center gap-2.5 rounded-2xl bg-blue-50 p-3 border border-blue-100 text-xs font-bold text-[#0645B5]">
                <Truck size={18} className="text-[#0645B5] shrink-0" />
                <div>
                  <div>Free Delivery</div>
                  <div className="text-[10px] text-slate-500 font-normal">On orders above ₹499</div>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity</label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 w-full justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 rounded-lg bg-white shadow-2xs font-extrabold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-sm text-[#102A5C]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 rounded-lg bg-white shadow-2xs font-extrabold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button (Solid Blue) */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0645B5] py-3.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-[#1a3899] transition active:scale-98"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now Button (Outlined Blue with Lightning) */}
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#0645B5] py-3 text-xs font-bold text-[#0645B5] hover:bg-blue-50 transition active:scale-98"
              >
                <Zap size={16} />
                <span>Buy Now</span>
              </button>

              {/* Wishlist Link */}
              <div className="text-center pt-1">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition ${
                    isFav ? "text-rose-500" : "text-slate-600 hover:text-[#0645B5]"
                  }`}
                >
                  <Heart size={15} className={isFav ? "fill-rose-500" : ""} />
                  <span>{isFav ? "In Wishlist" : "Add to Wishlist"}</span>
                </button>
              </div>

              {/* Estimated Delivery Box (Matching Image 3) */}
              <div className="rounded-2xl bg-emerald-50/60 p-3 border border-emerald-100 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" /> Estimated Delivery
                  </span>
                  <button type="button" className="text-[10px] text-[#0645B5] hover:underline">View Details</button>
                </div>
                <p className="text-xs font-extrabold text-slate-800 mt-1">
                  24 - 27 May, 2025
                </p>
              </div>

              {/* Trust Items List (Matching Image 3) */}
              <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#0645B5]" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#0645B5]" />
                  <span>7 Days Replacement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones size={16} className="text-[#0645B5]" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Tabbed Specs Section & Recommended Products Row (Exact Match with Image 3) */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          
          {/* Tabbed Info Box (Col 8) */}
          <div className="lg:col-span-8 rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
              {[
                { id: "details", label: "Product Details" },
                { id: "usage", label: "How to Use" },
                { id: "ingredients", label: "Ingredients" },
                { id: "reviews", label: "Reviews (1,256)" },
                { id: "faqs", label: "FAQs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap transition border-b-2 ${
                    activeTab === tab.id
                      ? "border-[#0645B5] text-[#0645B5]"
                      : "border-transparent text-slate-500 hover:text-[#0645B5]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div className="mt-6 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeTab === "details" && (
                <div className="space-y-4">
                  <p>
                    Matrin Detergent Liquid is specially formulated with plant-based cleaning agents that penetrate deep into fabric to remove tough stains and dirt. It is gentle on clothes and keeps them bright, fresh and long-lasting.
                  </p>

                  {/* 4 Feature Icon Badges Box inside tab (Exact Image 3) */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/60">
                      <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#0645B5] flex items-center justify-center shrink-0">
                        <Droplet size={18} />
                      </div>
                      <div>
                        <div className="font-extrabold text-[#102A5C] text-xs">Suitable for Load</div>
                        <div className="text-[10px] text-slate-500">Top Load & Front Load</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/60">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <div className="font-extrabold text-[#102A5C] text-xs">No Harmful Chemicals</div>
                        <div className="text-[10px] text-slate-500">Zero phosphates or parabens</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/60">
                      <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <div className="font-extrabold text-[#102A5C] text-xs">Works in Hard Water</div>
                        <div className="text-[10px] text-slate-500">Fast lather & easy rinse</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/60">
                      <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Leaf size={18} />
                      </div>
                      <div>
                        <div className="font-extrabold text-[#102A5C] text-xs">Biodegradable Formula</div>
                        <div className="text-[10px] text-slate-500">100% Eco-safe wash</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "usage" && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#102A5C]">Machine Wash (Front & Top Load):</h4>
                  <p>Pour 1 capful (40ml) for standard 4-5 kg wash loads directly into liquid wash tray.</p>
                  <h4 className="font-bold text-[#102A5C] pt-2">Hand Wash:</h4>
                  <p>Mix 1 capful in 10 liters of water. Soak clothes for 20 mins and rinse thoroughly.</p>
                </div>
              )}

              {activeTab === "ingredients" && (
                <p>
                  Plant-derived surfactants, bio-enzymes, natural lavender extracts, fabric protection polymers, coconut-based lather boosters, demineralized water.
                </p>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60">
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>Priya S.</span>
                      <span className="text-amber-500">★★★★★</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">Great liquid detergent! Clothes smell amazing and feel super soft.</p>
                  </div>
                </div>
              )}

              {activeTab === "faqs" && (
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-[#102A5C]">Is it safe for baby clothes?</p>
                  <p>Yes, Matrin detergent is non-toxic and hypoallergenic, making it completely safe for infant clothes.</p>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Right "You may also like" Mini Cards Column (Col 4 matching Image 3) */}
          <div className="lg:col-span-4 rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-[#102A5C] text-sm">
                You may also like
              </h3>
              <Link href="/products" className="text-xs font-bold text-[#0645B5] hover:underline">
                View All
              </Link>
            </div>

            {/* Mini Recommended Products List */}
            <div className="space-y-3">
              {[
                {
                  id: 2,
                  name: "Matrin Dishwash Liquid 500ml",
                  price: "₹149",
                  image: "/images/products/dishwash.webp",
                },
                {
                  id: 3,
                  name: "Matrin Floor Cleaner Lavender 1L",
                  price: "₹199",
                  image: "/images/products/floor-cleaner.webp",
                },
                {
                  id: 4,
                  name: "Matrin Toilet Cleaner 500ml",
                  price: "₹129",
                  image: "/images/products/toilet-cleaner.webp",
                },
              ].map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition group"
                >
                  <div className="h-16 w-16 shrink-0">
                    <ProductImage src={item.image} alt={item.name} fitMode="cover" roundedClassName="rounded-xl" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#102A5C] line-clamp-1 group-hover:text-[#0645B5] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs font-extrabold text-[#0645B5] mt-1">
                      {item.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
