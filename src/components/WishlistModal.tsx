"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import ProductImage from "./ProductImage";
import { Heart, X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const { wishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    toggleWishlist(product);
    toast.success(`Moved ${product.name} to Cart!`, { icon: "🛍️" });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
                  <Heart size={18} fill="#E11D48" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#102A5C]">My Wishlist</h2>
                  <p className="text-xs font-semibold text-[#5F6B7A]">{wishlistCount} saved items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition border border-[#DCE8F5]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center border border-rose-100">
                    <Heart size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-[#102A5C]">Your Wishlist is Empty</h3>
                    <p className="text-xs text-[#5F6B7A] font-medium max-w-xs">
                      Explore our eco-friendly cleaning lineup and save your favorite items here!
                    </p>
                  </div>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0645B5] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#043694] transition active:scale-95"
                  >
                    <span>Explore Products</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#DCE8F5]">
                  {wishlist.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4">
                      {/* Product Thumbnail */}
                      <div className="h-16 w-16 shrink-0">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          fitMode="contain"
                          roundedClassName="rounded-xl"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#5F6B7A] uppercase tracking-wider">{item.category}</div>
                        <h4 className="text-xs font-extrabold text-[#102A5C] truncate">{item.name}</h4>
                        <div className="text-xs font-extrabold text-[#0645B5] mt-1">₹{item.price}</div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0645B5] text-white text-xs font-bold shadow-xs hover:bg-[#043694] transition active:scale-95 shrink-0"
                          title="Move to Cart"
                        >
                          <ShoppingBag size={14} />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="h-8 w-8 rounded-xl bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition shrink-0"
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div className="p-5 border-t border-[#DCE8F5] bg-slate-50/80 space-y-3">
                <Link
                  href="/products"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0645B5] py-3 text-xs font-bold text-white shadow-md hover:bg-[#043694] transition active:scale-98"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
