import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts } from '@/data/products';
import {
  ModuleType,
  Product,
  Category,
  Order,
  Customer,
  Review,
  Promotion,
  InventoryItem,
  Supplier,
  Employee,
  SupportTicket,
  NotificationItem,
  UserProfile,
  SecuritySession,
} from '../types';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  ipWhitelist: string[];
}

export interface StockMovementLog {
  id: string;
  productId?: string;
  productName: string;
  sku: string;
  quantityChange: number;
  warehouse: string;
  reason: string;
  timestamp: string;
  performedBy: string;
}

interface AdminContextType {
  // Navigation & UI State
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  
  // User profile
  user: UserProfile;
  setUser: (user: UserProfile) => void;

  // Active Drawers / Modals
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  // Editing targets (null = "add new" mode, set = "edit existing" mode)
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  editingPromotion: Promotion | null;
  setEditingPromotion: (promotion: Promotion | null) => void;

  // Modals state
  isAddProductModalOpen: boolean;
  setAddProductModalOpen: (open: boolean) => void;
  isAddCategoryModalOpen: boolean;
  setAddCategoryModalOpen: (open: boolean) => void;
  isCreateCouponModalOpen: boolean;
  setCreateCouponModalOpen: (open: boolean) => void;
  isCSVImportModalOpen: boolean;
  setCSVImportModalOpen: (open: boolean) => void;
  isAIChatOpen: boolean;
  setAIChatOpen: (open: boolean) => void;
  isStockAdjustmentModalOpen: boolean;
  setStockAdjustmentModalOpen: (open: boolean) => void;

  // Data collections
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  promotions: Promotion[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
  employees: Employee[];
  supportTickets: SupportTicket[];
  notifications: NotificationItem[];
  stockLogs: StockMovementLog[];
  securitySettings: SecuritySettings;
  activeSessions: SecuritySession[];
  warehouses: string[];

  // Mutators / Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  importProducts: (products: Partial<Product>[]) => void;

  // Warehouse Management
  addWarehouse: (name: string) => void;
  deleteWarehouse: (name: string) => void;
  cancelStockLog: (logId: string) => void;

  // Stock Management Action
  adjustProductStockByName: (
    productIdentifier: string,
    quantityToAdd: number,
    warehouse: string,
    reason: string
  ) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;

  updateOrderStatus: (id: string, paymentStatus: Order['paymentStatus'], shippingStatus: Order['shippingStatus']) => void;

  updateReviewStatus: (id: string, status: Review['status']) => void;
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, promo: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;

  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Employees
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  toggleEmployeeStatus: (id: string) => void;

  // Support Tickets
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  deleteSupportTicket: (id: string) => void;

  // Shipping & Returns (derived from Orders)
  updateShippingInfo: (
    orderId: string,
    updates: Partial<Pick<Order, 'courier' | 'trackingNumber' | 'shippingStatus'>>
  ) => void;
  processRefund: (orderId: string) => void;

  // Security
  toggleTwoFactor: () => void;
  addIpToWhitelist: (ip: string) => void;
  removeIpFromWhitelist: (ip: string) => void;
  revokeSession: (sessionId: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
}

const initialProducts: Product[] = defaultProducts.map((p) => ({
  id: String(p.id),
  name: p.name,
  sku: p.sku || `MTR-${p.category.substring(0, 4).toUpperCase()}-${p.id}`,
  barcode: `890123456789${p.id}`,
  category: p.category || 'General',
  brand: 'MATRIN Enterprise',
  price: Number(p.price) || 299,
  discountPrice: p.oldPrice,
  gst: 18,
  stock: p.stockCount || 50,
  reservedStock: 2,
  warehouse: 'Central Logistics Hub',
  vendor: 'MATRIN Systems',
  weight: p.specifications?.volume || '1.2 kg',
  dimensions: '20x15x30 cm',
  visibility: p.inStock ? 'Published' : 'Draft',
  status: (p.stockCount || 50) > 10 ? 'In Stock' : 'Low Stock',
  rating: p.rating || 4.8,
  reviewsCount: p.reviewCount || 10,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  image: p.image,
  galleryImages: p.galleryImages || [p.image],
  description: p.description || '',
  features: p.features || [],
  specifications: p.specifications || {},
  badge: p.isBestSeller ? 'Bestseller' : p.isNewArrival ? 'New' : undefined,
}));;

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Fabric Care', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80', parentCategory: '—', productCount: 342, revenue: 184200, status: 'Active', topLevel: true, subcategories: ['Steam Sanitizers', 'Garment Steamer', 'Detergent Sheets'] },
  { id: 'cat-2', name: 'Dishwashing', image: 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80', parentCategory: 'Kitchen Essentials', productCount: 128, revenue: 45800, status: 'Active', topLevel: false, subcategories: ['Countertop Sterilizers', 'Rinse Aids', 'Sonic Pods'] },
  { id: 'cat-3', name: 'Surface Cleaners', image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop&q=80', parentCategory: 'Universal Care', productCount: 215, revenue: 82400, status: 'Active', topLevel: false, subcategories: ['Granite & Stone', 'Glass Cleaner', 'Disinfectant Spray'] },
  { id: 'cat-4', name: 'Eco-Series', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80', parentCategory: 'Sustainability', productCount: 0, revenue: 0, status: 'Draft', topLevel: false, subcategories: ['Zero-Waste Pods', 'Bamboo Cloths'] },
  { id: 'cat-5', name: 'Industrial', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80', parentCategory: 'Commercial', productCount: 88, revenue: 64200, status: 'Active', topLevel: false, subcategories: ['Floor Scrubbers', 'Heavy Degreaser', 'Air Scrubbers'] },
  { id: 'cat-6', name: 'Fragrance', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80', parentCategory: 'Aromatherapy', productCount: 54, revenue: 31500, status: 'Active', topLevel: false, subcategories: ['Nebulizing Oils', 'Room Sprays', 'Reed Diffusers'] },
];

const initialOrders: Order[] = [
  { id: 'ord-1', orderNumber: '#MTR-8902', customerName: 'Jane Doe', customerEmail: 'jane.doe@example.com', customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', date: '2023-10-24', totalAmount: 425.00, paymentStatus: 'Paid', shippingStatus: 'Delivered', courier: 'FedEx Express', trackingNumber: 'FDX-994102931', shippingAddress: '742 Evergreen Terrace, Springfield, OR 97477', items: [{ productId: 'prod-4', productName: 'MATRIN Pro Dishwashing Hub', sku: 'MTR-DISH-01', quantity: 1, unitPrice: 349.00, totalPrice: 349.00 }] },
  { id: 'ord-2', orderNumber: '#MTR-8901', customerName: 'Bill Sanders', customerEmail: 'bill.sanders@techsolutions.io', customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', date: '2023-10-25', totalAmount: 1120.00, paymentStatus: 'Pending', shippingStatus: 'Processing', courier: 'UPS Ground', trackingNumber: '1Z9999999999999999', shippingAddress: '100 Silicon Way, Suite 400, Austin, TX 78701', items: [{ productId: 'prod-1', productName: 'MATRIN X1 Robotic Vacuum & Mop', sku: 'MTR-X1-ROBOT', quantity: 1, unitPrice: 899.00, totalPrice: 899.00 }] },
];

const initialCustomers: Customer[] = [
  { id: 'cust-1', name: 'Sarah Jenkins', email: 'sarah.j@enterprise.com', phone: '+1 (555) 234-5678', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', location: 'San Francisco, CA', totalOrders: 42, totalSpent: 4280.00, segment: 'VIP', status: 'Active', joinDate: '2022-01-15', lifetimeValue: 6500.00, recentPurchases: [{ id: 'p1', productName: 'MATRIN Ultra Vacuum', amount: 899.00, date: 'Oct 12, 2023' }] },
  { id: 'cust-2', name: 'Marcus Chen', email: 'm.chen@techglobal.net', phone: '+1 (555) 876-5432', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', location: 'Austin, TX', totalOrders: 12, totalSpent: 1150.45, segment: 'Returning', status: 'Active', joinDate: '2022-06-20', lifetimeValue: 2400.00, recentPurchases: [{ id: 'p4', productName: 'MATRIN Pro Robot', amount: 899.00, date: 'Oct 25, 2023' }] },
];

const initialReviews: Review[] = [
  { id: 'rev-1', customerName: 'Elena Rostova', customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', productName: 'Luxe Purifier v4', rating: 5, reviewText: 'The air quality sensor is incredibly responsive!', date: 'Oct 24, 2023', status: 'Published', sentiment: 'Positive' },
];

const initialPromotions: Promotion[] = [
  { id: 'promo-1', code: 'SUMMER2024', incentiveType: 'Percentage', value: '20%', usageProgress: 420, usageLimit: 500, expiryDate: 'Oct 30, 2024', status: 'Active', revenueAttributed: 28400 },
];

const initialInventory: InventoryItem[] = [
  { id: 'inv-1', sku: 'MTR-X1-ROBOT', name: 'MATRIN X1 Robotic Vacuum', category: 'Floor Care', warehouse: 'San Jose Hub', currentStock: 14, reserved: 2, criticalLevel: 5, incoming: 50, outgoing: 12, status: 'Healthy', lastRestocked: '2023-10-15' },
  { id: 'inv-2', sku: 'MTR-ECO-99', name: 'MATRIN Eco-Clean Refill Bundle', category: 'Eco-Series', warehouse: 'Austin Facility', currentStock: 3, reserved: 1, criticalLevel: 10, incoming: 200, outgoing: 45, status: 'Critical', lastRestocked: '2023-09-20' },
  { id: 'inv-3', sku: 'MTR-FAB-88', name: 'MATRIN Fabric Care Sanitizer', category: 'Fabric Care', warehouse: 'San Jose Hub', currentStock: 342, reserved: 15, criticalLevel: 30, incoming: 100, outgoing: 80, status: 'Healthy', lastRestocked: '2023-10-01' },
];

const initialSuppliers: Supplier[] = [
  { id: 'sup-1', name: 'MATRIN Robotics Division', contactPerson: 'Chen Wei', email: 'c.wei@robotics.matrin.com', phone: '+86 21 8892 1029', category: 'Automation & Hardware', leadTimeDays: 14, status: 'Active' },
];

const initialEmployees: Employee[] = [
  { id: 'emp-1', name: 'Alex Thompson', email: 'alex.t@matrin.com', role: 'Super Admin', department: 'Executive', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', lastActive: 'Online now' },
];

// Starts empty; real tickets load from the backend (including ones customers
// submit through the storefront Contact Us form) via the sync effect below.
const initialSupportTickets: SupportTicket[] = [];

const initialNotifications: NotificationItem[] = [
  { id: 'n-1', title: 'Low Stock Alert', description: 'MATRIN Eco-Clean Refill Bundle has dropped to 3 units.', timestamp: '10 minutes ago', type: 'inventory', read: false, priority: 'high' },
];

const initialSecuritySettings: SecuritySettings = {
  twoFactorEnabled: true,
  ipWhitelist: ['203.0.113.42', '198.51.100.17'],
};

const initialActiveSessions: SecuritySession[] = [
  { id: 'sess-1', device: 'Chrome on Windows 11', location: 'San Jose, CA', ipAddress: '203.0.113.42', lastActive: 'Active now', current: true },
  { id: 'sess-2', device: 'Safari on iPhone 15', location: 'Austin, TX', ipAddress: '198.51.100.17', lastActive: '2 hours ago' },
  { id: 'sess-3', device: 'Firefox on macOS', location: 'Chicago, IL', ipAddress: '192.0.2.88', lastActive: '1 day ago' },
];

// Starts empty rather than seeded with demo entries: those referenced the
// placeholder catalog's fictional products, which don't exist once the real
// product sync replaces it, so their "Cancel" action could never resolve.
const initialStockLogs: StockMovementLog[] = [];

const getLocalCustomProducts = (): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('matrin_custom_products');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getLocalCustomCategories = (): Category[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('matrin_custom_categories');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getLocalCustomCoupons = (): Promotion[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('matrin_custom_coupons');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('matrin_theme') === 'dark';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Thompson',
    email: 'alex.t@matrin.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    companyName: 'MATRIN Enterprise Home Care Systems',
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const [isAddProductModalOpen, setAddProductModalOpen] = useState<boolean>(false);
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState<boolean>(false);
  const [isCreateCouponModalOpen, setCreateCouponModalOpen] = useState<boolean>(false);
  const [isCSVImportModalOpen, setCSVImportModalOpen] = useState<boolean>(false);
  const [isAIChatOpen, setAIChatOpen] = useState<boolean>(false);
  const [isStockAdjustmentModalOpen, setStockAdjustmentModalOpen] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>(() => {
    const custom = getLocalCustomProducts();
    if (custom.length > 0) {
      const mapped: Product[] = custom.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        sku: p.sku || `MTR-${p.id}`,
        barcode: p.barcode || `890123456789${p.id}`,
        category: p.category || 'General',
        brand: p.brand || 'MATRIN Enterprise',
        price: Number(p.price) || 299,
        discountPrice: p.discountPrice || p.oldPrice || p.originalPrice,
        gst: 18,
        stock: (() => {
          const raw = p.stock ?? p.stockCount;
          return raw !== undefined && raw !== null && !isNaN(Number(raw)) ? Math.max(0, Number(raw)) : 100;
        })(),
        reservedStock: 0,
        warehouse: p.warehouse || 'Central Logistics Hub',
        vendor: p.vendor || 'MATRIN Systems',
        weight: p.weight || '1.2 kg',
        dimensions: p.dimensions || '20x15x30 cm',
        visibility: (p.visibility || 'Published') as 'Published',
        status: (() => {
          const raw = p.stock ?? p.stockCount;
          const s = raw !== undefined && raw !== null && !isNaN(Number(raw)) ? Number(raw) : 100;
          return (s > 10 ? 'In Stock' : s > 0 ? 'Low Stock' : 'Out of Stock') as 'In Stock';
        })(),
        rating: Number(p.rating) || 5.0,
        reviewsCount: Number(p.reviewsCount ?? p.reviewCount) || 0,
        createdAt: p.createdAt || new Date().toISOString().slice(0, 10),
        updatedAt: p.updatedAt || new Date().toISOString().slice(0, 10),
        image: p.image || 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
        galleryImages: p.galleryImages || p.images || [p.image],
        description: p.description || '',
        features: p.features || [],
        specifications: p.specifications || {},
      }));
      const merged: Product[] = [...mapped];
      initialProducts.forEach((ip) => {
        if (!merged.some((m) => m.id === ip.id || m.name.toLowerCase() === ip.name.toLowerCase())) {
          merged.push(ip);
        }
      });
      return merged;
    }
    return initialProducts;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const custom = getLocalCustomCategories();
    if (custom.length > 0) {
      const merged = [...custom];
      initialCategories.forEach((ic) => {
        if (!merged.some((m) => m.id === ic.id || m.name.toLowerCase() === ic.name.toLowerCase())) {
          merged.push(ic);
        }
      });
      return merged;
    }
    return initialCategories;
  });
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const custom = getLocalCustomCoupons();
    if (custom.length > 0) {
      const merged = [...custom];
      initialPromotions.forEach((ip) => {
        if (!merged.some((m) => m.id === ip.id || m.code.toLowerCase() === ip.code.toLowerCase())) {
          merged.push(ip);
        }
      });
      return merged;
    }
    return initialPromotions;
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [stockLogs, setStockLogs] = useState<StockMovementLog[]>(initialStockLogs);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);
  const [activeSessions, setActiveSessions] = useState<SecuritySession[]>(initialActiveSessions);
  const [warehouses, setWarehouses] = useState<string[]>([]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keep the warehouse list in sync with whatever warehouses real products
  // actually reference (once the backend sync below replaces the initial
  // placeholder catalog), without losing warehouses an admin created ahead
  // of assigning any stock to them. Skipped while `products` is still the
  // placeholder seed so its unrelated demo warehouse names never leak in.
  useEffect(() => {
    if (products === initialProducts) return;
    const namesInUse = Array.from(new Set(products.map((p) => p.warehouse).filter(Boolean)));
    setWarehouses((prev) => {
      const missing = namesInUse.filter((n) => !prev.includes(n));
      return missing.length > 0 ? [...prev, ...missing] : prev;
    });
  }, [products]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('matrin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('matrin_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync with shared backend database API
  useEffect(() => {
    async function syncBackendData() {
      try {
        const apiBase = '/api';
        const [resProd, resOrd, resCust, resTickets, resCats, resCoupons] = await Promise.all([
          fetch(`${apiBase}/products`),
          fetch(`${apiBase}/orders`),
          fetch(`${apiBase}/customers`),
          fetch(`${apiBase}/support-tickets`),
          fetch(`${apiBase}/categories`),
          fetch(`${apiBase}/coupons`),
        ]);

        if (resProd.ok) {
          const apiProducts = await resProd.json();
          if (Array.isArray(apiProducts) && apiProducts.length > 0) {
            const mappedApi: Product[] = apiProducts.map((p: any) => ({
              id: String(p.id),
              name: p.name,
              sku: p.sku || `MTR-${p.id}`,
              barcode: `890123456789${p.id}`,
              category: p.category || 'General',
              brand: 'MATRIN Enterprise',
              price: Number(p.price) || 299,
              gst: 18,
              stock: p.stock !== undefined && p.stock !== null && !isNaN(Number(p.stock)) ? Math.max(0, Number(p.stock)) : 100,
              reservedStock: 2,
              warehouse: 'Main Central Hub',
              vendor: 'MATRIN Systems',
              weight: '1.2 kg',
              dimensions: '20x15x30 cm',
              visibility: (p.stock !== undefined && Number(p.stock) <= 0) ? 'Draft' : (p.inStock ? 'Published' : 'Draft'),
              status:
                Number(p.stock) > 10
                  ? 'In Stock'
                  : Number(p.stock) > 0
                  ? 'Low Stock'
                  : 'Out of Stock',
              rating: p.rating || 4.8,
              reviewsCount: p.reviewsCount || 10,
              createdAt: p.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
              updatedAt: p.updatedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
              image: p.image || 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
              description: p.description || '',
            }));

            const custom = getLocalCustomProducts();
            if (custom.length > 0) {
              const mappedCustom: Product[] = custom.map((p: any) => ({
                id: String(p.id),
                name: p.name,
                sku: p.sku || `MTR-${p.id}`,
                barcode: p.barcode || `890123456789${p.id}`,
                category: p.category || 'General',
                brand: p.brand || 'MATRIN Enterprise',
                price: Number(p.price) || 299,
                discountPrice: p.discountPrice || p.oldPrice || p.originalPrice,
                gst: 18,
                stock: (() => {
                  const raw = p.stock ?? p.stockCount;
                  return raw !== undefined && raw !== null && !isNaN(Number(raw)) ? Math.max(0, Number(raw)) : 100;
                })(),
                reservedStock: 0,
                warehouse: p.warehouse || 'Central Logistics Hub',
                vendor: p.vendor || 'MATRIN Systems',
                weight: p.weight || '1.2 kg',
                dimensions: p.dimensions || '20x15x30 cm',
                visibility: (p.visibility || 'Published') as 'Published',
                status: (() => {
                  const raw = p.stock ?? p.stockCount;
                  const s = raw !== undefined && raw !== null && !isNaN(Number(raw)) ? Number(raw) : 100;
                  return (s > 10 ? 'In Stock' : s > 0 ? 'Low Stock' : 'Out of Stock') as 'In Stock';
                })(),
                rating: Number(p.rating) || 5.0,
                reviewsCount: Number(p.reviewsCount ?? p.reviewCount) || 0,
                createdAt: p.createdAt || new Date().toISOString().slice(0, 10),
                updatedAt: p.updatedAt || new Date().toISOString().slice(0, 10),
                image: p.image || 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
                galleryImages: p.galleryImages || p.images || [p.image],
                description: p.description || '',
                features: p.features || [],
                specifications: p.specifications || {},
              }));

              const merged = [...mappedCustom];
              mappedApi.forEach((apiP) => {
                if (!merged.some((m) => m.id === apiP.id || m.name.toLowerCase() === apiP.name.toLowerCase())) {
                  merged.push(apiP);
                }
              });
              setProducts(merged);
            } else {
              setProducts(mappedApi);
            }
          }
        }

        if (resOrd.ok) {
          const apiOrders = await resOrd.json();
          if (Array.isArray(apiOrders) && apiOrders.length > 0) {
            setOrders(
              apiOrders.map((o: any) => ({
                id: o.id,
                orderNumber: o.invoiceNumber || `#${o.id}`,
                customerName: o.customer?.fullName || 'Customer',
                customerEmail: o.customer?.email || 'customer@matrin.com',
                customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                date: o.orderDate || new Date().toISOString().slice(0, 10),
                totalAmount: Number(o.totalAmount) || 500,
                paymentStatus: o.paymentStatus === 'Paid' ? 'Paid' : 'Pending',
                shippingStatus: o.orderStatus === 'Shipped' ? 'In Transit' : 'Processing',
                courier: 'FedEx Express',
                trackingNumber: o.transactionId || 'FDX-994102931',
                shippingAddress: `${o.customer?.addressLine || ''}, ${o.customer?.city || ''}`,
                items: (o.items || []).map((it: any) => ({
                  productId: String(it.product?.id || 1),
                  productName: it.product?.name || 'Cleaning Item',
                  sku: `MTR-${it.product?.id || 1}`,
                  quantity: it.quantity || 1,
                  unitPrice: it.product?.price || 299,
                  totalPrice: (it.product?.price || 299) * (it.quantity || 1),
                })),
              }))
            );
          }
        }
        if (resCust.ok) {
          const apiCustomers = await resCust.json();
          if (Array.isArray(apiCustomers) && apiCustomers.length > 0) {
            setCustomers(
              apiCustomers.map((c: any) => ({
                id: String(c.id),
                name: c.name || 'Customer',
                email: c.email || '',
                phone: c.phone || 'N/A',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                location: 'N/A',
                totalOrders: Number(c.totalOrders) || 0,
                totalSpent: Number(c.totalSpent) || 0,
                segment: (Number(c.totalOrders) || 0) > 5 ? 'VIP' : (Number(c.totalOrders) || 0) > 0 ? 'Returning' : 'New',
                status: c.status === 'Blocked' ? 'Blocked' : 'Active',
                joinDate: c.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
                lifetimeValue: Number(c.totalSpent) || 0,
                recentPurchases: [],
              }))
            );
          }
        }
        if (resTickets.ok) {
          const apiTickets = await resTickets.json();
          if (Array.isArray(apiTickets)) {
            setSupportTickets(
              apiTickets.map((t: any) => ({
                id: t.id,
                ticketNumber: t.ticketNumber || `#TICK-${t.id}`,
                subject: t.subject || 'General Inquiry',
                customerName: t.customerName || 'Customer',
                customerEmail: t.customerEmail || '',
                customerPhone: t.customerPhone || undefined,
                message: t.message || '',
                priority: t.priority || 'Medium',
                status: t.status || 'Open',
                category: t.category || 'General',
                createdAt: t.createdAt?.slice(0, 16).replace('T', ' ') || new Date().toISOString().slice(0, 16).replace('T', ' '),
              }))
            );
          }
        }
        if (resCats.ok) {
          const apiCats = await resCats.json();
          if (Array.isArray(apiCats) && apiCats.length > 0) {
            const mappedCats: Category[] = apiCats.map((c: any) => ({
              id: String(c.id),
              name: c.name,
              image: c.image || 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
              parentCategory: c.description || 'General',
              productCount: Number(c.productCount) || 0,
              revenue: Number(c.revenue) || 0,
              status: (c.status || (c.isActive ? 'Active' : 'Inactive')) as 'Active' | 'Draft' | 'Inactive',
              topLevel: Boolean(c.topLevel),
              subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
            }));
            const customCats = getLocalCustomCategories();
            const mergedCats = [...customCats];
            mappedCats.forEach((ac) => {
              if (!mergedCats.some((m) => m.id === ac.id || m.name.toLowerCase() === ac.name.toLowerCase())) {
                mergedCats.push(ac);
              }
            });
            setCategories(mergedCats);
          }
        }
        if (resCoupons.ok) {
          const apiCoupons = await resCoupons.json();
          if (Array.isArray(apiCoupons) && apiCoupons.length > 0) {
            const mappedPromos: Promotion[] = apiCoupons.map((c: any) => ({
              id: String(c.id),
              code: c.code,
              incentiveType: (c.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount') as 'Percentage' | 'Fixed Amount',
              value: c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`,
              usageProgress: Number(c.usageCount) || 0,
              usageLimit: Number(c.usageLimit) || 500,
              expiryDate: c.validUntil || 'Dec 31, 2026',
              status: (c.isActive ? 'Active' : 'Expired') as 'Active' | 'Scheduled' | 'Archived' | 'Expired',
              revenueAttributed: 0,
            }));
            const customCoupons = getLocalCustomCoupons();
            const mergedPromos = [...customCoupons];
            mappedPromos.forEach((ap) => {
              if (!mergedPromos.some((m) => m.id === ap.id || m.code.toLowerCase() === ap.code.toLowerCase())) {
                mergedPromos.push(ap);
              }
            });
            setPromotions(mergedPromos);
          }
        }
      } catch (err) {
        console.log('Using local fallback state for Admin Panel');
      }
    }

    syncBackendData();
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const newId = newProdData.id || String(Date.now());
    const newProduct: Product = {
      ...newProdData,
      id: newId,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
    try {
      const localCustom = getLocalCustomProducts();
      const updated = [newProduct, ...localCustom.filter((p: any) => String(p.id) !== newId)];
      localStorage.setItem('matrin_custom_products', JSON.stringify(updated));
      window.dispatchEvent(new Event('matrin_products_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    addToast('success', `Product "${newProduct.name}" created successfully!`);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    let fullUpdatedProd: Product | null = null;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          fullUpdatedProd = {
            ...p,
            ...updatedData,
            updatedAt: new Date().toISOString().slice(0, 10),
          };
          return fullUpdatedProd;
        }
        return p;
      })
    );

    try {
      const localCustom = getLocalCustomProducts();
      const existingIndex = localCustom.findIndex((p: any) => String(p.id) === String(id));

      const currentProd = products.find((p) => String(p.id) === String(id));
      const targetProd: Product = fullUpdatedProd || ({
        ...(currentProd || {}),
        ...updatedData,
        id: String(id),
        updatedAt: new Date().toISOString().slice(0, 10),
      } as Product);

      let updatedList: any[];
      if (existingIndex !== -1) {
        updatedList = localCustom.map((p: any) =>
          String(p.id) === String(id) ? { ...p, ...targetProd } : p
        );
      } else {
        updatedList = [targetProd, ...localCustom];
      }

      localStorage.setItem('matrin_custom_products', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('matrin_products_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    addToast('info', 'Product details updated');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      const localCustom = getLocalCustomProducts();
      const updated = localCustom.filter((p: any) => String(p.id) !== String(id));
      localStorage.setItem('matrin_custom_products', JSON.stringify(updated));

      const rawDeleted = localStorage.getItem('matrin_deleted_products');
      const deletedIds: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
      if (!deletedIds.includes(String(id))) {
        deletedIds.push(String(id));
        localStorage.setItem('matrin_deleted_products', JSON.stringify(deletedIds));
      }

      window.dispatchEvent(new Event('matrin_products_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    fetch(`/api/products/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) addToast('error', 'Deleted locally, but the server did not confirm the deletion.');
      })
      .catch(() => addToast('error', 'Deleted locally, but failed to reach the server.'));
    addToast('warning', 'Product deleted from catalog');
  };

  const bulkDeleteProducts = (ids: string[]) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    try {
      const localCustom = getLocalCustomProducts();
      const updated = localCustom.filter((p: any) => !ids.includes(String(p.id)));
      localStorage.setItem('matrin_custom_products', JSON.stringify(updated));

      const rawDeleted = localStorage.getItem('matrin_deleted_products');
      const deletedIds: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
      ids.forEach((id) => {
        if (!deletedIds.includes(String(id))) deletedIds.push(String(id));
      });
      localStorage.setItem('matrin_deleted_products', JSON.stringify(deletedIds));

      window.dispatchEvent(new Event('matrin_products_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    Promise.all(ids.map((id) => fetch(`/api/products/${id}`, { method: 'DELETE' })))
      .catch(() => addToast('error', 'Deleted locally, but failed to sync some deletions to the server.'));
    addToast('warning', `${ids.length} products deleted`);
  };

  const importProducts = (newProds: Partial<Product>[]) => {
    const formatted: Product[] = newProds.map((p, idx) => ({
      id: 'prod-imp-' + Date.now() + '-' + idx,
      name: p.name || 'Imported MATRIN Product',
      sku: p.sku || `MTR-IMP-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: p.barcode || '8909998887771',
      category: p.category || 'General',
      brand: 'MATRIN Enterprise',
      price: Number(p.price) || 99.00,
      gst: 18,
      stock: Number(p.stock) || 50,
      reservedStock: 0,
      warehouse: 'San Jose Logistics Hub',
      vendor: 'MATRIN Supply',
      weight: '1.5 kg',
      dimensions: '20x20x20 cm',
      visibility: 'Published',
      status: 'In Stock',
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      image: p.image || 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop&q=80',
    }));
    setProducts((prev) => [...formatted, ...prev]);
    addToast('success', `Successfully imported ${formatted.length} products into MATRIN catalog!`);
  };

  // Stock Management Action: Adjust stock by product name/SKU
  const adjustProductStockByName = (
    productIdentifier: string,
    quantityToAdd: number,
    warehouse: string,
    reason: string
  ) => {
    const targetProd = products.find(
      (p) =>
        p.id === productIdentifier ||
        p.name.toLowerCase() === productIdentifier.toLowerCase() ||
        p.sku.toLowerCase() === productIdentifier.toLowerCase()
    );

    if (!targetProd) {
      addToast('error', `Product "${productIdentifier}" not found in catalog.`);
      return;
    }

    const updatedStock = Math.max(0, targetProd.stock + quantityToAdd);
    const updatedStatus = updatedStock > 10 ? 'In Stock' : updatedStock > 0 ? 'Low Stock' : 'Out of Stock';

    // 1. Update Product Catalog
    setProducts((prev) =>
      prev.map((p) =>
        p.id === targetProd.id
          ? { ...p, stock: updatedStock, status: updatedStatus, warehouse: warehouse || p.warehouse }
          : p
      )
    );

    // 2. Update Inventory Table
    setInventory((prev) => {
      const exists = prev.some((i) => i.sku === targetProd.sku);
      if (exists) {
        return prev.map((i) =>
          i.sku === targetProd.sku
            ? {
                ...i,
                currentStock: updatedStock,
                warehouse: warehouse || i.warehouse,
                status:
                  updatedStock <= 0
                    ? 'Critical'
                    : updatedStock <= i.criticalLevel
                    ? 'Critical'
                    : updatedStock <= i.criticalLevel * 2
                    ? 'Low Stock'
                    : 'Healthy',
                lastRestocked: new Date().toISOString().slice(0, 10),
              }
            : i
        );
      } else {
        return [
          {
            id: 'inv-' + Date.now(),
            sku: targetProd.sku,
            name: targetProd.name,
            category: targetProd.category,
            warehouse: warehouse || targetProd.warehouse,
            currentStock: updatedStock,
            reserved: 0,
            criticalLevel: 5,
            incoming: quantityToAdd > 0 ? quantityToAdd : 0,
            outgoing: quantityToAdd < 0 ? Math.abs(quantityToAdd) : 0,
            status: updatedStock > 5 ? 'Healthy' : 'Critical',
            lastRestocked: new Date().toISOString().slice(0, 10),
          },
          ...prev,
        ];
      }
    });

    // 3. Record Movement Log
    const newLog: StockMovementLog = {
      id: 'log-' + Date.now(),
      productId: targetProd.id,
      productName: targetProd.name,
      sku: targetProd.sku,
      quantityChange: quantityToAdd,
      warehouse: warehouse || targetProd.warehouse,
      reason: reason || 'Manual Stock Adjustment',
      timestamp: 'Just now',
      performedBy: user.name + ' (' + user.role + ')',
    };
    setStockLogs((prev) => [newLog, ...prev]);

    // 4. Sync immediately to localStorage and dispatch event for real-time storefront update
    try {
      const localCustom = getLocalCustomProducts();
      const existingIndex = localCustom.findIndex((p: any) => String(p.id) === String(targetProd.id));
      let updatedList: any[];
      if (existingIndex !== -1) {
        updatedList = localCustom.map((p: any) =>
          String(p.id) === String(targetProd.id)
            ? { ...p, stock: updatedStock, stockCount: updatedStock, inStock: updatedStock > 0 }
            : p
        );
      } else {
        updatedList = [
          { ...targetProd, stock: updatedStock, stockCount: updatedStock, inStock: updatedStock > 0 },
          ...localCustom,
        ];
      }
      localStorage.setItem('matrin_custom_products', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('matrin_products_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 5. Sync to the backend so the change is reflected on the live storefront API
    fetch('/api/inventory/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: targetProd.id,
        quantityToAdd,
        reason: reason || 'Manual Stock Adjustment',
        performedBy: user.name + ' (' + user.role + ')',
      }),
    })
      .then((res) => {
        if (!res.ok) addToast('error', 'Stock updated locally, but the server did not confirm it.');
      })
      .catch(() => addToast('error', 'Stock updated locally, but failed to reach the server.'));

    addToast(
      'success',
      `Stock updated for "${targetProd.name}": ${quantityToAdd >= 0 ? '+' : ''}${quantityToAdd} units (New Total: ${updatedStock})`
    );
  };

  // Warehouses
  const addWarehouse = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      addToast('error', 'Warehouse name cannot be empty.');
      return;
    }
    if (warehouses.some((w) => w.toLowerCase() === trimmed.toLowerCase())) {
      addToast('error', `Warehouse "${trimmed}" already exists.`);
      return;
    }
    setWarehouses((prev) => [...prev, trimmed]);
    addToast('success', `Warehouse "${trimmed}" added.`);
  };

  const deleteWarehouse = (name: string) => {
    const hasProducts = products.some((p) => p.warehouse === name);
    if (hasProducts) {
      addToast('error', `Cannot delete "${name}" — it still has products assigned. Restock them to another warehouse first.`);
      return;
    }
    setWarehouses((prev) => prev.filter((w) => w !== name));
    addToast('warning', `Warehouse "${name}" removed.`);
  };

  // Reverses a single stock movement: restores the product's prior stock and
  // removes the log entry, both locally and on the backend.
  const cancelStockLog = (logId: string) => {
    const log = stockLogs.find((l) => l.id === logId);
    if (!log) return;

    const targetProd = products.find(
      (p) => p.id === log.productId || p.sku === log.sku || p.name === log.productName
    );
    if (!targetProd) {
      addToast('error', `Could not find "${log.productName}" in the catalog to reverse this change.`);
      return;
    }

    const reversedStock = Math.max(0, targetProd.stock - log.quantityChange);
    const reversedStatus = reversedStock > 10 ? 'In Stock' : reversedStock > 0 ? 'Low Stock' : 'Out of Stock';

    setProducts((prev) =>
      prev.map((p) => (p.id === targetProd.id ? { ...p, stock: reversedStock, status: reversedStatus } : p))
    );
    setStockLogs((prev) => prev.filter((l) => l.id !== logId));

    try {
      const localCustom = getLocalCustomProducts();
      const existingIndex = localCustom.findIndex((p: any) => String(p.id) === String(targetProd.id));
      let updatedList: any[];
      if (existingIndex !== -1) {
        updatedList = localCustom.map((p: any) =>
          String(p.id) === String(targetProd.id)
            ? { ...p, stock: reversedStock, stockCount: reversedStock, inStock: reversedStock > 0 }
            : p
        );
      } else {
        updatedList = [
          { ...targetProd, stock: reversedStock, stockCount: reversedStock, inStock: reversedStock > 0 },
          ...localCustom,
        ];
      }
      localStorage.setItem('matrin_custom_products', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('matrin_products_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    fetch('/api/inventory/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: targetProd.id,
        quantityToAdd: -log.quantityChange,
        reason: `Cancelled: ${log.reason}`,
        performedBy: user.name + ' (' + user.role + ')',
      }),
    })
      .then((res) => {
        if (!res.ok) addToast('error', 'Reversed locally, but the server did not confirm it.');
      })
      .catch(() => addToast('error', 'Reversed locally, but failed to reach the server.'));

    addToast('success', `Cancelled stock change for "${targetProd.name}" (New Total: ${reversedStock})`);
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newId = 'cat-' + Date.now();
    const newCat: Category = {
      ...catData,
      id: newId,
    };
    setCategories((prev) => [newCat, ...prev.filter((c) => c.id !== newId)]);
    try {
      const localCustom = getLocalCustomCategories();
      const updated = [newCat, ...localCustom.filter((c) => c.id !== newId)];
      localStorage.setItem('matrin_custom_categories', JSON.stringify(updated));
      window.dispatchEvent(new Event('matrin_categories_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        name: newCat.name,
        description: newCat.parentCategory || '',
        status: newCat.status,
      }),
    }).catch(() => addToast('error', 'Saved category locally, but failed to reach the server.'));

    addToast('success', `Category "${newCat.name}" added successfully`);
  };

  const updateCategory = (id: string, updatedData: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c)));
    try {
      const localCustom = getLocalCustomCategories();
      const existing = categories.find((c) => c.id === id);
      const merged = { ...(existing || {}), ...updatedData, id } as Category;
      const updated = localCustom.some((c) => c.id === id)
        ? localCustom.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
        : [merged, ...localCustom];
      localStorage.setItem('matrin_custom_categories', JSON.stringify(updated));
      window.dispatchEvent(new Event('matrin_categories_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    }).catch(() => addToast('error', 'Updated locally, but failed to reach the server.'));

    addToast('info', 'Category details updated');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      const localCustom = getLocalCustomCategories();
      const updated = localCustom.filter((c) => c.id !== id);
      localStorage.setItem('matrin_custom_categories', JSON.stringify(updated));

      const rawDeleted = localStorage.getItem('matrin_deleted_categories');
      const deletedIds: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('matrin_deleted_categories', JSON.stringify(deletedIds));
      }

      window.dispatchEvent(new Event('matrin_categories_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    fetch(`/api/categories/${id}`, { method: 'DELETE' }).catch(() =>
      addToast('error', 'Deleted locally, but failed to reach the server.')
    );

    addToast('warning', 'Category deleted');
  };

  const toggleCategoryStatus = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const newStatus = cat.status === 'Active' ? 'Inactive' : 'Active';
    updateCategory(id, { status: newStatus });
  };

  const updateOrderStatus = (
    id: string,
    paymentStatus: Order['paymentStatus'],
    shippingStatus: Order['shippingStatus']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, paymentStatus, shippingStatus } : o))
    );

    fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentStatus,
        orderStatus: shippingStatus === 'In Transit' ? 'Shipped' : shippingStatus === 'Delivered' ? 'Delivered' : shippingStatus === 'Cancelled' ? 'Cancelled' : 'Processing',
      }),
    }).catch(() => addToast('error', 'Order updated locally, but failed to reach the server.'));

    addToast('success', `Order ${id} status updated`);
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

    fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => addToast('error', 'Review updated locally, but failed to reach the server.'));

    addToast('info', `Review updated to ${status}`);
  };

  const addPromotion = (promoData: Omit<Promotion, 'id'>) => {
    const newId = 'promo-' + Date.now();
    const newPromo: Promotion = {
      ...promoData,
      id: newId,
    };
    setPromotions((prev) => [newPromo, ...prev.filter((p) => p.id !== newId)]);
    try {
      const localCustom = getLocalCustomCoupons();
      const updated = [newPromo, ...localCustom.filter((p) => p.id !== newId)];
      localStorage.setItem('matrin_custom_coupons', JSON.stringify(updated));
      window.dispatchEvent(new Event('matrin_coupons_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    const discountValue = parseFloat(newPromo.value.replace(/[^0-9.]/g, '')) || 10;
    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        code: newPromo.code,
        discountType: newPromo.incentiveType === 'Fixed Amount' ? 'fixed' : 'percentage',
        discountValue,
        usageLimit: newPromo.usageLimit,
        isActive: newPromo.status === 'Active',
      }),
    }).catch(() => addToast('error', 'Saved coupon locally, but failed to reach the server.'));

    addToast('success', `Coupon code "${newPromo.code}" generated!`);
  };

  const updatePromotion = (id: string, updatedData: Partial<Promotion>) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    try {
      const localCustom = getLocalCustomCoupons();
      const existing = promotions.find((p) => p.id === id);
      const merged = { ...(existing || {}), ...updatedData, id } as Promotion;
      const updated = localCustom.some((p) => p.id === id)
        ? localCustom.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
        : [merged, ...localCustom];
      localStorage.setItem('matrin_custom_coupons', JSON.stringify(updated));
      window.dispatchEvent(new Event('matrin_coupons_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    const discountValue = updatedData.value ? (parseFloat(updatedData.value.replace(/[^0-9.]/g, '')) || 10) : undefined;
    fetch(`/api/coupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(updatedData.code ? { code: updatedData.code } : {}),
        ...(updatedData.incentiveType ? { discountType: updatedData.incentiveType === 'Fixed Amount' ? 'fixed' : 'percentage' } : {}),
        ...(discountValue !== undefined ? { discountValue } : {}),
        ...(updatedData.usageLimit !== undefined ? { usageLimit: updatedData.usageLimit } : {}),
        ...(updatedData.status ? { isActive: updatedData.status === 'Active' } : {}),
      }),
    }).catch(() => addToast('error', 'Updated locally, but failed to reach the server.'));

    addToast('info', 'Coupon details updated');
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    try {
      const localCustom = getLocalCustomCoupons();
      const updated = localCustom.filter((p) => p.id !== id);
      localStorage.setItem('matrin_custom_coupons', JSON.stringify(updated));

      const rawDeleted = localStorage.getItem('matrin_deleted_coupons');
      const deletedIds: string[] = rawDeleted ? JSON.parse(rawDeleted) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('matrin_deleted_coupons', JSON.stringify(deletedIds));
      }

      window.dispatchEvent(new Event('matrin_coupons_updated'));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    fetch(`/api/coupons/${id}`, { method: 'DELETE' }).catch(() =>
      addToast('error', 'Deleted locally, but failed to reach the server.')
    );

    addToast('warning', 'Coupon deleted');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('info', 'All notifications cleared');
  };

  // Suppliers
  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = { ...supplierData, id: 'sup-' + Date.now() };
    setSuppliers((prev) => [newSupplier, ...prev]);
    addToast('success', `Supplier "${newSupplier.name}" added`);
  };

  const updateSupplier = (id: string, updatedData: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
    addToast('info', 'Supplier details updated');
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    addToast('warning', 'Supplier removed');
  };

  // Employees
  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = { ...employeeData, id: 'emp-' + Date.now() };
    setEmployees((prev) => [newEmployee, ...prev]);
    addToast('success', `Employee "${newEmployee.name}" added`);
  };

  const updateEmployee = (id: string, updatedData: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e)));
    addToast('info', 'Employee details updated');
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    addToast('warning', 'Employee removed');
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e))
    );
    addToast('info', 'Employee status updated');
  };

  // Support Tickets
  const addSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: 't-' + Date.now(),
      ticketNumber: '#TICK-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setSupportTickets((prev) => [newTicket, ...prev]);

    fetch('/api/support-tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket),
    }).catch(() => addToast('error', 'Ticket saved locally, but failed to reach the server.'));

    addToast('success', `Ticket ${newTicket.ticketNumber} created`);
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
    setSupportTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

    fetch(`/api/support-tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => addToast('error', 'Updated locally, but failed to reach the server.'));

    addToast('info', `Ticket updated to ${status}`);
  };

  const deleteSupportTicket = (id: string) => {
    setSupportTickets((prev) => prev.filter((t) => t.id !== id));

    fetch(`/api/support-tickets/${id}`, { method: 'DELETE' }).catch(() =>
      addToast('error', 'Deleted locally, but failed to reach the server.')
    );

    addToast('warning', 'Ticket deleted');
  };

  // Shipping & Returns
  const updateShippingInfo = (
    orderId: string,
    updates: Partial<Pick<Order, 'courier' | 'trackingNumber' | 'shippingStatus'>>
  ) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o)));
    addToast('success', `Shipment for order ${orderId} updated`);
  };

  const processRefund = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: 'Refunded', shippingStatus: 'Returned' } : o
      )
    );
    addToast('success', `Refund processed for order ${orderId}`);
  };

  // Security
  const toggleTwoFactor = () => {
    setSecuritySettings((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    addToast('info', 'Two-factor authentication setting updated');
  };

  const addIpToWhitelist = (ip: string) => {
    if (!ip.trim()) return;
    setSecuritySettings((prev) =>
      prev.ipWhitelist.includes(ip) ? prev : { ...prev, ipWhitelist: [...prev.ipWhitelist, ip] }
    );
    addToast('success', `IP ${ip} added to whitelist`);
  };

  const removeIpFromWhitelist = (ip: string) => {
    setSecuritySettings((prev) => ({ ...prev, ipWhitelist: prev.ipWhitelist.filter((i) => i !== ip) }));
    addToast('warning', `IP ${ip} removed from whitelist`);
  };

  const revokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    addToast('warning', 'Session revoked');
  };

  return (
    <AdminContext.Provider
      value={{
        activeModule,
        setActiveModule,
        isDarkMode,
        toggleDarkMode,
        isSidebarCollapsed,
        toggleSidebar,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        globalSearchQuery,
        setGlobalSearchQuery,
        user,
        setUser,
        selectedCustomerId,
        setSelectedCustomerId,
        selectedOrderId,
        setSelectedOrderId,
        selectedProductId,
        setSelectedProductId,
        editingProduct,
        setEditingProduct,
        editingCategory,
        setEditingCategory,
        editingPromotion,
        setEditingPromotion,
        isAddProductModalOpen,
        setAddProductModalOpen,
        isAddCategoryModalOpen,
        setAddCategoryModalOpen,
        isCreateCouponModalOpen,
        setCreateCouponModalOpen,
        isCSVImportModalOpen,
        setCSVImportModalOpen,
        isAIChatOpen,
        setAIChatOpen,
        isStockAdjustmentModalOpen,
        setStockAdjustmentModalOpen,
        products,
        categories,
        orders,
        customers,
        reviews,
        promotions,
        inventory,
        suppliers,
        employees,
        supportTickets,
        notifications,
        stockLogs,
        securitySettings,
        activeSessions,
        warehouses,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkDeleteProducts,
        importProducts,
        addWarehouse,
        deleteWarehouse,
        cancelStockLog,
        adjustProductStockByName,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryStatus,
        updateOrderStatus,
        updateReviewStatus,
        addPromotion,
        updatePromotion,
        deletePromotion,
        markNotificationRead,
        clearNotifications,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        addSupportTicket,
        updateTicketStatus,
        deleteSupportTicket,
        updateShippingInfo,
        processRefund,
        toggleTwoFactor,
        addIpToWhitelist,
        removeIpFromWhitelist,
        revokeSession,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminStore must be used within an AdminProvider');
  }
  return context;
};
