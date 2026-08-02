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

export const initialReviews = [
  {
    id: "rev_1",
    productId: 1,
    productName: "Ultra Liquid Detergent",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    rating: 5,
    comment: "Excellent detergent! Clothes smell amazing and stain removal is top notch.",
    date: "2026-06-15",
    status: "Approved" as const,
  },
  {
    id: "rev_2",
    productId: 2,
    productName: "Dishwash Lemon Gel",
    customerName: "Rohan V.",
    customerEmail: "rohan@example.com",
    rating: 5,
    comment: "Cuts tough grease instantly and gentle on hands.",
    date: "2026-06-20",
    status: "Approved" as const,
  },
];

export const initialOrders = [
  {
    id: "ord_1001",
    invoiceNumber: "INV-2026-1001",
    orderDate: "2026-07-28",
    dueDate: "2026-07-28",
    customer: {
      fullName: "Rohan Sharma",
      email: "user@matrin.com",
      phone: "9876543210",
      addressLine: "Flat 402, Green Acres Apt, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
    },
    items: [
      {
        product: {
          id: 1,
          name: "Ultra Liquid Detergent",
          price: 299,
          image: "/images/products/detergent.webp",
          category: "Laundry Care",
        },
        quantity: 2,
      },
    ],
    subtotal: 598,
    discountAmount: 50,
    appliedCoupon: "CLEAN50",
    shippingFee: 0,
    taxAmount: 107,
    totalAmount: 548,
    paymentMethod: "upi",
    paymentStatus: "Paid" as const,
    orderStatus: "Processing" as const,
    transactionId: "TXN-88291034",
  },
];

export const initialNotifications = [
  {
    id: "notif_1",
    title: "New Order Received",
    message: "Order #INV-2026-1001 was placed by Rohan Sharma (₹548)",
    timestamp: new Date().toISOString(),
    type: "order" as const,
    isRead: false,
    link: "/admin/orders",
  },
  {
    id: "notif_2",
    title: "Stock Alert",
    message: "Floor Cleaner Rose stock is low (8 units remaining)",
    timestamp: new Date().toISOString(),
    type: "inventory" as const,
    isRead: false,
    link: "/admin/inventory",
  },
];

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
