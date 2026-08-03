import { products as defaultProducts } from "@/data/products";
import { hashPassword } from "./auth";

export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "CUSTOMER";
  avatar?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  status: "Active" | "Blocked";
}

export const initialUsers: MemoryUser[] = [
  {
    id: "usr_admin_01",
    name: "MATRIN Administrator",
    email: "admin@matrin.com",
    password: hashPassword("Admin123!"),
    role: "ADMIN" as const,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    createdAt: "2025-01-01",
    totalOrders: 0,
    totalSpent: 0,
    status: "Active" as "Active" | "Blocked",
  },
  {
    id: "usr_cust_01",
    name: "Standard Customer",
    email: "user@matrin.com",
    password: hashPassword("User123!"),
    role: "CUSTOMER" as const,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    createdAt: "2025-05-01",
    totalOrders: 2,
    totalSpent: 1290,
    status: "Active" as "Active" | "Blocked",
  },
];

export const initialCategories = [
  { id: "cat_1", name: "Laundry Care", slug: "laundry-care", description: "Detergents & Fabric Softeners", iconName: "Shirt", productCount: 4, isActive: true, status: "Active" as const },
  { id: "cat_2", name: "Dish Care", slug: "dish-care", description: "Dishwash Gels & Paste", iconName: "Sparkles", productCount: 2, isActive: true, status: "Active" as const },
  { id: "cat_3", name: "Floor Care", slug: "floor-care", description: "Disinfectant Floor Cleaners", iconName: "Brush", productCount: 2, isActive: true, status: "Active" as const },
  { id: "cat_4", name: "Toilet Care", slug: "toilet-care", description: "Power Cleaner Gels", iconName: "Droplet", productCount: 2, isActive: true, status: "Active" as const },
];

export const initialCoupons = [
  {
    id: "cpn_1",
    code: "MATRIN10",
    description: "Get 10% discount on orders above ₹299",
    discountType: "percentage" as const,
    discountValue: 10,
    minSpend: 299,
    maxDiscount: 100,
    usageCount: 14,
    usageLimit: 500,
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    isActive: true,
  },
  {
    id: "cpn_2",
    code: "CLEAN50",
    description: "Flat ₹50 OFF on all orders",
    discountType: "fixed" as const,
    discountValue: 50,
    minSpend: 199,
    usageCount: 8,
    usageLimit: 200,
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    isActive: true,
  },
];

export const initialReviews: Array<{
  id: string;
  productId: number;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
  status: "Approved" | "Pending" | "Flagged";
}> = [];

export const initialOrders: Array<{
  id: string;
  invoiceNumber: string;
  orderDate: string;
  dueDate: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    product: {
      id: number;
      name: string;
      price: number;
      image: string;
      category: string;
    };
    quantity: number;
  }>;
  subtotal: number;
  discountAmount: number;
  appliedCoupon?: string;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  transactionId?: string;
}> = [];

export const initialNotifications: Array<{
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "order" | "inventory" | "system" | "customer";
  isRead: boolean;
  link?: string;
}> = [];

export const initialSettings = {
  siteTitle: "MATRIN - Pure Cleaning, Better Living",
  contactEmail: "support@matrin.com",
  contactPhone: "+91 1800-200-8899",
  currency: "₹",
  freeShippingThreshold: 499,
  flatShippingRate: 49,
  taxRatePercentage: 18,
  banners: [
    {
      id: "bnr_1",
      title: "Pure Cleaning. Better Living.",
      subtitle: "Eco-friendly cleaning solutions tough on stains & gentle on family.",
      imageUrl: "/images/hero.webp",
      ctaText: "Shop Now",
      ctaLink: "/products",
      isActive: true,
      position: 1,
    },
  ],
};

// Global Memory Store Fallback
class MemoryStore {
  users: MemoryUser[] = [...initialUsers];
  categories = [...initialCategories];
  coupons = [...initialCoupons];
  reviews = [...initialReviews];
  orders = [...initialOrders];
  notifications = [...initialNotifications];
  settings = { ...initialSettings };
  inventoryLogs: Array<{
    id: string;
    productId: number;
    productName: string;
    previousStock: number;
    newStock: number;
    changeAmount: number;
    reason: string;
    adjustedBy: string;
    timestamp: string;
  }> = [];

  products = defaultProducts.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku || `SKU-${p.id}`,
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    price: p.price,
    originalPrice: p.oldPrice || Math.round(p.price * 1.3),
    rating: p.rating,
    reviewsCount: p.reviewCount,
    image: p.image,
    images: p.galleryImages || [p.image],
    category: p.category,
    badge: p.isBestSeller ? "Bestseller" : p.isNewArrival ? "New" : undefined,
    inStock: p.inStock,
    stock: p.stockCount || 50,
    description: p.description,
    features: p.features || [],
    specifications: p.specifications || {},
    status: "Published" as const,
    salesCount: 12,
  }));
}

declare global {
  // eslint-disable-next-line no-var
  var memoryStore: MemoryStore | undefined;
}

if (!global.memoryStore) {
  global.memoryStore = new MemoryStore();
}

export const inMemoryStore = global.memoryStore;
