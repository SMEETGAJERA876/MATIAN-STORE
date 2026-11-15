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
  markRefunded: (orderId: string) => void;

  // Security

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

const initialOrders: Order[] = [];

const initialCustomers: Customer[] = [];

const initialReviews: Review[] = [];

const initialPromotions: Promotion[] = [];

const initialInventory: InventoryItem[] = [];

const initialSuppliers: Supplier[] = [];

const initialEmployees: Employee[] = [];

// Starts empty; real tickets load from the backend (including ones customers
// submit through the storefront Contact Us form) via the sync effect below.
const initialSupportTickets: SupportTicket[] = [];

const initialNotifications: NotificationItem[] = [];

const initialSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  ipWhitelist: [],
};

const initialActiveSessions: SecuritySession[] = [];

// Starts empty rather than seeded with demo entries: those referenced the
// placeholder catalog's fictional products, which don't exist once the real
// product sync replaces it, so their "Cancel" action could never resolve.
const initialStockLogs: StockMovementLog[] = [];

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

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [stockLogs, setStockLogs] = useState<StockMovementLog[]>(initialStockLogs);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);
  const activeSessions = initialActiveSessions;
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

  // Load shared store records from Firebase-backed APIs.
  useEffect(() => {
    async function syncBackendData() {
      try {
        const apiBase = '/api';
        const [resProd, resOrd, resCust, resTickets, resCats, resCoupons, resReviews, resInventory, resNotifications, resSuppliers, resEmployees, resWarehouses, resSettings] = await Promise.all([
          fetch(`${apiBase}/products`),
          fetch(`${apiBase}/orders`),
          fetch(`${apiBase}/customers`),
          fetch(`${apiBase}/support-tickets`),
          fetch(`${apiBase}/categories`),
          fetch(`${apiBase}/coupons`),
          fetch(`${apiBase}/reviews`),
          fetch(`${apiBase}/inventory`),
          fetch(`${apiBase}/notifications`),
          fetch(`${apiBase}/admin-data/suppliers`),
          fetch(`${apiBase}/admin-data/employees`),
          fetch(`${apiBase}/admin-data/warehouses`),
          fetch(`${apiBase}/settings`),
        ]);

        if (resProd.ok) {
          const apiProducts = await resProd.json();
          if (Array.isArray(apiProducts)) {
            setProducts(apiProducts.map((p: any) => ({
              id: String(p.id),
              name: p.name,
              sku: p.sku || `MTR-${p.id}`,
              barcode: `890123456789${p.id}`,
              category: p.category || 'General',
              brand: 'MATRIN Enterprise',
              price: Number(p.price) || 299,
              discountPrice: p.originalPrice,
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
              galleryImages: p.images || [p.image],
              description: p.description || '',
              features: p.features || [],
              specifications: p.specifications || {},
            })));
          }
        }

        if (resOrd.ok) {
          const apiOrders = await resOrd.json();
          if (Array.isArray(apiOrders)) {
            setOrders(
              apiOrders.map((o: any) => ({
                id: o.id,
                orderNumber: o.invoiceNumber || `#${o.id}`,
                customerName: o.customer?.fullName || 'Customer',
                customerEmail: o.customer?.email || 'customer@matrin.com',
                customerPhone: o.customer?.phone || '',
                customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                date: o.orderDate || new Date().toISOString().slice(0, 10),
                totalAmount: Number(o.totalAmount) || 0,
                paymentStatus: o.paymentStatus === 'Paid' ? 'Paid' : 'Pending',
                shippingStatus: o.orderStatus === 'Shipped' ? 'In Transit' : 'Processing',
                courier: 'FedEx Express',
                trackingNumber: o.transactionId || 'FDX-994102931',
                shippingAddress: [
                  o.customer?.addressLine,
                  o.customer?.city,
                  o.customer?.state,
                  o.customer?.pincode,
                ].filter(Boolean).join(', '),
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
          if (Array.isArray(apiCustomers)) {
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
          if (Array.isArray(apiCats)) {
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
            setCategories(mappedCats);
          }
        }
        if (resCoupons.ok) {
          const apiCoupons = await resCoupons.json();
          if (Array.isArray(apiCoupons)) {
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
            setPromotions(mappedPromos);
          }
        }
        if (resReviews.ok) {
          const apiReviews = await resReviews.json();
          if (Array.isArray(apiReviews)) {
            setReviews(apiReviews.map((review: any) => ({
              id: String(review.id),
              customerName: review.customerName || 'Customer',
              customerAvatar: '',
              productName: review.productName || 'Product',
              rating: Number(review.rating) || 0,
              reviewText: review.comment || '',
              date: review.date || '',
              status: review.status === 'Approved' ? 'Published' : review.status || 'Pending',
              sentiment: 'Neutral',
            })));
          }
        }
        if (resInventory.ok) {
          const inventoryData = await resInventory.json();
          if (Array.isArray(inventoryData.items)) {
            setInventory(inventoryData.items.map((item: any) => ({
              id: String(item.id),
              sku: item.sku || '',
              name: item.name || '',
              category: item.category || '',
              warehouse: item.warehouse || 'Main Central Hub',
              currentStock: Number(item.stock) || 0,
              reserved: 0,
              criticalLevel: Number(item.minStockLevel) || 5,
              incoming: 0,
              outgoing: 0,
              status: Number(item.stock) <= 0 ? 'Critical' : Number(item.stock) <= Number(item.minStockLevel || 5) ? 'Low Stock' : 'Healthy',
              lastRestocked: '',
            })));
            setStockLogs((inventoryData.logs || []).map((log: any) => ({
              id: String(log.id),
              productId: String(log.productId || ''),
              productName: log.productName || '',
              sku: log.sku || '',
              quantityChange: Number(log.changeAmount) || 0,
              warehouse: log.warehouse || '',
              reason: log.reason || '',
              timestamp: log.timestamp || '',
              performedBy: log.adjustedBy || '',
            })));
          }
        }
        if (resNotifications.ok) {
          const apiNotifications = await resNotifications.json();
          if (Array.isArray(apiNotifications)) {
            setNotifications(apiNotifications.map((notification: any) => ({
              id: String(notification.id),
              title: notification.title || '',
              description: notification.message || '',
              timestamp: notification.timestamp || '',
              type: notification.type || 'system',
              read: Boolean(notification.isRead),
              priority: 'normal',
            })));
          }
        }
        if (resSuppliers.ok) {
          const apiSuppliers = await resSuppliers.json();
          if (Array.isArray(apiSuppliers)) setSuppliers(apiSuppliers);
        }
        if (resEmployees.ok) {
          const apiEmployees = await resEmployees.json();
          if (Array.isArray(apiEmployees)) setEmployees(apiEmployees);
        }
        if (resWarehouses.ok) {
          const apiWarehouses = await resWarehouses.json();
          if (Array.isArray(apiWarehouses)) {
            setWarehouses(apiWarehouses.map((warehouse: { name: string }) => warehouse.name));
          }
        }
        if (resSettings.ok) {
          const apiSettings = await resSettings.json();
          if (Array.isArray(apiSettings.securitySettings?.ipWhitelist)) {
            setSecuritySettings({
              twoFactorEnabled: Boolean(apiSettings.securitySettings.twoFactorEnabled),
              ipWhitelist: apiSettings.securitySettings.ipWhitelist,
            });
          }
        }
      } catch (err) {
        console.error('Could not load Firebase store data:', err);
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
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newProduct,
        originalPrice: newProduct.discountPrice,
        images: newProduct.galleryImages || [newProduct.image],
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to create product.');
        setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
        window.dispatchEvent(new Event('matrin_products_updated'));
        addToast('success', `Product "${newProduct.name}" created successfully!`);
      })
      .catch((error) => {
        addToast('error', error instanceof Error ? error.message : 'Failed to create product.');
      });
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    const updatedAt = new Date().toISOString().slice(0, 10);
    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updatedData, updatedAt }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update product.');
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, ...updatedData, updatedAt } : product
          )
        );
        window.dispatchEvent(new Event('matrin_products_updated'));
        addToast('info', 'Product details updated');
      })
      .catch((error) => {
        addToast('error', error instanceof Error ? error.message : 'Failed to update product.');
      });
  };

  const deleteProduct = (id: string) => {
    fetch(`/api/products/${id}`, { method: 'DELETE' })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to delete product.');
        setProducts((prev) => prev.filter((product) => product.id !== id));
        window.dispatchEvent(new Event('matrin_products_updated'));
        addToast('warning', 'Product deleted from catalog');
      })
      .catch((error) => addToast('error', error instanceof Error ? error.message : 'Failed to delete product.'));
  };

  const bulkDeleteProducts = (ids: string[]) => {
    Promise.all(
      ids.map(async (id) => {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || `Failed to delete product ${id}.`);
      })
    )
      .then(() => {
        setProducts((prev) => prev.filter((product) => !ids.includes(product.id)));
        window.dispatchEvent(new Event('matrin_products_updated'));
        addToast('warning', `${ids.length} products deleted`);
      })
      .catch((error) => addToast('error', error instanceof Error ? error.message : 'Failed to delete products.'));
  };

  const importProducts = (newProds: Partial<Product>[]) => {
    const formatted: Product[] = newProds.map((p, idx) => ({
      id: String(Date.now() + idx),
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
    Promise.all(
      formatted.map(async (product) => {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...product,
            originalPrice: product.discountPrice,
            images: product.galleryImages || [product.image],
          }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || `Failed to import ${product.name}.`);
      })
    )
      .then(() => {
        setProducts((prev) => [...formatted, ...prev]);
        window.dispatchEvent(new Event('matrin_products_updated'));
        addToast('success', `Successfully imported ${formatted.length} products into MATRIN catalog!`);
      })
      .catch((error) => addToast('error', error instanceof Error ? error.message : 'Failed to import products.'));
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

    // Persist the adjustment in Firebase so the storefront reads the same stock.
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
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Stock update was not saved.');
        window.dispatchEvent(new Event('matrin_products_updated'));
        addToast(
          'success',
          `Stock updated for "${targetProd.name}": ${quantityToAdd >= 0 ? '+' : ''}${quantityToAdd} units (New Total: ${updatedStock})`
        );
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Stock update failed.')
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
    fetch('/api/admin-data/warehouses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: trimmed, name: trimmed }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to save warehouse.');
        setWarehouses((prev) =>
          prev.some((warehouse) => warehouse.toLowerCase() === trimmed.toLowerCase())
            ? prev
            : [...prev, trimmed]
        );
        addToast('success', `Warehouse "${trimmed}" added.`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to save warehouse.')
      );
  };

  const deleteWarehouse = (name: string) => {
    const hasProducts = products.some((p) => p.warehouse === name);
    if (hasProducts) {
      addToast('error', `Cannot delete "${name}" — it still has products assigned. Restock them to another warehouse first.`);
      return;
    }
    fetch(`/api/admin-data/warehouses/${encodeURIComponent(name)}`, { method: 'DELETE' })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to delete warehouse.');
        setWarehouses((prev) => prev.filter((warehouse) => warehouse !== name));
        addToast('warning', `Warehouse "${name}" removed.`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to delete warehouse.')
      );
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
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Stock reversal was not saved.');
        window.dispatchEvent(new Event('matrin_products_updated'));
        addToast('success', `Cancelled stock change for "${targetProd.name}" (New Total: ${reversedStock})`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Stock reversal failed.')
      );
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newId = 'cat-' + Date.now();
    const newCat: Category = {
      ...catData,
      id: newId,
    };
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCat, description: newCat.parentCategory || '' }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to save category.');
        setCategories((prev) => [newCat, ...prev.filter((category) => category.id !== newId)]);
        window.dispatchEvent(new Event('matrin_categories_updated'));
        addToast('success', `Category "${newCat.name}" added successfully`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to save category.')
      );
  };

  const updateCategory = (id: string, updatedData: Partial<Category>) => {
    fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updatedData,
        ...(updatedData.parentCategory !== undefined ? { description: updatedData.parentCategory } : {}),
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update category.');
        setCategories((prev) => prev.map((category) =>
          category.id === id ? { ...category, ...updatedData } : category
        ));
        window.dispatchEvent(new Event('matrin_categories_updated'));
        addToast('info', 'Category details updated');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update category.')
      );
  };

  const deleteCategory = (id: string) => {
    fetch(`/api/categories/${id}`, { method: 'DELETE' })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to delete category.');
        setCategories((prev) => prev.filter((category) => category.id !== id));
        window.dispatchEvent(new Event('matrin_categories_updated'));
        addToast('warning', 'Category deleted');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to delete category.')
      );
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
    fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentStatus,
        shippingStatus,
        orderStatus: shippingStatus === 'In Transit' ? 'Shipped' : shippingStatus === 'Delivered' ? 'Delivered' : shippingStatus === 'Cancelled' ? 'Cancelled' : 'Processing',
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update order.');
        setOrders((prev) => prev.map((order) =>
          order.id === id ? { ...order, paymentStatus, shippingStatus } : order
        ));
        addToast('success', `Order ${id} status updated`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update order.')
      );
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    fetch(`/api/reviews/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update review.');
        setReviews((prev) => prev.map((review) =>
          review.id === id ? { ...review, status } : review
        ));
        addToast('info', `Review updated to ${status}`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update review.')
      );
  };

  const addPromotion = (promoData: Omit<Promotion, 'id'>) => {
    const newId = 'promo-' + Date.now();
    const newPromo: Promotion = {
      ...promoData,
      id: newId,
    };
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
        validUntil: newPromo.expiryDate,
        isActive: newPromo.status === 'Active',
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to create coupon.');
        setPromotions((prev) => [newPromo, ...prev.filter((promo) => promo.id !== newId)]);
        window.dispatchEvent(new Event('matrin_coupons_updated'));
        addToast('success', `Coupon code "${newPromo.code}" generated!`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to create coupon.')
      );
  };

  const updatePromotion = (id: string, updatedData: Partial<Promotion>) => {
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
        ...(updatedData.expiryDate ? { validUntil: updatedData.expiryDate } : {}),
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update coupon.');
        setPromotions((prev) => prev.map((promo) =>
          promo.id === id ? { ...promo, ...updatedData } : promo
        ));
        window.dispatchEvent(new Event('matrin_coupons_updated'));
        addToast('info', 'Coupon details updated');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update coupon.')
      );
  };

  const deletePromotion = (id: string) => {
    fetch(`/api/coupons/${id}`, { method: 'DELETE' })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to delete coupon.');
        setPromotions((prev) => prev.filter((promo) => promo.id !== id));
        window.dispatchEvent(new Event('matrin_coupons_updated'));
        addToast('warning', 'Coupon deleted');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to delete coupon.')
      );
  };

  const markNotificationRead = (id: string) => {
    fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isRead: true }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update notification.');
        setNotifications((prev) => prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        ));
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update notification.')
      );
  };

  const clearNotifications = () => {
    fetch('/api/notifications', { method: 'DELETE' })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to clear notifications.');
        setNotifications([]);
        addToast('info', 'All notifications cleared');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to clear notifications.')
      );
  };

  // Suppliers
  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = { ...supplierData, id: 'sup-' + Date.now() };
    fetch('/api/admin-data/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSupplier),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to add supplier.');
        setSuppliers((prev) => [newSupplier, ...prev]);
        addToast('success', `Supplier "${newSupplier.name}" added`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to add supplier.')
      );
  };

  const updateSupplier = (id: string, updatedData: Partial<Supplier>) => {
    fetch(`/api/admin-data/suppliers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update supplier.');
        setSuppliers((prev) => prev.map((supplier) =>
          supplier.id === id ? { ...supplier, ...updatedData } : supplier
        ));
        addToast('info', 'Supplier details updated');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update supplier.')
      );
  };

  const deleteSupplier = (id: string) => {
    fetch(`/api/admin-data/suppliers/${encodeURIComponent(id)}`, { method: 'DELETE' })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to remove supplier.');
        setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
        addToast('warning', 'Supplier removed');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to remove supplier.')
      );
  };

  // Employees
  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = { ...employeeData, id: 'emp-' + Date.now() };
    fetch('/api/admin-data/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to add employee.');
        setEmployees((prev) => [newEmployee, ...prev]);
        addToast('success', `Employee "${newEmployee.name}" added`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to add employee.')
      );
  };

  const updateEmployee = (id: string, updatedData: Partial<Employee>) => {
    fetch(`/api/admin-data/employees/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update employee.');
        setEmployees((prev) => prev.map((employee) =>
          employee.id === id ? { ...employee, ...updatedData } : employee
        ));
        addToast('info', 'Employee details updated');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update employee.')
      );
  };

  const deleteEmployee = (id: string) => {
    fetch(`/api/admin-data/employees/${encodeURIComponent(id)}`, { method: 'DELETE' })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to remove employee.');
        setEmployees((prev) => prev.filter((employee) => employee.id !== id));
        addToast('warning', 'Employee removed');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to remove employee.')
      );
  };

  const toggleEmployeeStatus = (id: string) => {
    const employee = employees.find((entry) => entry.id === id);
    if (!employee) return;
    const updatedStatus = employee.status === 'Active' ? 'Inactive' : 'Active';
    updateEmployee(id, { status: updatedStatus });
  };

  // Support Tickets
  const addSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: 't-' + Date.now(),
      ticketNumber: '#TICK-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    fetch('/api/support-tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to create support ticket.');
        const savedTicket = result.ticket as SupportTicket;
        setSupportTickets((prev) => [savedTicket, ...prev]);
        addToast('success', `Ticket ${savedTicket.ticketNumber} created`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to create support ticket.')
      );
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
    fetch(`/api/support-tickets/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update support ticket.');
        setSupportTickets((prev) => prev.map((ticket) =>
          ticket.id === id ? { ...ticket, status } : ticket
        ));
        addToast('info', `Ticket updated to ${status}`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update support ticket.')
      );
  };

  const deleteSupportTicket = (id: string) => {
    fetch(`/api/support-tickets/${encodeURIComponent(id)}`, { method: 'DELETE' })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to delete support ticket.');
        setSupportTickets((prev) => prev.filter((ticket) => ticket.id !== id));
        addToast('warning', 'Ticket deleted');
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to delete support ticket.')
      );
  };

  // Shipping & Returns
  const updateShippingInfo = (
    orderId: string,
    updates: Partial<Pick<Order, 'courier' | 'trackingNumber' | 'shippingStatus'>>
  ) => {
    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update shipment.');
        setOrders((prev) => prev.map((order) =>
          order.id === orderId ? { ...order, ...updates } : order
        ));
        addToast('success', `Shipment for order ${orderId} updated`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update shipment.')
      );
  };

  const markRefunded = (orderId: string) => {
    const order = orders.find((entry) => entry.id === orderId);
    if (!order) {
      addToast('error', 'Order not found.');
      return;
    }
    if (!window.confirm(`Have you already issued the refund in Razorpay? This only updates order ${order.orderNumber}; no payment will be sent.`)) {
      return;
    }

    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: 'Refunded', shippingStatus: 'Returned' }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update refund status.');
        setOrders((prev) => prev.map((entry) =>
          entry.id === orderId
            ? { ...entry, paymentStatus: 'Refunded', shippingStatus: 'Returned' }
            : entry
        ));
        addToast('success', `Order ${order.orderNumber} marked refunded. No payment was sent by this app.`);
      })
      .catch((error) =>
        addToast('error', error instanceof Error ? error.message : 'Failed to update refund status.')
      );
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
        markRefunded,
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
