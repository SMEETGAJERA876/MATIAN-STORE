"use client";

import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Star,
  Heart,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const product = products.find((p) => p.id === Number(id));

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState<string>(
    product?.image || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "usage" | "reviews">(
    "specs"
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-normal text-[#0A2E4E]">
          Product Not Found
        </h1>
        <p className="mt-3 text-slate-500 text-sm">
          The requested product could not be located in our catalog.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-[#0A2E4E] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white"
        >
          Back to All Products
        </Link>
      </div>
    );
  }

  const isFav = isInWishlist(product.id);
  const gallery = [product.image, ...(product.galleryImages || [])].filter(
    (img, index, self) => self.indexOf(img) === index
  );

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-10">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8">
          <Link href="/" className="hover:text-[#0A2E4E]">
            HOME
          </Link>
          <ChevronRight size={13} />
          <Link href="/products" className="hover:text-[#0A2E4E]">
            PRODUCTS
          </Link>
          <ChevronRight size={13} />
          <span className="text-slate-400">{product.category.toUpperCase()}</span>
          <ChevronRight size={13} />
          <span className="text-[#0A2E4E] font-bold line-clamp-1">
            {product.name.toUpperCase()}
          </span>
        </nav>

        {/* Main Product Details Grid */}
        <div className="grid gap-12 lg:grid-cols-2 rounded-3xl bg-[#FAF7F2] p-6 sm:p-10 border border-[#EFEAE4]">
          
          {/* Gallery View Left */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F5F1EB] p-8 flex items-center justify-center border border-[#EFEAE4]">
              {product.discountPercentage && (
                <span className="absolute top-4 left-4 z-10 rounded-md bg-[#0A2E4E] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  {product.discountPercentage}% OFF
                </span>
              )}

              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="h-full max-h-[380px] w-auto object-contain transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Thumbnail Selectors */}
            {gallery.length > 1 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#F5F1EB] p-2 transition ${
                      selectedImage === img
                        ? "border-[#0A2E4E]"
                        : "border-[#EFEAE4] hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Content Right */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {product.category}
              </span>

              <h1 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0A2E4E] leading-tight">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="text-[#0A2E4E] text-sm">{product.rating}</span>
                </div>
                <span className="text-slate-500">
                  ({product.reviewCount} customer reviews)
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 size={13} /> In Stock ({product.stockCount} left)
                </span>
              </div>

              {/* Price Callout */}
              <div className="mt-6 flex items-baseline gap-4">
                <span className="text-4xl font-extrabold text-[#0A2E4E]">
                  ₹{product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-xl font-medium text-slate-400 line-through">
                    ₹{product.oldPrice}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="text-xs font-bold text-emerald-700">
                    Save ₹{product.oldPrice! - product.price}
                  </span>
                )}
              </div>

              <p className="mt-5 text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Highlights Bullet List */}
              <div className="mt-6 space-y-2">
                {product.features?.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700"
                  >
                    <Sparkles size={14} className="text-[#0A2E4E] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions & Quantity */}
            <div className="mt-8 pt-6 border-t border-[#EFEAE4]">
              <div className="flex flex-wrap items-center gap-4">
                
                {/* Quantity Select */}
                <div className="flex items-center rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-[#EFEAE4] font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-[#0A2E4E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-[#EFEAE4] font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0A2E4E] py-4 px-6 font-semibold uppercase tracking-wider text-white text-xs hover:bg-[#13426B] transition shadow-xs"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#E5D3C4] py-4 px-6 font-semibold uppercase tracking-wider text-[#0A2E4E] text-xs hover:bg-[#d8c3b2] transition shadow-xs"
                >
                  <Zap size={16} /> Buy Now
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                    isFav
                      ? "border-rose-200 bg-rose-50 text-rose-500"
                      : "border-[#EFEAE4] text-slate-700 hover:bg-[#F5F1EB]"
                  }`}
                  title="Wishlist"
                >
                  <Heart size={20} className={isFav ? "fill-rose-500" : ""} />
                </button>

              </div>

              {/* Trust Callouts */}
              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 pt-4 border-t border-[#EFEAE4]">
                <div className="flex flex-col items-center gap-1">
                  <Truck size={16} className="text-[#0A2E4E]" />
                  <span>Free Shipping &gt; ₹499</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={16} className="text-[#0A2E4E]" />
                  <span>99.9% Germ Defense</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw size={16} className="text-[#0A2E4E]" />
                  <span>7-Day Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specs & Reviews Section */}
        <div className="mt-12 rounded-3xl bg-[#FAF7F2] p-8 border border-[#EFEAE4]">
          <div className="flex border-b border-[#EFEAE4] gap-8">
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-4 font-serif text-lg font-bold transition border-b-2 ${
                activeTab === "specs"
                  ? "border-[#0A2E4E] text-[#0A2E4E]"
                  : "border-transparent text-slate-500 hover:text-[#0A2E4E]"
              }`}
            >
              Specifications & Info
            </button>
            <button
              onClick={() => setActiveTab("usage")}
              className={`pb-4 font-serif text-lg font-bold transition border-b-2 ${
                activeTab === "usage"
                  ? "border-[#0A2E4E] text-[#0A2E4E]"
                  : "border-transparent text-slate-500 hover:text-[#0A2E4E]"
              }`}
            >
              Usage Instructions
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 font-serif text-lg font-bold transition border-b-2 ${
                activeTab === "reviews"
                  ? "border-[#0A2E4E] text-[#0A2E4E]"
                  : "border-transparent text-slate-500 hover:text-[#0A2E4E]"
              }`}
            >
              Customer Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="mt-6 text-xs text-slate-600 font-light">
            {activeTab === "specs" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#F5F1EB] p-4 border border-[#EFEAE4]">
                  <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Volume:</span>
                  <div className="font-bold text-[#0A2E4E] text-sm mt-0.5">
                    {product.specifications.volume}
                  </div>
                </div>
                <div className="rounded-xl bg-[#F5F1EB] p-4 border border-[#EFEAE4]">
                  <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Fragrance:</span>
                  <div className="font-bold text-[#0A2E4E] text-sm mt-0.5">
                    {product.specifications.scent}
                  </div>
                </div>
                <div className="rounded-xl bg-[#F5F1EB] p-4 border border-[#EFEAE4]">
                  <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Shelf Life:</span>
                  <div className="font-bold text-[#0A2E4E] text-sm mt-0.5">
                    {product.specifications.shelfLife}
                  </div>
                </div>
                <div className="rounded-xl bg-[#F5F1EB] p-4 border border-[#EFEAE4]">
                  <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Formulation:</span>
                  <div className="font-bold text-[#0A2E4E] text-sm mt-0.5">
                    {product.specifications.formulation}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "usage" && (
              <div className="rounded-xl bg-[#F5F1EB] p-6 leading-relaxed border border-[#EFEAE4]">
                <h3 className="font-serif text-lg font-bold text-[#0A2E4E] mb-2">
                  How to Use {product.name}:
                </h3>
                <p className="text-slate-700">{product.specifications.usageInstructions}</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-[#EFEAE4] bg-[#F5F1EB] p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0A2E4E]">
                            {rev.userName}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold uppercase">
                              <CheckCircle2 size={11} /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="mt-1.5 flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-slate-700 font-serif italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No reviews yet for this product.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">RECOMMENDED</span>
            <h3 className="font-serif text-3xl font-normal text-[#0A2E4E] mb-8 mt-1">
              You Might Also Like
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
