"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductCategory } from "@/types/product";
import { Coupon } from "@/types/coupon";
import { SalesAnalytics } from "@/types/sales";
import { OrderInvoice } from "@/types/order";
import { products as defaultProducts } from "@/data/products";
import toast from "react-hot-toast";

const initialCoupons: Coupon[] = [
  {
    id: "cpn_1",
    code: "MATRIN10",
    discountType: "percentage",
    discountValue: 10,
    couponLimit: 100,
    timesUsed: 14,
    minOrderAmount: 299,
    isActive: true,
    createdAt: "2025-01-10",
  },
  {
    id: "cpn_2",
    code: "CLEAN50",
    discountType: "fixed",
    discountValue: 50,
    couponLimit: 50,
    timesUsed: 12,
    minOrderAmount: 399,
    isActive: true,
    createdAt: "2025-02-01",
  },
  {
    id: "cpn_3",
    code: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    couponLimit: 25,
    timesUsed: 8,
    minOrderAmount: 499,
    isActive: true,
    createdAt: "2025-03-15",
  },
];

const initialSalesData: SalesAnalytics = {
  weekly: [
    { label: "Mon", revenue: 14500, orders: 18, unitsSold: 42 },
    { label: "Tue", revenue: 18900, orders: 24, unitsSold: 58 },
    { label: "Wed", revenue: 12400, orders: 15, unitsSold: 36 },
    { label: "Thu", revenue: 22100, orders: 29, unitsSold: 71 },
    { label: "Fri", revenue: 28500, orders: 38, unitsSold: 89 },
    { label: "Sat", revenue: 34200, orders: 46, unitsSold: 112 },
    { label: "Sun", revenue: 31000, orders: 41, unitsSold: 98 },
  ],
  monthly: [
    { label: "Jan", revenue: 320000, orders: 410, unitsSold: 1020 },
    { label: "Feb", revenue: 380000, orders: 490, unitsSold: 1250 },
    { label: "Mar", revenue: 420000, orders: 540, unitsSold: 1380 },
    { label: "Apr", revenue: 390000, orders: 510, unitsSold: 1290 },
    { label: "May", revenue: 480000, orders: 620, unitsSold: 1560 },
    { label: "Jun", revenue: 530000, orders: 690, unitsSold: 1740 },
    { label: "Jul", revenue: 610000, orders: 780, unitsSold: 1980 },
    { label: "Aug", revenue: 590000, orders: 750, unitsSold: 1890 },
    { label: "Sep", revenue: 640000, orders: 810, unitsSold: 2050 },
    { label: "Oct", revenue: 710000, orders: 900, unitsSold: 2310 },
    { label: "Nov", revenue: 790000, orders: 1010, unitsSold: 2580 },
    { label: "Dec", revenue: 890000, orders: 1150, unitsSold: 2920 },
  ],
  yearly: [
    { label: "2021", revenue: 1850000, orders: 2400, unitsSold: 6100 },
    { label: "2022", revenue: 3400000, orders: 4350, unitsSold: 11200 },
    { label: "2023", revenue: 5200000, orders: 6700, unitsSold: 17400 },
    { label: "2024", revenue: 7450000, orders: 9500, unitsSold: 24300 },
    { label: "2025", revenue: 9800000, orders: 12600, unitsSold: 32100 },
  ],
  summary: {
    totalRevenue: 9800000,
    totalOrders: 12600,
    activeCustomers: 4850,
    averageOrderValue: 778,
    topCategory: "Laundry Care",
  },
};

export interface ProductStoreContextType {
  products: Product[];
  coupons: Coupon[];
  orders: OrderInvoice[];
  salesAnalytics: SalesAnalytics;
  addProduct: (newProd: Omit<Product, "id" | "rating" | "reviewCount" | "reviews">) => Product;
  updateProduct: (id: number, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  toggleStock: (id: number) => void;
  addCoupon: (coupon: Omit<Coupon, "id" | "timesUsed" | "createdAt">) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  validateCoupon: (code: string, cartTotal: number) => { valid: boolean; coupon?: Coupon; message: string };
  applyCouponRedemption: (code: string) => void;
  addOrder: (invoice: OrderInvoice) => void;
}

const ProductStoreContext = createContext<ProductStoreContextType | undefined>(undefined);

export function ProductStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [orders, setOrders] = useState<OrderInvoice[]>([]);
  const [salesAnalytics] = useState<SalesAnalytics>(initialSalesData);

  // Load stored state from localStorage on mount
  useEffect(() => {
    try {
      const storedProds = localStorage.getItem("matrin_dynamic_products");
      if (storedProds) {
        setProducts(JSON.parse(storedProds));
      }
      const storedCoupons = localStorage.getItem("matrin_dynamic_coupons");
      if (storedCoupons) {
        setCoupons(JSON.parse(storedCoupons));
      }
      const storedOrders = localStorage.getItem("matrin_placed_orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (e) {
      console.error("Failed to load store data from localStorage:", e);
    }
  }, []);

  const addOrder = (newInvoice: OrderInvoice) => {
    const updated = [newInvoice, ...orders];
    setOrders(updated);
    try {
      localStorage.setItem("matrin_placed_orders", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save placed order:", e);
    }
  };

  const saveProducts = (updatedProds: Product[]) => {
    setProducts(updatedProds);
    localStorage.setItem("matrin_dynamic_products", JSON.stringify(updatedProds));
  };

  const saveCoupons = (updatedCoupons: Coupon[]) => {
    setCoupons(updatedCoupons);
    localStorage.setItem("matrin_dynamic_coupons", JSON.stringify(updatedCoupons));
  };

  const addProduct = (prodData: Omit<Product, "id" | "rating" | "reviewCount" | "reviews">): Product => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct: Product = {
      ...prodData,
      id: newId,
      rating: 5.0,
      reviewCount: 1,
      reviews: [
        {
          id: `rev_${Date.now()}`,
          userName: "Verified Customer",
          rating: 5,
          date: new Date().toISOString().split("T")[0],
          comment: "Excellent performance and great smell!",
          verifiedPurchase: true,
        },
      ],
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
    toast.success(`Product "${newProduct.name}" added successfully!`, { icon: "📦" });
    return newProduct;
  };

  const updateProduct = (id: number, updatedFields: Partial<Product>) => {
    const updated = products.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
    saveProducts(updated);
    toast.success("Product updated successfully!");
  };

  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
    toast.success("Product deleted successfully");
  };

  const toggleStock = (id: number) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextInStock = !p.inStock;
        return {
          ...p,
          inStock: nextInStock,
          stockCount: nextInStock ? 50 : 0,
        };
      }
      return p;
    });
    saveProducts(updated);
    toast.success("Stock status updated");
  };

  const addCoupon = (couponData: Omit<Coupon, "id" | "timesUsed" | "createdAt">) => {
    const cleanCode = couponData.code.trim().toUpperCase();
    if (coupons.some(c => c.code === cleanCode)) {
      toast.error("Coupon code already exists!");
      return;
    }
    const newCoupon: Coupon = {
      ...couponData,
      code: cleanCode,
      id: `cpn_${Date.now()}`,
      timesUsed: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newCoupon, ...coupons];
    saveCoupons(updated);
    toast.success(`Coupon code "${newCoupon.code}" created!`, { icon: "🏷️" });
  };

  const deleteCoupon = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    saveCoupons(updated);
    toast.success("Coupon code deleted");
  };

  const toggleCouponStatus = (id: string) => {
    const updated = coupons.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    saveCoupons(updated);
    toast.success("Coupon status updated");
  };

  const validateCoupon = (
    code: string,
    cartTotal: number
  ): { valid: boolean; coupon?: Coupon; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code === cleanCode);

    if (!coupon) {
      return { valid: false, message: "Invalid coupon code!" };
    }
    if (!coupon.isActive) {
      return { valid: false, message: "This coupon code is currently inactive." };
    }
    if (coupon.timesUsed >= coupon.couponLimit) {
      return { valid: false, message: `Coupon usage limit of ${coupon.couponLimit} redemptions reached!` };
    }
    if (cartTotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}.`,
      };
    }

    return { valid: true, coupon, message: "Coupon applied successfully!" };
  };

  const applyCouponRedemption = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const updated = coupons.map(c => (c.code === cleanCode ? { ...c, timesUsed: c.timesUsed + 1 } : c));
    saveCoupons(updated);
  };

  return (
    <ProductStoreContext.Provider
      value={{
        products,
        coupons,
        orders,
        salesAnalytics,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        addCoupon,
        deleteCoupon,
        toggleCouponStatus,
        validateCoupon,
        applyCouponRedemption,
        addOrder,
      }}
    >
      {children}
    </ProductStoreContext.Provider>
  );
}

export function useProductStore() {
  const context = useContext(ProductStoreContext);
  if (!context) {
    throw new Error("useProductStore must be used within a ProductStoreProvider");
  }
  return context;
}
