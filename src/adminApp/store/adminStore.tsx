import React, { createContext, useContext, useState, useEffect } from 'react';
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
} from '../types';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface StockMovementLog {
  id: string;
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

  // Mutators / Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  importProducts: (products: Partial<Product>[]) => void;

  // Stock Management Action
  adjustProductStockByName: (
    productIdentifier: string,
    quantityToAdd: number,
    warehouse: string,
    reason: string
  ) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  toggleCategoryStatus: (id: string) => void;

  updateOrderStatus: (id: string, paymentStatus: Order['paymentStatus'], shippingStatus: Order['shippingStatus']) => void;

  updateReviewStatus: (id: string, status: Review['status']) => void;
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;

  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
}

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'MATRIN X1 Robotic Vacuum & Mop',
    sku: 'MTR-X1-ROBOT',
    barcode: '8901234567891',
    category: 'Floor Care',
    brand: 'MATRIN Enterprise',
    price: 899.00,
    discountPrice: 799.00,
    gst: 18,
    stock: 14,
    reservedStock: 2,
    warehouse: 'San Jose Logistics Hub',
    vendor: 'MATRIN Robotics Division',
    weight: '4.2 kg',
    dimensions: '35x35x9.8 cm',
    visibility: 'Published',
    status: 'In Stock',
    rating: 4.9,
    reviewsCount: 142,
    createdAt: '2023-01-15',
    updatedAt: '2023-10-20',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    description: 'Precision lidar navigation, 5000Pa suction power, auto-empty station, and intelligent ultrasonic carpet detection.',
  },
  {
    id: 'prod-2',
    name: 'MATRIN Eco-Clean Refill Bundle',
    sku: 'MTR-ECO-99',
    barcode: '8901234567892',
    category: 'Eco-Series',
    brand: 'MATRIN Pure',
    price: 45.00,
    gst: 12,
    stock: 3,
    reservedStock: 1,
    warehouse: 'Austin Distribution Facility',
    vendor: 'GreenChem Industries',
    weight: '1.1 kg',
    dimensions: '20x10x15 cm',
    visibility: 'Published',
    status: 'Low Stock',
    rating: 4.8,
    reviewsCount: 98,
    createdAt: '2023-03-10',
    updatedAt: '2023-10-24',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: '100% plant-based concentrate Pods. Makes 10 liters of non-toxic multi-surface cleaning formula.',
  },
  {
    id: 'prod-3',
    name: 'MATRIN Fabric Care Pro Sanitizer',
    sku: 'MTR-FAB-88',
    barcode: '8901234567893',
    category: 'Fabric Care',
    brand: 'MATRIN Care',
    price: 219.00,
    discountPrice: 189.00,
    gst: 18,
    stock: 342,
    reservedStock: 15,
    warehouse: 'San Jose Logistics Hub',
    vendor: 'MATRIN Tech Ltd',
    weight: '3.5 kg',
    dimensions: '30x25x40 cm',
    visibility: 'Published',
    status: 'In Stock',
    rating: 4.9,
    reviewsCount: 342,
    createdAt: '2023-02-01',
    updatedAt: '2023-10-18',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80',
    description: 'Dry steam technology eliminates 99.9% of bacteria and allergens from bedsheets, upholstery, and delicate garments.',
  },
  {
    id: 'prod-4',
    name: 'MATRIN Pro Dishwashing Hub',
    sku: 'MTR-DISH-01',
    barcode: '8901234567894',
    category: 'Dishwashing',
    brand: 'MATRIN Enterprise',
    price: 349.00,
    gst: 18,
    stock: 128,
    reservedStock: 8,
    warehouse: 'Chicago Regional Hub',
    vendor: 'MATRIN Home Appliance',
    weight: '8.5 kg',
    dimensions: '45x45x50 cm',
    visibility: 'Published',
    status: 'In Stock',
    rating: 4.7,
    reviewsCount: 88,
    createdAt: '2023-04-12',
    updatedAt: '2023-10-22',
    image: 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
    description: 'Countertop ultra-sonic dishwashing and UV sterilizing station with eco air drying mode.',
  },
  {
    id: 'prod-5',
    name: 'MATRIN Universal Surface Cleaner 5L',
    sku: 'MTR-SURF-50',
    barcode: '8901234567895',
    category: 'Surface Cleaners',
    brand: 'MATRIN Pure',
    price: 68.00,
    gst: 12,
    stock: 215,
    reservedStock: 10,
    warehouse: 'Austin Distribution Facility',
    vendor: 'MATRIN Chemicals',
    weight: '5.2 kg',
    dimensions: '25x18x35 cm',
    visibility: 'Published',
    status: 'In Stock',
    rating: 4.6,
    reviewsCount: 154,
    createdAt: '2023-05-18',
    updatedAt: '2023-10-25',
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop&q=80',
    description: 'Commercial grade streak-free formula suitable for marble, granite, stainless steel, and glass.',
  },
  {
    id: 'prod-6',
    name: 'MATRIN Pure Fragrance Diffuser',
    sku: 'MTR-FRAG-12',
    barcode: '8901234567896',
    category: 'Fragrance',
    brand: 'MATRIN Essence',
    price: 129.00,
    gst: 18,
    stock: 54,
    reservedStock: 4,
    warehouse: 'San Jose Logistics Hub',
    vendor: 'MATRIN Aroma Labs',
    weight: '0.8 kg',
    dimensions: '12x12x20 cm',
    visibility: 'Published',
    status: 'In Stock',
    rating: 4.8,
    reviewsCount: 62,
    createdAt: '2023-06-05',
    updatedAt: '2023-10-15',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80',
    description: 'Cold-air nebulizing technology distributes essential oil micro-droplets without heat or water dilution.',
  },
];

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
const initialEmployees: Employee[] = [
  { id: 'emp-1', name: 'MATRIN Admin', email: 'admin@matrin.com', role: 'Super Admin', department: 'Executive', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', lastActive: 'Online now' },
];
const initialSupportTickets: SupportTicket[] = [];
const initialNotifications: NotificationItem[] = [];
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

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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
        const [resProd, resOrd] = await Promise.all([
          fetch(`${apiBase}/products`),
          fetch(`${apiBase}/orders`),
        ]);

        if (resProd.ok) {
          const apiProducts = await resProd.json();
          if (Array.isArray(apiProducts) && apiProducts.length > 0) {
            setProducts(
              apiProducts.map((p: any) => ({
                id: String(p.id),
                name: p.name,
                sku: p.sku || `MTR-${p.id}`,
                barcode: `890123456789${p.id}`,
                category: p.category || 'General',
                brand: 'MATRIN Enterprise',
                price: Number(p.price) || 299,
                gst: 18,
                stock: Number(p.stock) || 100,
                reservedStock: 2,
                warehouse: 'Main Central Hub',
                vendor: 'MATRIN Systems',
                weight: '1.2 kg',
                dimensions: '20x15x30 cm',
                visibility: p.inStock ? 'Published' : 'Draft',
                status: p.stock > 0 ? 'In Stock' : 'Low Stock',
                rating: p.rating || 4.8,
                reviewsCount: p.reviewsCount || 10,
                createdAt: p.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
                updatedAt: p.updatedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
                image: p.image || 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&auto=format&fit=crop&q=80',
                description: p.description || '',
              }))
            );
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

  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: 'prod-' + (products.length + 1),
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast('success', `Product "${newProduct.name}" created successfully!`);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData, updatedAt: new Date().toISOString().slice(0, 10) } : p))
    );
    addToast('info', 'Product details updated');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('warning', 'Product deleted from catalog');
  };

  const bulkDeleteProducts = (ids: string[]) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
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
            ? { ...i, currentStock: updatedStock, lastRestocked: new Date().toISOString().slice(0, 10) }
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
      productName: targetProd.name,
      sku: targetProd.sku,
      quantityChange: quantityToAdd,
      warehouse: warehouse || targetProd.warehouse,
      reason: reason || 'Manual Stock Adjustment',
      timestamp: 'Just now',
      performedBy: user.name + ' (' + user.role + ')',
    };
    setStockLogs((prev) => [newLog, ...prev]);

    addToast(
      'success',
      `Stock updated for "${targetProd.name}": ${quantityToAdd >= 0 ? '+' : ''}${quantityToAdd} units (New Total: ${updatedStock})`
    );
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: 'cat-' + (categories.length + 1),
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', `Category "${newCat.name}" added successfully`);
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
      )
    );
    addToast('info', 'Category status updated');
  };

  const updateOrderStatus = (
    id: string,
    paymentStatus: Order['paymentStatus'],
    shippingStatus: Order['shippingStatus']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, paymentStatus, shippingStatus } : o))
    );
    addToast('success', `Order ${id} status updated`);
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    addToast('info', `Review updated to ${status}`);
  };

  const addPromotion = (promoData: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = {
      ...promoData,
      id: 'promo-' + (promotions.length + 1),
    };
    setPromotions((prev) => [newPromo, ...prev]);
    addToast('success', `Coupon code "${newPromo.code}" generated!`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('info', 'All notifications cleared');
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
        addProduct,
        updateProduct,
        deleteProduct,
        bulkDeleteProducts,
        importProducts,
        adjustProductStockByName,
        addCategory,
        toggleCategoryStatus,
        updateOrderStatus,
        updateReviewStatus,
        addPromotion,
        markNotificationRead,
        clearNotifications,
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
