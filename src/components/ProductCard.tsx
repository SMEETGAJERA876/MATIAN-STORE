import { Product } from "@/types/product";
import { useCart, getProductAvailableStock } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import QuickViewModal from "./QuickViewModal";
import ProductImage from "./ProductImage";
import { getProductSizes, getProductSizePrice, getVariantProduct } from "@/utils/productVariants";

interface ProductCardProps {
  product: Product;
  defaultSize?: string;
}

export default function ProductCard({ product, defaultSize }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const availableSizes = getProductSizes(product);
  const [selectedSize, setSelectedSize] = useState<string>(
    defaultSize || product.selectedSize || availableSizes[0] || "1 L"
  );

  useEffect(() => {
    if (defaultSize && availableSizes.includes(defaultSize)) {
      setSelectedSize(defaultSize);
    }
  }, [defaultSize, availableSizes]);

  const isFav = isInWishlist(product.id);
  const sizePricing = getProductSizePrice(product.price, selectedSize);
  const currentPrice = sizePricing.price;
  const currentOldPrice = sizePricing.oldPrice;
  const currentDiscount = sizePricing.discount;
  const variantProduct = getVariantProduct(product, selectedSize);

  const availableStock = getProductAvailableStock(product);
  const isOutOfStock = availableStock <= 0 || product.inStock === false;
  const isLowStock = availableStock > 0 && availableStock <= 10;

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-[#EAF0F8] p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Product Image Box Container */}
        <div className="relative w-full rounded-2xl bg-[#F0F5FA] p-4 sm:p-5 flex items-center justify-center overflow-hidden aspect-square mb-3 shadow-2xs">

          {/* Badges */}
          {isOutOfStock ? (
            <span className="absolute top-2 left-2 z-10 rounded-md bg-rose-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs">
              OUT OF STOCK
            </span>
          ) : isLowStock ? (
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
              <span className="rounded-md bg-[#0645B5] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs">
                {currentDiscount || (product.discountPercentage ? `${product.discountPercentage}% OFF` : "NEW")}
              </span>
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-2xs animate-pulse">
                Only {availableStock} left
              </span>
            </div>
          ) : (
            <span className="absolute top-2 left-2 z-10 rounded-md bg-[#0645B5] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs">
              {currentDiscount || (product.discountPercentage ? `${product.discountPercentage}% OFF` : "NEW")}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-700 transition hover:bg-white hover:text-rose-500 shadow-sm"
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
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs py-1.5 text-[11px] font-extrabold text-[#0645B5] shadow-md hover:bg-white transition cursor-pointer"
            >
              <Eye size={14} /> Quick View
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="mt-1 flex flex-1 flex-col justify-between space-y-3">
          <div>
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="text-base font-bold text-[#0645B5] transition hover:text-[#043694] line-clamp-1 leading-snug">
                {product.name.replace(/\s*\([^)]*\)/g, "")}
              </h3>
            </Link>

            {/* Rating Stars & Count */}
            <div className="mt-1 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-[#5F6B7A] font-medium">
                  ({product.reviewCount})
                </span>
              </div>

              {/* Stock Indicator Line */}
              {isOutOfStock ? (
                <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-[10px] font-extrabold text-amber-600">
                  {availableStock} left
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-600">
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* Size Variant Selector Buttons */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#5F6B7A] mb-1.5">
              <span className="uppercase tracking-wider">Size Variant:</span>
              <span className="text-[#0645B5] font-black">{selectedSize}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {availableSizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(sz);
                    }}
                    className={`py-1 text-[10px] font-extrabold rounded-lg transition-all text-center border cursor-pointer ${
                      isSelected
                        ? "border-[#0645B5] bg-[#EAF5FF] text-[#0645B5] shadow-2xs font-black ring-1 ring-[#0645B5]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Callout & Action Pill Button */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#102A5C]">
                ₹{currentPrice}
              </span>
              {currentOldPrice && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  ₹{currentOldPrice}
                </span>
              )}
            </div>

            {isOutOfStock ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-400 cursor-not-allowed opacity-90"
              >
                <span>Out of Stock</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(variantProduct)}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#0645B5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#0645B5] transition-all hover:bg-[#0645B5] hover:text-white shadow-2xs cursor-pointer active:scale-95"
              >
                <span>Add to Cart</span>
                <ShoppingBag size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={variantProduct}
          initialSize={selectedSize}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}