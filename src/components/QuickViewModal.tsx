"use client";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { X, Star, Heart, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type QuickViewModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isFav = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#FAF7F2] border border-[#EFEAE4] shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F1EB] text-slate-700 hover:bg-[#EFEAE4]"
            aria-label="Close Quick View"
          >
            <X size={18} />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Product Image View */}
            <div className="relative bg-[#F5F1EB] p-8 flex items-center justify-center">
              {product.discountPercentage && (
                <span className="absolute top-4 left-4 rounded-md bg-[#0A2E4E] px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  {product.discountPercentage}% OFF
                </span>
              )}

              <img
                src={product.image}
                alt={product.name}
                className="max-h-72 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Product Details Content */}
            <div className="flex flex-col justify-between p-6 md:p-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {product.category}
                </span>

                <h3 className="mt-1 font-serif text-2xl font-normal text-[#0A2E4E]">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    <Star size={15} className="fill-amber-400 text-amber-400" />
                    <span className="ml-1 font-bold text-xs text-slate-800">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    ({product.reviewCount} reviews)
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1 ml-auto">
                    <Check size={12} /> In Stock
                  </span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-[#0A2E4E]">
                    ₹{product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm font-medium text-slate-400 line-through">
                      ₹{product.oldPrice}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-600 font-light leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Specs Pill */}
                <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-md bg-[#F5F1EB] px-3 py-1 font-medium text-slate-700 border border-[#EFEAE4]">
                    Volume: {product.specifications.volume}
                  </span>
                  <span className="rounded-md bg-[#F5F1EB] px-3 py-1 font-medium text-slate-700 border border-[#EFEAE4]">
                    Scent: {product.specifications.scent}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-[#EFEAE4] pt-4">
                {/* Quantity Controls & Action */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-[#EFEAE4] font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-slate-800 text-xs">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-[#EFEAE4] font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                      isFav
                        ? "border-rose-200 bg-rose-50 text-rose-500"
                        : "border-[#EFEAE4] text-slate-600 hover:bg-[#F5F1EB]"
                    }`}
                    title="Toggle Wishlist"
                  >
                    <Heart size={16} className={isFav ? "fill-rose-500" : ""} />
                  </button>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A2E4E] py-3 px-5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#13426B]"
                  >
                    <ShoppingBag size={15} /> Add to Cart
                  </button>

                  <Link
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center justify-center rounded-xl border border-[#0A2E4E] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#0A2E4E] hover:bg-[#0A2E4E] hover:text-white"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
