export type ModuleType =
  | 'dashboard'
  | 'products'
  | 'product-details'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'reviews'
  | 'promotions'
  | 'analytics'
  | 'sales-reports'
  | 'revenue'
  | 'marketing'
  | 'shipping'
  | 'returns'
  | 'suppliers'
  | 'warehouse'
  | 'finance'
  | 'employees'
  | 'support-tickets'
  | 'notifications'
  | 'security'
  | 'ai-insights'
  | 'settings';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  gst: number; // percentage
  stock: number;
  reservedStock: number;
  warehouse: string;
  vendor: string;
  weight: string; // e.g. "1.2 kg"
  dimensions: string; // e.g. "20x15x10 cm"
  visibility: 'Published' | 'Draft' | 'Hidden';
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
  image: string;
  description?: string;
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  parentCategory: string;
  productCount: number;
  revenue: number;
  status: 'Active' | 'Draft' | 'Inactive';
  topLevel?: boolean;
  subcategories: string[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#MTR-8902"
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  date: string;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  shippingStatus: 'Delivered' | 'In Transit' | 'Processing' | 'Cancelled' | 'Returned';
  items: OrderItem[];
  shippingAddress: string;
  courier?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  segment: 'VIP' | 'Returning' | 'New' | 'Inactive';
  status: 'Active' | 'Blocked' | 'Pending';
  joinDate: string;
  lifetimeValue: number;
  recentPurchases: Array<{
    id: string;
    productName: string;
    amount: number;
    date: string;
  }>;
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  productName: string;
  rating: number;
  reviewText: string;
  date: string;
  status: 'Published' | 'Pending' | 'Flagged' | 'Rejected';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface Promotion {
  id: string;
  code: string;
  incentiveType: 'Percentage' | 'Fixed Amount' | 'Free Shipping';
  value: string; // e.g. "20%" or "$50.00"
  usageProgress: number; // e.g. 420
  usageLimit: number; // e.g. 500
  expiryDate: string;
  status: 'Active' | 'Scheduled' | 'Archived' | 'Expired';
  revenueAttributed: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  currentStock: number;
  reserved: number;
  criticalLevel: number;
  incoming: number;
  outgoing: number;
  status: 'Healthy' | 'Low Stock' | 'Critical';
  lastRestocked: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  leadTimeDays: number;
  status: 'Active' | 'On Hold' | 'Under Review';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Warehouse' | 'Support' | 'Accountant' | 'Editor';
  department: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  lastActive: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  category: 'Billing' | 'Shipping' | 'Product Issue' | 'General';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'order' | 'inventory' | 'review' | 'system' | 'security';
  read: boolean;
  priority: 'high' | 'medium' | 'normal';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  companyName: string;
}
