import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Tag,
  BarChart3,
  Settings,
  Plus,
  Download,
  Moon,
  Sun,
  Shield,
  Boxes,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActiveModule,
    toggleDarkMode,
    isDarkMode,
    setAddProductModalOpen,
    setCreateCouponModalOpen,
    setCSVImportModalOpen,
    setStockAdjustmentModalOpen,
  } = useAdminStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const commands = [
    { label: 'Add Product Stock by Name', icon: <Boxes className="w-4 h-4 text-matrin-secondary" />, action: () => setStockAdjustmentModalOpen(true) },
    { label: 'Go to Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, action: () => setActiveModule('dashboard') },
    { label: 'View Products Catalog', icon: <Package className="w-4 h-4" />, action: () => setActiveModule('products') },
    { label: 'Create New Product', icon: <Plus className="w-4 h-4" />, action: () => setAddProductModalOpen(true) },
    { label: 'View Orders', icon: <ShoppingCart className="w-4 h-4" />, action: () => setActiveModule('orders') },
    { label: 'View Customers', icon: <Users className="w-4 h-4" />, action: () => setActiveModule('customers') },
    { label: 'Reviews Moderation', icon: <Star className="w-4 h-4" />, action: () => setActiveModule('reviews') },
    { label: 'Promotions & Coupons', icon: <Tag className="w-4 h-4" />, action: () => setActiveModule('promotions') },
    { label: 'Create Coupon Code', icon: <Plus className="w-4 h-4" />, action: () => setCreateCouponModalOpen(true) },
    { label: 'Analytics Reports', icon: <BarChart3 className="w-4 h-4" />, action: () => setActiveModule('analytics') },
    { label: 'Import CSV Data', icon: <Download className="w-4 h-4" />, action: () => setCSVImportModalOpen(true) },
    { label: 'Toggle Dark / Light Mode', icon: isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />, action: toggleDarkMode },
    { label: 'System Settings', icon: <Settings className="w-4 h-4" />, action: () => setActiveModule('settings') },
    { label: 'Security & Audit Logs', icon: <Shield className="w-4 h-4" />, action: () => setActiveModule('security') },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Command Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-xl bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-3xl shadow-elevated overflow-hidden z-10"
        >
          {/* Input Header */}
          <div className="p-4 border-b border-matrin-border dark:border-matrin-darkborder flex items-center gap-3">
            <Search className="w-5 h-5 text-matrin-gray dark:text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search section..."
              className="w-full bg-transparent border-none outline-none text-base text-matrin-text dark:text-white placeholder-matrin-gray"
            />
          </div>

          {/* List of items */}
          <div className="p-2 max-h-80 overflow-y-auto divide-y divide-matrin-border/50 dark:divide-slate-800">
            {filteredCommands.length === 0 ? (
              <div className="p-6 text-center text-sm text-matrin-gray">
                No matching commands found
              </div>
            ) : (
              filteredCommands.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    setCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-matrin-text dark:text-slate-200 hover:bg-matrin-primary/10 dark:hover:bg-blue-900/30 hover:text-matrin-primary dark:hover:text-blue-400 rounded-2xl transition-colors font-medium text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Jump</span>
                </button>
              ))
            )}
          </div>

          {/* Footer keyboard hint */}
          <div className="px-4 py-2.5 border-t border-matrin-border dark:border-matrin-darkborder bg-matrin-bg/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-matrin-gray">
            <span>Tip: Press ESC to close palette</span>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">↓</kbd>
              <span>to navigate</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
