"use client";

import { Product } from "@/types/product";
import { useCart, getProductAvailableStock } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { X, Star, Heart, ShoppingBag, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ProductImage from "./ProductImage";
import { getProductSizes, getProductSizePrice, getVariantProduct } from "@/utils/productVariants";

type QuickViewModalProps = {
  product: Product | null;
  initialSize?: string;
  onClose: () => void;
};

export default function QuickViewModal({ product, initialSize, onClose }: QuickViewModalProps) {
  const { addToCart, getRemainingStock } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const availableSizes = product ? getProductSizes(product) : ["1 L"];
  const [selectedSize, setSelectedSize] = useState<string>(
    initialSize || (product ? product.selectedSize || availableSizes[0] : "1 L")
  );

  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const totalStock = product ? getProductAvailableStock(product) : 0;
  const remainingStock = product ? getRemainingStock(product) : 0;
  const isOutOfStock = totalStock <= 0 || product.inStock === false || remainingStock <= 0;
  const isStockLimitReached = totalStock > 0 && remainingStock <= 0;
  const isLowStock = remainingStock > 0 && remainingStock <= 10;

  const isFav = isInWishlist(product.id);
  const sizePricing = getProductSizePrice(product.price, selectedSize);
  const currentPrice = sizePricing.price;
  const currentOldPrice = sizePricing.oldPrice;
  const currentDiscount = sizePricing.discount;
  const variantProduct = getVariantProduct(product, selectedSize);

  const handleAddToCart = () => {
    if (isOutOfStock || remainingStock <= 0) {
      toast.error(`"${product.name}" is currently Out of Stock!`);
      return;
    }
    const qtyToAdd = Math.min(quantity, remainingStock);
    addToCart(variantProduct, qtyToAdd);
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
          className="relative w-full max-w-3xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-[#FAF7F2] border border-[#EFEAE4] shadow-2xl"
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
              <span className="absolute top-4 left-4 rounded-md bg-[#0645B5] px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                {currentDiscount || "NEW"}
              </span>

              <ProductImage
                src={product.image}
                alt={product.name}
                fitMode="cover"
              />
            </div>

            {/* Product Details Content */}
            <div className="flex flex-col justify-between p-6 md:p-8">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-800">
                  {product.category}
                </span>

                <h3 className="mt-1 font-sans text-2xl font-extrabold text-[#102A5C]">
                  {product.name.replace(/\s*\([^)]*\)/g, "")}
                </h3>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    <Star size={15} className="fill-amber-400 text-amber-400" />
                    <span className="ml-1 font-bold text-xs text-slate-900">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">
                    ({product.reviewCount} reviews)
                  </span>
                  {isOutOfStock ? (
                    <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider ml-auto">
                      {isStockLimitReached ? "Out of Stock (Limit Reached)" : "Out of Stock"}
                    </span>
                  ) : isLowStock ? (
                    <span className="text-[11px] font-extrabold text-amber-600 ml-auto">
                      Only {remainingStock} left in stock!
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 ml-auto">
                      <Check size={12} /> In Stock ({remainingStock} available)
                    </span>
                  )}
                </div>

                {/* Size Variant Selector */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-[#102A5C] mb-1.5">
                    Select Size: <span className="text-[#0645B5] font-black">{selectedSize}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSizes.map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`py-2 text-xs font-bold rounded-xl border text-center transition ${
                            isSelected
                              ? "border-[#0645B5] bg-blue-50 text-[#0645B5] font-black ring-1 ring-[#0645B5]"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-[#0645B5]">
                    ₹{currentPrice}
                  </span>
                  {currentOldPrice && (
                    <span className="text-sm font-medium text-slate-400 line-through">
                      ₹{currentOldPrice}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                  {product.description}
                </p>

                {/* Specs Pill */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-lg bg-slate-200/80 px-3 py-1.5 font-bold text-slate-900 border border-slate-300">
                    Volume: {selectedSize}
                  </span>
                  {product.specifications.scent && (
                    <span className="rounded-lg bg-slate-200/80 px-3 py-1.5 font-bold text-slate-900 border border-slate-300">
                      Scent: {product.specifications.scent}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-[#EFEAE4] pt-4">
                {/* Quantity Controls & Action */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock || quantity <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-[#EFEAE4] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-slate-800 text-xs">
                      {isOutOfStock ? 0 : Math.min(quantity, remainingStock)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (quantity < remainingStock) {
                          setQuantity(quantity + 1);
                        } else {
                          toast.error(`Stock limit reached! Only ${totalStock} bottle${totalStock === 1 ? "" : "s"} available. Product is Out of Stock for more.`);
                        }
                      }}
                      disabled={isOutOfStock || quantity >= remainingStock}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-[#EFEAE4] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {(!isOutOfStock && quantity >= remainingStock && remainingStock > 0) && (
                    <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Out of Stock (Limit reached)
                    </span>
                  )}

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
                  {isOutOfStock ? (
                    <button
                      type="button"
                      disabled
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-200 py-3 px-5 text-xs font-semibold uppercase tracking-wider text-slate-400 shadow-xs cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0645B5] py-3 px-5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#043694] active:scale-95 transition"
                    >
                      <ShoppingBag size={15} /> Add to Cart
                    </button>
                  )}

                  <Link
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center justify-center rounded-xl border border-[#0645B5] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#0645B5] hover:bg-[#0645B5] hover:text-white"
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
