import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  Bot,
  Command,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

export const Navbar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    isDarkMode,
    toggleDarkMode,
    setCommandPaletteOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    user,
    notifications,
    markNotificationRead,
    setAIChatOpen,
  } = useAdminStore();

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const moduleTitles: Record<string, string> = {
    dashboard: 'MATRIN Dashboard',
    products: 'Product Catalog',
    'product-details': 'Product Details',
    categories: 'Category Management',
    inventory: 'Inventory & Warehouse',
    orders: 'Orders & Fulfillment',
    customers: 'Customers',
    reviews: 'Reviews Moderation',
    promotions: 'Promotions Manager',
    analytics: 'Analytics & Insights',
    'sales-reports': 'Sales Reports',
    revenue: 'Revenue & Financials',
    marketing: 'Marketing Campaigns',
    shipping: 'Shipping & Delivery',
    returns: 'Returns Management',
    suppliers: 'Suppliers & Procurement',
    warehouse: 'Warehouse Operations',
    finance: 'Finance & Ledger',
    employees: 'Employee Roles Matrix',
    'support-tickets': 'Support Center',
    notifications: 'Notifications Center',
    security: 'Security & Audit Logs',
    'ai-insights': 'AI Enterprise Forecast',
    settings: 'System Settings',
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-matrin-darkcard/80 backdrop-blur-md border-b border-matrin-border dark:border-matrin-darkborder px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-matrin-gray dark:text-slate-400">
            <span>MATRIN Enterprise</span>
            <span>/</span>
            <span className="capitalize text-matrin-primary dark:text-blue-400 font-bold">
              {activeModule.replace('-', ' ')}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            {moduleTitles[activeModule] || 'Enterprise Admin'}
          </h1>
        </div>
      </div>

      {/* Center: Global Search / Command Palette shortcut */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div
          onClick={() => setCommandPaletteOpen(true)}
          className="relative flex items-center bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-2xl px-4 py-2 text-sm text-matrin-gray cursor-pointer hover:border-matrin-primary transition-colors group"
        >
          <Search className="w-4 h-4 mr-2.5 text-matrin-gray group-hover:text-matrin-primary" />
          <input
            type="text"
            readOnly
            value={globalSearchQuery}
            placeholder="Search products, orders, customers, sku..."
            className="w-full bg-transparent border-none outline-none cursor-pointer text-matrin-text dark:text-matrin-darktext placeholder-matrin-gray text-xs"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-800 border border-matrin-border dark:border-matrin-darkborder rounded-md text-matrin-gray shadow-card shrink-0">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>
      </div>

      {/* Right Actions Toolbar */}
      <div className="flex items-center gap-3">
        {/* AI Assistant Button */}
        <button
          onClick={() => setAIChatOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-soft hover:brightness-110 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className="p-2.5 rounded-2xl text-matrin-gray hover:text-matrin-text dark:text-slate-300 dark:hover:text-white hover:bg-matrin-bg dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl shadow-elevated p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-matrin-border dark:border-matrin-darkborder mb-3">
                <span className="font-bold text-sm text-matrin-text dark:text-white">
                  Notifications ({unreadCount})
                </span>
                <button
                  onClick={() => setActiveModule('notifications')}
                  className="text-xs text-matrin-secondary font-semibold hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                      n.read ? 'bg-transparent' : 'bg-matrin-primary/5 dark:bg-blue-950/30'
                    }`}
                  >
                    <div className="font-bold text-matrin-text dark:text-white">{n.title}</div>
                    <div className="text-matrin-gray dark:text-slate-400 mt-0.5">{n.description}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{n.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-2xl text-matrin-gray hover:text-matrin-text dark:text-slate-300 dark:hover:text-white hover:bg-matrin-bg dark:hover:bg-slate-800 transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Help Center */}
        <button
          onClick={() => setActiveModule('support-tickets')}
          className="p-2.5 rounded-2xl text-matrin-gray hover:text-matrin-text dark:text-slate-300 dark:hover:text-white hover:bg-matrin-bg dark:hover:bg-slate-800 transition-colors hidden sm:block"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-matrin-border dark:bg-matrin-darkborder mx-1" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 rounded-2xl hover:bg-matrin-bg dark:hover:bg-slate-800 transition-colors"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-2xl object-cover ring-2 ring-matrin-primary/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-matrin-text dark:text-white leading-none flex items-center gap-1.5">
                {user.name}
                <ShieldCheck className="w-3.5 h-3.5 text-matrin-secondary" />
              </div>
              <div className="text-[10px] font-semibold uppercase text-matrin-gray dark:text-slate-400 mt-1">
                {user.role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-matrin-gray" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl shadow-elevated p-2 z-50">
              <div className="px-3 py-2 border-b border-matrin-border dark:border-matrin-darkborder mb-1">
                <div className="font-bold text-xs text-matrin-text dark:text-white">{user.name}</div>
                <div className="text-[10px] text-matrin-gray truncate">{user.email}</div>
              </div>
              <button
                onClick={() => {
                  setActiveModule('settings');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <User className="w-4 h-4" /> Profile & Settings
              </button>
              <button
                onClick={() => {
                  setActiveModule('employees');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <ShieldCheck className="w-4 h-4" /> Role Matrix
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
