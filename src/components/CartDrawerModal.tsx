"use client";

import { useCart } from "@/context/CartContext";
import ProductImage from "./ProductImage";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Truck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawerModal() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    total,
    cartCount,
    isCartDrawerOpen,
    closeCartDrawer,
  } = useCart();

  const router = useRouter();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryThreshold = 499;
  const amountNeededForFreeShipping = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleCheckoutClick = () => {
    closeCartDrawer();
    router.push("/cart");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCartDrawer}
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
                <div className="h-9 w-9 rounded-full bg-blue-50 text-[#0645B5] flex items-center justify-center border border-blue-100 shadow-2xs">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#102A5C]">Shopping Cart</h2>
                  <p className="text-xs font-semibold text-slate-500">{cartCount} items in cart</p>
                </div>
              </div>
              <button
                onClick={closeCartDrawer}
                className="h-8 w-8 rounded-full bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition border border-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-blue-100/60 text-xs">
              {amountNeededForFreeShipping > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[#102A5C] font-bold text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Truck size={14} className="text-[#0645B5]" />
                      <span>Add ₹{amountNeededForFreeShipping} more for FREE Delivery!</span>
                    </div>
                    <span>{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0645B5] rounded-full transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-[11px]">
                  <Sparkles size={15} className="text-emerald-500" />
                  <span>Congratulations! You qualify for FREE Delivery! 🎉</span>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-200/80">
                    <ShoppingBag size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-[#102A5C]">Your Cart is Empty</h3>
                    <p className="text-xs text-slate-500 font-medium max-w-xs">
                      Add eco-friendly cleaning items to your cart and they will show up here!
                    </p>
                  </div>
                  <Link
                    href="/products"
                    onClick={closeCartDrawer}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0645B5] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#1a3899] transition active:scale-95"
                  >
                    <span>Start Shopping</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="py-4 flex items-center gap-3">
                      {/* Product Thumbnail */}
                      <div className="h-16 w-16 shrink-0">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          fitMode="contain"
                          roundedClassName="rounded-xl"
                        />
                      </div>

                      {/* Details & Price */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</div>
                        <h4 className="text-xs font-extrabold text-[#102A5C] truncate">{product.name}</h4>
                        <div className="text-xs font-extrabold text-[#0645B5] mt-0.5">₹{product.price * quantity}</div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="h-6 w-6 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-800">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="h-6 w-6 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Trash Remove Action */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="h-8 w-8 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition shrink-0 border border-slate-100"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Delivery</span>
                    <span className="font-bold text-emerald-600">
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#102A5C] pt-2 border-t border-slate-200/80">
                    <span>Total</span>
                    <span className="text-[#0645B5]">₹{total}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/cart"
                    onClick={closeCartDrawer}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition"
                  >
                    View Cart
                  </Link>
                  <button
                    onClick={handleCheckoutClick}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0645B5] py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-[#1a3899] transition active:scale-98"
                  >
                    <span>Checkout</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
