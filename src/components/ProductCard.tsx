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
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-100 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        
        {/* Product Image Container */}
        <div className="relative w-full">
          
          {/* Discount Badge if available */}
          {product.discountPercentage && (
            <span className="absolute top-3 left-3 z-10 rounded-lg bg-[#1E40AF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs">
              {product.discountPercentage}% OFF
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-700 transition hover:bg-white hover:text-rose-500 shadow-sm"
            title="Wishlist"
          >
            <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
          </button>

          {/* Product Image Link */}
          <Link href={`/products/${product.id}`} className="block h-full w-full">
            <ProductImage
              src={product.image}
              alt={product.name}
              fitMode="cover"
            />
          </Link>

          {/* Hover Quick View Trigger */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 px-3 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-xs py-2 text-[11px] font-bold text-[#1E40AF] shadow-md hover:bg-white transition"
            >
              <Eye size={14} /> Quick View
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="mt-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#1E40AF]">
              {product.category}
            </div>

            <Link href={`/products/${product.id}`} className="block mt-1">
              <h3 className="text-base font-extrabold text-[#0B2545] transition hover:text-[#1E40AF] line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Price Callout with Strikethrough Old Price */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-[#1E40AF]">
                ₹{product.price}
              </span>
              {product.oldPrice && (
                <span className="text-xs font-bold text-slate-400 line-through">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>

            {/* Rating Stars & Count */}
            <div className="mt-1.5 flex items-center gap-1.5 text-amber-500 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* ADD TO CART button */}
          <div className="mt-4">
            <button
              onClick={() => addToCart(product)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1E40AF] py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-[#1a3899] active:scale-98 shadow-sm shadow-blue-600/20"
            >
              <ShoppingBag size={15} /> Add to Cart
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