import React, { useEffect } from 'react';
import { AdminProvider, useAdminStore } from './store/adminStore';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { CSVImportModal } from './components/layout/CSVImportModal';
import { CustomerQuickViewDrawer } from './components/layout/CustomerQuickViewDrawer';
import { OrderInvoiceModal } from './components/layout/OrderInvoiceModal';
import { AIChatDrawer } from './components/layout/AIChatDrawer';
import { StockAdjustmentModal } from './components/layout/StockAdjustmentModal';
import { ToastsContainer } from './components/ui/Toast';

import { DashboardView } from './components/modules/DashboardView';
import { ProductsView } from './components/modules/ProductsView';
import { CategoriesView } from './components/modules/CategoriesView';
import { InventoryView } from './components/modules/InventoryView';
import { OrdersView } from './components/modules/OrdersView';
import { CustomersView } from './components/modules/CustomersView';
import { ReviewsView } from './components/modules/ReviewsView';
import { PromotionsView } from './components/modules/PromotionsView';
import { AnalyticsView } from './components/modules/AnalyticsView';
import { SettingsView } from './components/modules/SettingsView';
import { OtherModulesView } from './components/modules/OtherModulesView';
import { ModuleType } from './types';

export const MainLayout: React.FC<{ initialModule?: string }> = ({ initialModule }) => {
  const { activeModule, setActiveModule, isSidebarCollapsed } = useAdminStore();

  useEffect(() => {
    if (initialModule && initialModule !== 'login') {
      setActiveModule(initialModule as ModuleType);
    } else if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'admin' && pathParts[1] && pathParts[1] !== 'login') {
        setActiveModule(pathParts[1] as ModuleType);
      }
    }
  }, [initialModule, setActiveModule]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const targetPath = activeModule === 'dashboard' ? '/admin/dashboard' : `/admin/${activeModule}`;
      if (currentPath !== targetPath && currentPath.startsWith('/admin') && !currentPath.includes('/login')) {
        window.history.replaceState(null, '', targetPath);
      }
    }
  }, [activeModule]);

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'products':
        return <ProductsView />;
      case 'categories':
        return <CategoriesView />;
      case 'inventory':
        return <InventoryView />;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return <CustomersView />;
      case 'reviews':
        return <ReviewsView />;
      case 'promotions':
        return <PromotionsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OtherModulesView module={activeModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-matrin-bg dark:bg-matrin-darkbg text-matrin-text dark:text-matrin-darktext flex transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Navbar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderModuleContent()}
        </main>
      </div>

      {/* Global Modals, Drawers & Overlays */}
      <CommandPalette />
      <CSVImportModal />
      <CustomerQuickViewDrawer />
      <OrderInvoiceModal />
      <AIChatDrawer />
      <StockAdjustmentModal />
      <ToastsContainer />
    </div>
  );
};

export function App() {
  return (
    <AdminProvider>
      <MainLayout />
    </AdminProvider>
  );
}

export default App;
