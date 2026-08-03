import React from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingCart,
  Users,
  Star,
  Tag,
  BarChart3,
  TrendingUp,
  DollarSign,
  Megaphone,
  Truck,
  RotateCcw,
  Building2,
  Warehouse,
  Wallet,
  UserCheck,
  LifeBuoy,
  Bell,
  Shield,
  Bot,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { ModuleType } from '../../types';
import { MatrinLogo } from '../ui/MatrinLogo';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  id: ModuleType;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const {
    activeModule,
    setActiveModule,
    isSidebarCollapsed,
    toggleSidebar,
    inventory,
    reviews,
    notifications,
    addToast,
  } = useAdminStore();

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.criticalLevel).length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'Pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-5 h-5" /> },
    { id: 'categories', label: 'Categories', icon: <FolderTree className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes className="w-5 h-5" />, badge: lowStockCount || undefined },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, badge: '5' },
    { id: 'customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-5 h-5" />, badge: pendingReviewsCount || undefined },
    { id: 'promotions', label: 'Promotions', icon: <Tag className="w-5 h-5" /> },
  ];

  const analyticsNavItems: NavItem[] = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'sales-reports', label: 'Sales Reports', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'revenue', label: 'Revenue', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'marketing', label: 'Marketing', icon: <Megaphone className="w-5 h-5" /> },
    { id: 'ai-insights', label: 'AI Insights', icon: <Bot className="w-5 h-5" />, badge: 'New' },
  ];

  const operationsNavItems: NavItem[] = [
    { id: 'shipping', label: 'Shipping', icon: <Truck className="w-5 h-5" /> },
    { id: 'returns', label: 'Returns', icon: <RotateCcw className="w-5 h-5" /> },
    { id: 'suppliers', label: 'Suppliers', icon: <Building2 className="w-5 h-5" /> },
    { id: 'warehouse', label: 'Warehouse', icon: <Warehouse className="w-5 h-5" /> },
    { id: 'finance', label: 'Finance', icon: <Wallet className="w-5 h-5" /> },
    { id: 'employees', label: 'Employees', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'support-tickets', label: 'Support Tickets', icon: <LifeBuoy className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadNotificationsCount || undefined },
    { id: 'security', label: 'Security & Audit', icon: <Shield className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    addToast('info', 'Logged out of MATRIN Enterprise session');
    await logout();
  };

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1 mb-6">
      {!isSidebarCollapsed && (
        <h4 className="px-4 text-[11px] font-bold uppercase tracking-wider text-matrin-gray dark:text-slate-400 mb-2">
          {title}
        </h4>
      )}
      {items.map((item) => {
        const isActive = activeModule === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            title={isSidebarCollapsed ? item.label : undefined}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 group ${
              isActive
                ? 'bg-matrin-primary/10 dark:bg-blue-600/20 text-matrin-primary dark:text-blue-400 font-semibold shadow-card'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`transition-transform duration-150 ${isActive ? 'scale-110 text-matrin-primary dark:text-blue-400' : 'group-hover:scale-105'}`}>
                {item.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </div>

            {!isSidebarCollapsed && item.badge && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-matrin-primary text-white'
                    : 'bg-matrin-primary/10 dark:bg-blue-900/40 text-matrin-primary dark:text-blue-300'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-matrin-darkcard border-r border-matrin-border dark:border-matrin-darkborder flex flex-col justify-between transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-20 px-5 flex items-center justify-between border-b border-matrin-border dark:border-matrin-darkborder">
          <div className="flex items-center gap-3 overflow-hidden">
            {isSidebarCollapsed ? (
              <MatrinLogo variant="icon" />
            ) : (
              <div className="flex flex-col">
                <MatrinLogo className="h-9" />
                <span className="text-[9px] font-extrabold tracking-widest uppercase text-matrin-gray dark:text-slate-400 pl-0.5">
                  Enterprise Admin
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="p-3 overflow-y-auto max-h-[calc(100vh-180px)] space-y-1">
          {renderNavGroup('Main Menu', mainNavItems)}
          {renderNavGroup('Analytics & AI', analyticsNavItems)}
          {renderNavGroup('Management', operationsNavItems)}
        </div>
      </div>

      {/* Footer Support & Logout */}
      <div className="p-3 border-t border-matrin-border dark:border-matrin-darkborder space-y-2 bg-matrin-bg/30 dark:bg-slate-900/30">
        {!isSidebarCollapsed ? (
          <button
            onClick={() => setActiveModule('support-tickets')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-matrin-primary text-white font-semibold text-xs shadow-soft hover:bg-matrin-primary-dark transition-all"
          >
            <Headphones className="w-4 h-4" />
            <span>Support Center</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveModule('support-tickets')}
            title="Support Center"
            className="w-full flex justify-center p-2.5 rounded-xl bg-matrin-primary text-white shadow-soft"
          >
            <Headphones className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
            isSidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
