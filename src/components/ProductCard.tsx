import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Eye } from "lucide-react";
import { useState } from "react";
import QuickViewModal from "./QuickViewModal";

import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isFav = isInWishlist(product.id);

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-[#152238] border border-[#EAF0F8] dark:border-[#233554] p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Product Image Box Container (Exact bg-[#F0F5FA] Light Blue Box from Reference Image) */}
        <div className="relative w-full rounded-2xl bg-[#F0F5FA] dark:bg-[#1A2A44] p-4 sm:p-5 flex items-center justify-center overflow-hidden aspect-square mb-3 shadow-2xs">

          {/* NEW / Discount Badge matching reference image */}
          <span className="absolute top-2 left-2 z-10 rounded-md bg-[#0645B5] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs">
            {product.discountPercentage ? `${product.discountPercentage}% OFF` : "NEW"}
          </span>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs text-slate-700 dark:text-slate-200 transition hover:bg-white dark:hover:bg-slate-700 hover:text-rose-500 shadow-sm"
            title="Wishlist"
          >
            <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
          </button>

          {/* Product Image Link */}
          <Link href={`/products/${product.id}`} className="block h-full w-full flex items-center justify-center">
            <ProductImage
              src={product.image}
              alt={product.name}
              fitMode="contain"
              roundedClassName="rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Hover Quick View Trigger */}
          <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 px-3 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs py-1.5 text-[11px] font-extrabold text-[#0645B5] dark:text-blue-300 shadow-md hover:bg-white dark:hover:bg-slate-700 transition"
            >
              <Eye size={14} /> Quick View
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="mt-1 flex flex-1 flex-col justify-between space-y-3">
          <div>
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="text-base font-bold text-[#0645B5] dark:text-white transition hover:text-[#0645B5] dark:hover:text-blue-400 line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Rating Stars & Count matching reference image */}
            <div className="mt-1 flex items-center gap-1 text-amber-500 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-600"}
                  />
                ))}
              </div>
              <span className="text-[11px] text-[#5F6B7A] dark:text-slate-400 font-medium">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Price Callout & Action Pill Button matching Reference Image */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#102A5C] dark:text-blue-400">
                ₹{product.price}
              </span>
              {product.oldPrice && (
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 line-through">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>

            <button
              onClick={() => addToCart(product)}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#0645B5] bg-white dark:bg-[#152238] px-3.5 py-1.5 text-xs font-bold text-[#0645B5] dark:text-blue-300 transition-all hover:bg-[#0645B5] hover:text-white dark:hover:bg-[#0645B5] dark:hover:text-white shadow-2xs"
            >
              <span>Add to Cart</span>
              <ShoppingBag size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}