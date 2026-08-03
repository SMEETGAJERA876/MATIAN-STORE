"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductCategory } from "@/types/product";
import { Coupon } from "@/types/coupon";
import { SalesAnalytics } from "@/types/sales";
import { OrderInvoice } from "@/types/order";
import { User } from "@/types/auth";
import { products as defaultProducts } from "@/data/products";
import toast from "react-hot-toast";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  productCount: number;
  isActive: boolean;
  status?: "Active" | "Hidden";
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  position: number;
}

export interface InventoryLog {
  id: string;
  productId: number;
  productName: string;
  previousStock: number;
  newStock: number;
  changeAmount?: number;
  changeQuantity?: number;
  reason: string;
  adjustedBy: string;
  timestamp?: string;
  date?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "order" | "inventory" | "system" | "customer";
  isRead: boolean;
  link?: string;
}

export interface StoreSettings {
  siteTitle: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  taxRatePercentage: number;
  enableGuestCheckout: boolean;
  enableReviews: boolean;
  maintenanceMode: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  registeredDate: string;
  status: "Active" | "Blocked";
}

export interface ProductReview {
  id: string;
  productId: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: "Approved" | "Pending" | "Flagged";
  adminResponse?: string;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "cat_1", name: "Laundry Care", slug: "laundry-care", description: "Detergents & Fabric Softeners", iconName: "Shirt", productCount: 4, isActive: true, status: "Active" },
  { id: "cat_2", name: "Dish Care", slug: "dish-care", description: "Dishwash Gels & Paste", iconName: "Sparkles", productCount: 2, isActive: true, status: "Active" },
  { id: "cat_3", name: "Floor Care", slug: "floor-care", description: "Disinfectant Floor Cleaners", iconName: "Brush", productCount: 2, isActive: true, status: "Active" },
  { id: "cat_4", name: "Toilet Care", slug: "toilet-care", description: "Power Cleaner Gels", iconName: "Droplet", productCount: 2, isActive: true, status: "Active" },
];

const INITIAL_COUPONS: Coupon[] = [
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
    expiryDate: "2026-12-31",
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
    expiryDate: "2026-11-30",
  },
];

interface ProductStoreContextType {
  products: Product[];
  categories: CategoryItem[];
  banners: BannerItem[];
  orders: OrderInvoice[];
  customers: CustomerRecord[];
  coupons: Coupon[];
  inventoryLogs: InventoryLog[];
  notifications: AdminNotification[];
  reviews: ProductReview[];
  salesAnalytics: SalesAnalytics;
  settings: StoreSettings;
  staffUsers: User[];

  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  toggleStock: (id: number) => void;
  toggleFeatured: (id: number) => void;

  addCategory: (category: Omit<CategoryItem, "id" | "productCount">) => void;
  updateCategory: (id: string, category: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;

  addBanner: (banner: Omit<BannerItem, "id">) => void;
  updateBanner: (id: string, banner: Partial<BannerItem>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;

  addOrder: (order: OrderInvoice) => void;
  updateOrderStatus: (id: string, status: "Paid" | "Pending" | "Shipped" | "Cash on Delivery" | "Delivered" | "Cancelled" | "Refunded") => void;
  cancelOrder: (id: string) => void;
  processRefund: (id: string) => void;

  toggleBlockCustomer: (id: string) => void;
  addCustomer: (customer: Omit<CustomerRecord, "id" | "totalOrders" | "totalSpent" | "registeredDate">) => void;

  addCoupon: (coupon: Omit<Coupon, "id" | "timesUsed" | "createdAt">) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  validateCoupon: (code: string, orderSubtotal: number) => { valid: boolean; coupon?: Coupon; message?: string };
  applyCouponRedemption: (code: string) => void;

  updateInventoryStock: (productId: number, quantityChange: number, reason: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<AdminNotification, "id" | "timestamp" | "isRead">) => void;

  approveReview: (id: string) => void;
  flagReview: (id: string) => void;
  deleteReview: (id: string) => void;
  respondToReview: (id: string, response: string) => void;

  updateStoreSettings: (settings: Partial<StoreSettings>) => void;

  addStaffUser: (user: Omit<User, "id">) => void;
  updateStaffRole: (id: string, role: "ADMIN" | "CUSTOMER") => void;
  deleteStaffUser: (id: string) => void;
}

const ProductStoreContext = createContext<ProductStoreContextType | undefined>(undefined);

export function ProductStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [orders, setOrders] = useState<OrderInvoice[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    siteTitle: "MATRIN Store",
    contactEmail: "support@matrin.com",
    contactPhone: "+91 98765 43210",
    currency: "₹",
    freeShippingThreshold: 499,
    flatShippingRate: 49,
    taxRatePercentage: 18,
    enableGuestCheckout: true,
    enableReviews: true,
    maintenanceMode: false,
  });
  const [staffUsers, setStaffUsers] = useState<User[]>([]);

  // Analytics
  const salesAnalytics: SalesAnalytics = {
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
    ],
    yearly: [
      { label: "2024", revenue: 7450000, orders: 9500, unitsSold: 24300 },
      { label: "2025", revenue: 9800000, orders: 12600, unitsSold: 32100 },
    ],
    summary: {
      totalRevenue: orders.reduce((acc, o) => acc + o.totalAmount, 0) || 980000,
      totalOrders: orders.length || 42,
      activeCustomers: customers.length || 18,
      averageOrderValue: 778,
      topCategory: "Laundry Care",
    },
  };

  // Fetch initial data from APIs on load
  const refreshStoreData = async () => {
    try {
      const [resProd, resCat, resOrd, resCpn, resRev, resSet, resNotif, resInv] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/orders"),
        fetch("/api/coupons"),
        fetch("/api/reviews"),
        fetch("/api/settings"),
        fetch("/api/notifications"),
        fetch("/api/inventory"),
      ]);

      if (resProd.ok) {
        const prodData = await resProd.json();
        if (Array.isArray(prodData) && prodData.length > 0) {
          setProducts(
            prodData.map((p) => ({
              id: p.id,
              name: p.name,
              category: p.category as ProductCategory,
              price: p.price,
              oldPrice: p.originalPrice,
              discountPercentage: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
              rating: p.rating || 4.8,
              reviewCount: p.reviewsCount || 10,
              image: p.image,
              galleryImages: p.images || [p.image],
              description: p.description,
              features: p.features || [],
              specifications: p.specifications || {},
              inStock: p.inStock,
              stockCount: p.stock,
              isFeatured: true,
              isBestSeller: p.badge === "Bestseller",
              isNewArrival: p.badge === "New",
              tags: ["Cleaning", p.category],
            }))
          );
        }
      }

      if (resCat.ok) {
        const catData = await resCat.json();
        if (Array.isArray(catData) && catData.length > 0) setCategories(catData);
      }

      if (resOrd.ok) {
        const ordData = await resOrd.json();
        if (Array.isArray(ordData)) setOrders(ordData);
      }

      if (resCpn.ok) {
        const cpnData = await resCpn.json();
        if (Array.isArray(cpnData)) setCoupons(cpnData);
      }

      if (resRev.ok) {
        const revData = await resRev.json();
        if (Array.isArray(revData)) setReviews(revData);
      }

      if (resNotif.ok) {
        const notifData = await resNotif.json();
        if (Array.isArray(notifData)) setNotifications(notifData);
      }

      if (resInv.ok) {
        const invData = await resInv.json();
        if (invData.logs) setInventoryLogs(invData.logs);
      }
    } catch (err) {
      console.error("Failed to sync store data with API:", err);
    }
  };

  useEffect(() => {
    refreshStoreData();
  }, []);

  // Products CRUD
  const addProduct = async (prod: Omit<Product, "id">) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod),
      });
      if (res.ok) {
        toast.success("Product added successfully!");
        refreshStoreData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProduct = async (id: number, prod: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod),
      });
      if (res.ok) {
        toast.success("Product updated!");
        refreshStoreData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        refreshStoreData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStock = (id: number) => {
    const prod = products.find((p) => p.id === id);
    if (prod) updateProduct(id, { inStock: !prod.inStock });
  };

  const toggleFeatured = (id: number) => {
    const prod = products.find((p) => p.id === id);
    if (prod) updateProduct(id, { isFeatured: !prod.isFeatured });
  };

  // Categories CRUD
  const addCategory = async (cat: Omit<CategoryItem, "id" | "productCount">) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      if (res.ok) {
        toast.success("Category added!");
        refreshStoreData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCategory = async (id: string, cat: Partial<CategoryItem>) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      if (res.ok) refreshStoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) refreshStoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCategoryStatus = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) updateCategory(id, { isActive: !cat.isActive });
  };

  // Banner CRUD
  const addBanner = (b: Omit<BannerItem, "id">) => setBanners((prev) => [...prev, { ...b, id: `bnr_${Date.now()}` }]);
  const updateBanner = (id: string, b: Partial<BannerItem>) => setBanners((prev) => prev.map((item) => (item.id === id ? { ...item, ...b } : item)));
  const deleteBanner = (id: string) => setBanners((prev) => prev.filter((item) => item.id !== id));
  const toggleBannerStatus = (id: string) => setBanners((prev) => prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item)));

  // Orders CRUD
  const addOrder = async (order: OrderInvoice) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (res.ok) {
        refreshStoreData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateOrderStatus = async (id: string, status: "Paid" | "Pending" | "Shipped" | "Cash on Delivery" | "Delivered" | "Cancelled" | "Refunded") => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: status }),
      });
      if (res.ok) refreshStoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const cancelOrder = (id: string) => updateOrderStatus(id, "Pending");
  const processRefund = (id: string) => updateOrderStatus(id, "Pending");

  // Customers
  const toggleBlockCustomer = (id: string) => setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === "Active" ? "Blocked" : "Active" } : c)));
  const addCustomer = (c: Omit<CustomerRecord, "id" | "totalOrders" | "totalSpent" | "registeredDate">) => {
    setCustomers((prev) => [
      ...prev,
      { ...c, id: `cust_${Date.now()}`, totalOrders: 0, totalSpent: 0, registeredDate: new Date().toISOString().split("T")[0] },
    ]);
  };

  // Coupons
  const addCoupon = async (cpn: Omit<Coupon, "id" | "timesUsed" | "createdAt">) => {
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cpn),
      });
      if (res.ok) {
        toast.success("Coupon created!");
        refreshStoreData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCoupon = async (id: string, cpn: Partial<Coupon>) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cpn),
      });
      if (res.ok) refreshStoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) refreshStoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCouponStatus = (id: string) => {
    const cpn = coupons.find((c) => c.id === id);
    if (cpn) updateCoupon(id, { isActive: !cpn.isActive });
  };

  const validateCoupon = (code: string, subtotal: number) => {
    const clean = code.trim().toUpperCase();
    const cpn = coupons.find((c) => c.code.toUpperCase() === clean);

    if (!cpn) return { valid: false, message: "Invalid coupon code." };
    if (!cpn.isActive) return { valid: false, message: "Coupon is inactive." };
    if (cpn.minOrderAmount && subtotal < cpn.minOrderAmount) return { valid: false, message: `Minimum spend of ₹${cpn.minOrderAmount} required.` };

    return { valid: true, coupon: cpn };
  };

  const applyCouponRedemption = (code: string) => {
    const cpn = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (cpn) updateCoupon(cpn.id, { timesUsed: (cpn.timesUsed || 0) + 1 });
  };

  // Inventory
  const updateInventoryStock = async (productId: number, quantityChange: number, reason: string) => {
    try {
      const res = await fetch("/api/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantityToAdd: quantityChange, reason }),
      });
      if (res.ok) {
        toast.success("Stock adjusted!");
        refreshStoreData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Notifications
  const markNotificationRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  const markAllNotificationsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const deleteNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const addNotification = (n: Omit<AdminNotification, "id" | "timestamp" | "isRead">) => {
    setNotifications((prev) => [{ ...n, id: `notif_${Date.now()}`, timestamp: new Date().toISOString(), isRead: false }, ...prev]);
  };

  // Reviews
  const approveReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });
      if (res.ok) refreshStoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const flagReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Flagged" }),
      });
      if (res.ok) refreshStoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) refreshStoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const respondToReview = async (id: string, response: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminResponse: response }),
      });
      if (res.ok) refreshStoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const updateStoreSettings = (s: Partial<StoreSettings>) => setSettings((prev) => ({ ...prev, ...s }));

  const addStaffUser = (u: Omit<User, "id">) => setStaffUsers((prev) => [...prev, { ...u, id: `usr_${Date.now()}` }]);
  const updateStaffRole = (id: string, role: "ADMIN" | "CUSTOMER") => setStaffUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  const deleteStaffUser = (id: string) => setStaffUsers((prev) => prev.filter((u) => u.id !== id));

  return (
    <ProductStoreContext.Provider
      value={{
        products,
        categories,
        banners,
        orders,
        customers,
        coupons,
        inventoryLogs,
        notifications,
        reviews,
        salesAnalytics,
        settings,
        staffUsers,

        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        toggleFeatured,

        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryStatus,

        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerStatus,

        addOrder,
        updateOrderStatus,
        cancelOrder,
        processRefund,

        toggleBlockCustomer,
        addCustomer,

        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        validateCoupon,
        applyCouponRedemption,

        updateInventoryStock,

        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        addNotification,

        approveReview,
        flagReview,
        deleteReview,
        respondToReview,

        updateStoreSettings,

        addStaffUser,
        updateStaffRole,
        deleteStaffUser,
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
