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
  getRemainingStock: (product: Product) => number;
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

export function getProductAvailableStock(product: Product): number {
  if (product.inStock === false) return 0;
  if (product.stockCount !== undefined && !isNaN(Number(product.stockCount))) {
    return Math.max(0, Number(product.stockCount));
  }
  if (product.stock !== undefined && !isNaN(Number(product.stock))) {
    return Math.max(0, Number(product.stock));
  }
  return 50;
}

export function getRemainingStockForProduct(product: Product, cart: CartItem[]): number {
  const totalStock = getProductAvailableStock(product);
  if (totalStock <= 0) return 0;

  const baseId = product.baseProductId || (product.id > 1000 ? product.id % 10000 : product.id);
  const inCart = (cart || [])
    .filter(
      (item) =>
        (item.product.baseProductId || (item.product.id > 1000 ? item.product.id % 10000 : item.product.id)) === baseId
    )
    .reduce((sum, item) => sum + item.quantity, 0);

  return Math.max(0, totalStock - inCart);
}

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
    const availableStock = getProductAvailableStock(product);

    if (availableStock <= 0) {
      toast.error(`"${product.name}" is currently Out of Stock!`, { icon: "⚠️" });
      return;
    }

    const baseId = product.baseProductId || (product.id > 1000 ? product.id % 10000 : product.id);
    const currentTotalForProduct = cart
      .filter(
        (item) =>
          (item.product.baseProductId || (item.product.id > 1000 ? item.product.id % 10000 : item.product.id)) === baseId
      )
      .reduce((sum, item) => sum + item.quantity, 0);

    if (currentTotalForProduct >= availableStock) {
      toast.error(
        `Cannot add more. All ${availableStock} available bottle${availableStock === 1 ? "" : "s"} of this product are already in your cart!`,
        { icon: "⚠️" }
      );
      setIsCartDrawerOpen(true);
      return;
    }

    const maxCanAdd = Math.max(0, availableStock - currentTotalForProduct);
    const quantityToAdd = Math.min(quantity, maxCanAdd);

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantityToAdd;
        return updated;
      }

      return [...prev, { product, quantity: quantityToAdd }];
    });

    setIsCartDrawerOpen(true);

    if (quantityToAdd < quantity) {
      toast(
        `Added ${quantityToAdd} bottle${quantityToAdd === 1 ? "" : "s"} (reached maximum available stock of ${availableStock})`,
        { icon: "⚠️" }
      );
    } else {
      toast.success(
        `Added ${quantityToAdd > 1 ? `${quantityToAdd} bottles of ` : ""}${product.name} to cart!`,
        {
          icon: "🛒",
          style: {
            borderRadius: "12px",
            background: "#0f172a",
            color: "#fff",
          },
        }
      );
    }
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

    setCart((prev) => {
      const targetItem = prev.find((item) => item.product.id === productId);
      if (!targetItem) return prev;

      const availableStock = getProductAvailableStock(targetItem.product);
      const baseId =
        targetItem.product.baseProductId ||
        (targetItem.product.id > 1000 ? targetItem.product.id % 10000 : targetItem.product.id);

      const otherItemsQty = prev
        .filter(
          (item) =>
            item.product.id !== productId &&
            (item.product.baseProductId || (item.product.id > 1000 ? item.product.id % 10000 : item.product.id)) ===
              baseId
        )
        .reduce((sum, item) => sum + item.quantity, 0);

      const maxAllowedForThisItem = Math.max(0, availableStock - otherItemsQty);

      if (quantity > maxAllowedForThisItem) {
        toast.error(
          `Maximum stock limit reached! Only ${availableStock} bottle${availableStock === 1 ? "" : "s"} in stock.`,
          { icon: "⚠️" }
        );
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: maxAllowedForThisItem } : item
        );
      }

      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
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

  const [customCoupons, setCustomCoupons] = useState<Record<string, { code: string; discountType: "percentage" | "fixed"; discountValue: number; minSpend: number; description: string }>>({});

  useEffect(() => {
    const loadCoupons = () => {
      try {
        const raw = localStorage.getItem("matrin_custom_coupons");
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const map: Record<string, any> = {};
            list.forEach((c: any) => {
              const code = String(c.code).toUpperCase().trim();
              const discountValue = typeof c.value === "string" ? parseFloat(c.value.replace(/[^0-9.]/g, "")) : (c.discountValue || 10);
              const discountType = (c.incentiveType === "Fixed Amount" || c.discountType === "fixed") ? "fixed" : "percentage";
              map[code] = {
                code,
                discountType,
                discountValue: isNaN(discountValue) ? 10 : discountValue,
                minSpend: c.minSpend || 0,
                description: `${code} discount`,
              };
            });
            setCustomCoupons(map);
          }
        }
      } catch (e) {
        console.warn("Could not load custom coupons:", e);
      }
    };

    loadCoupons();
    window.addEventListener("matrin_coupons_updated", loadCoupons);
    return () => window.removeEventListener("matrin_coupons_updated", loadCoupons);
  }, []);

  const allCouponRules = { ...COUPON_RULES, ...customCoupons };
  const activeRule = appliedCoupon ? allCouponRules[appliedCoupon] : null;

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
    const rule = allCouponRules[cleanCode];

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
        getRemainingStock: (product: Product) => getRemainingStockForProduct(product, cart),
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