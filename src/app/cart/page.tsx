"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  CheckCircle2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput) {
      applyCoupon(couponInput);
      setCouponInput("");
    }
  };

  const freeShippingThreshold = 499;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl bg-[#FAF7F2] p-12 border border-[#EFEAE4]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F1EB] text-[#0A2E4E]">
              <ShoppingBag size={40} />
            </div>

            <h1 className="mt-6 font-serif text-3xl sm:text-4xl font-normal text-[#0A2E4E]">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-slate-500 max-w-md mx-auto text-xs sm:text-sm font-light leading-relaxed">
              Looks like you haven&apos;t added any Matrin cleaning products to your shopping cart yet.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0A2E4E] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#13426B] transition active:scale-95"
            >
              Explore Products
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">YOUR SELECTION</span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0A2E4E] mb-8 mt-1">
          Shopping Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
        </h1>

        {/* Free Shipping Progress Meter */}
        <div className="mb-8 rounded-2xl bg-[#F5F1EB] p-5 border border-[#EFEAE4]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#0A2E4E] mb-2">
            <span className="flex items-center gap-1.5">
              <Truck size={16} className="text-[#0A2E4E]" />
              {subtotal >= freeShippingThreshold
                ? "🎉 You unlock FREE Express Shipping!"
                : `Add ₹${amountNeededForFreeShipping} more to get FREE Express Shipping`}
            </span>
            <span>{progressToFreeShipping}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#FAF7F2]">
            <div
              className="h-full bg-[#0A2E4E] transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Cart Items List - Left */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-[#FAF7F2] p-6 border border-[#EFEAE4]"
              >
                {/* Product Thumbnail & Title */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#F5F1EB] p-2 border border-[#EFEAE4]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {product.category}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-serif text-lg font-bold text-[#0A2E4E] hover:text-[#13426B] line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-0.5 text-xs text-slate-500">
                      ₹{product.price} each
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#EFEAE4]">
                  <div className="flex items-center rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] p-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-[#EFEAE4] font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-[#0A2E4E] text-xs">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-[#EFEAE4] font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-base font-extrabold text-[#0A2E4E] w-20 text-right">
                    ₹{product.price * quantity}
                  </span>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-rose-600"
              >
                Clear Cart
              </button>

              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-wider text-[#0A2E4E] hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Card - Right */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl bg-[#0A2E4E] text-[#FAF7F2] p-6 shadow-md border border-[#13426B] sticky top-24">
              <h2 className="font-serif text-2xl font-normal text-white mb-6 border-b border-[#13426B] pb-4">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div className="mb-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 block flex items-center gap-1">
                  <Tag size={13} className="text-[#E5D3C4]" /> Promo Code
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-white/10 p-3 text-xs font-bold text-emerald-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={15} /> Code MATRIN10 (10% OFF)
                    </span>
                    <button onClick={removeCoupon} className="hover:text-rose-400">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MATRIN10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-xs uppercase font-bold text-white placeholder:text-slate-400 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#FAF7F2] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0A2E4E] hover:bg-[#E5D3C4]"
                    >
                      Apply
                    </button>
                  </form>
                )}
                <span className="text-[10px] text-slate-400 mt-1 block font-light">
                  Tip: Use code <strong className="text-[#E5D3C4]">MATRIN10</strong> for 10% discount.
                </span>
              </div>

              {/* Summary Items */}
              <div className="space-y-3 text-xs font-light border-t border-[#13426B] pt-4">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">
                    ₹{subtotal}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-white">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-4 border-t border-[#13426B]">
                  <span>Total Amount</span>
                  <span className="text-[#E5D3C4]">₹{total}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  toast.success("Order Placed Successfully! (Demo Checkout)", {
                    duration: 4000,
                    icon: "🎉",
                  });
                  clearCart();
                }}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-[#FAF7F2] py-4 text-xs font-bold uppercase tracking-widest text-[#0A2E4E] transition hover:bg-[#E5D3C4] active:scale-98 shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-light">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>256-Bit SSL Encrypted & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}