"use client";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Eye } from "lucide-react";
import { useState } from "react";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isFav = isInWishlist(product.id);

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#FAF7F2] border border-[#EFEAE4] p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        
        {/* Product Image Box */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F5F1EB] p-6 flex items-center justify-center">
          
          {/* Discount Badge if available */}
          {product.discountPercentage && (
            <span className="absolute top-3 left-3 z-10 rounded-md bg-[#0A2E4E] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {product.discountPercentage}% OFF
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-xs text-slate-700 transition hover:bg-white hover:text-rose-500 shadow-xs"
            title="Wishlist"
          >
            <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
          </button>

          {/* Product Image Link */}
          <Link href={`/products/${product.id}`} className="block h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-106"
            />
          </Link>

          {/* Hover Quick View Trigger */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 px-3">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-xs py-2 text-[11px] font-semibold text-[#0A2E4E] shadow-sm hover:bg-white"
            >
              <Eye size={14} /> Quick View
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="mt-4 flex flex-1 flex-col justify-between">
          <div>
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="font-serif text-lg font-bold text-[#0A2E4E] transition hover:text-[#13426B]">
                {product.name}
              </h3>
            </Link>

            <div className="text-xs text-slate-500 font-normal mt-0.5">
              {product.specifications?.scent || product.category}
            </div>

            <div className="mt-2 text-base font-extrabold text-[#0A2E4E]">
              ₹{product.price}
            </div>

            {/* Rating Stars & Count */}
            <div className="mt-1.5 flex items-center gap-1 text-amber-500 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-500 font-medium ml-1">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Full-width ADD TO CART button */}
          <button
            onClick={() => addToCart(product)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A2E4E] py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#13426B] active:scale-98 shadow-xs"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
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