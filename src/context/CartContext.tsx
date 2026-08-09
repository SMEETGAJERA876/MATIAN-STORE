"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem } from "@/types/product";
import toast from "react-hot-toast";

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  total: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "matrin_cart_items";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [cart, isLoaded]);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity }];
    });

    // Auto-open Cart Drawer Slide-Over Modal when item is added!
    setIsCartDrawerOpen(true);

    toast.success(`Added ${product.name} to cart!`, {
      icon: "🛒",
      style: {
        borderRadius: "12px",
        background: "#0f172a",
        color: "#fff",
      },
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    toast("Item removed from cart", { icon: "🗑️" });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 50;

  const COUPON_RULES: Record<string, { code: string; discountType: "percentage" | "fixed"; discountValue: number; minSpend: number; description: string }> = {
    FESTIVAL10: {
      code: "FESTIVAL10",
      discountType: "percentage",
      discountValue: 10,
      minSpend: 1500,
      description: "10% Festival Discount on orders above ₹1,500",
    },
    FESTIVE5: {
      code: "FESTIVE5",
      discountType: "percentage",
      discountValue: 5,
      minSpend: 800,
      description: "5% Festive Savings on orders above ₹800",
    },
    SUPER15: {
      code: "SUPER15",
      discountType: "percentage",
      discountValue: 15,
      minSpend: 2500,
      description: "15% Mega Household Saver on orders above ₹2,500",
    },
    MATRIN20: {
      code: "MATRIN20",
      discountType: "percentage",
      discountValue: 20,
      minSpend: 499,
      description: "20% Welcome Discount on orders above ₹499",
    },
    MATRIN10: {
      code: "MATRIN10",
      discountType: "percentage",
      discountValue: 10,
      minSpend: 299,
      description: "10% Discount on orders above ₹299",
    },
    CLEAN50: {
      code: "CLEAN50",
      discountType: "fixed",
      discountValue: 50,
      minSpend: 199,
      description: "Flat ₹50 OFF on all orders",
    },
  };

  const activeRule = appliedCoupon ? COUPON_RULES[appliedCoupon] : null;

  let discountAmount = 0;
  if (activeRule && subtotal >= activeRule.minSpend) {
    if (activeRule.discountType === "percentage") {
      discountAmount = Math.round((subtotal * activeRule.discountValue) / 100);
    } else if (activeRule.discountType === "fixed") {
      discountAmount = activeRule.discountValue;
    }
  }

  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const rule = COUPON_RULES[cleanCode];

    if (!rule) {
      toast.error("Invalid coupon code. Try FESTIVAL10, FESTIVE5, SUPER15, or MATRIN20");
      return false;
    }

    if (subtotal < rule.minSpend) {
      toast.error(`Minimum order value of ₹${rule.minSpend} required for coupon ${rule.code}`);
      return false;
    }

    setAppliedCoupon(rule.code);
    const savingsMsg = rule.discountType === "percentage" ? `${rule.discountValue}% OFF` : `₹${rule.discountValue} OFF`;
    toast.success(`Coupon ${rule.code} applied! Saved ${savingsMsg}`, { icon: "🎉" });
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast("Coupon removed");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shippingFee,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        total,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}