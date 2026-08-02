import React from 'react';
import { Mail, Phone, Edit, ShoppingBag, ArrowRight } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency } from '../../utils/formatters';

export const CustomerQuickViewDrawer: React.FC = () => {
  const { selectedCustomerId, setSelectedCustomerId, customers, setActiveModule, addToast } = useAdminStore();

  const customer = customers.find((c) => c.id === selectedCustomerId);

  if (!customer) return null;

  return (
    <Drawer
      isOpen={!!selectedCustomerId}
      onClose={() => setSelectedCustomerId(null)}
      title="Quick View"
      width="md"
    >
      <div className="space-y-6">
        {/* Profile Card Center */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-matrin-border dark:border-matrin-darkborder">
          <div className="relative mb-3">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-matrin-primary/10 shadow-soft"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <h3 className="text-xl font-bold text-matrin-text dark:text-white">
            {customer.name}
          </h3>
          <p className="text-xs text-matrin-gray dark:text-slate-400 mt-0.5">
            {customer.email} • {customer.location}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <Badge variant={customer.segment === 'VIP' ? 'vip' : 'info'}>
              {customer.segment} Customer
            </Badge>
            <Badge variant={customer.status === 'Active' ? 'success' : 'neutral'}>
              {customer.status}
            </Badge>
          </div>

          {/* Action Quick Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => addToast('info', `Opening mail client for ${customer.email}`)}
              className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-matrin-secondary hover:bg-blue-100 transition-colors"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToast('info', `Calling ${customer.phone}`)}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="Call Phone"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToast('info', 'Edit Customer Profile')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
              title="Edit Customer"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-2xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-matrin-gray dark:text-slate-400">
              TOTAL ORDERS
            </div>
            <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">
              {customer.totalOrders}
            </div>
          </div>

          <div className="p-4 bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-2xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-matrin-gray dark:text-slate-400">
              LIFETIME VALUE
            </div>
            <div className="text-2xl font-extrabold text-matrin-primary dark:text-blue-400 mt-1">
              {formatCurrency(customer.totalSpent)}
            </div>
          </div>
        </div>

        {/* Recent Purchases List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-matrin-gray dark:text-slate-400">
            RECENT PURCHASES
          </h4>

          <div className="space-y-2">
            {customer.recentPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="p-3 bg-white dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-2xl flex items-center justify-between shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-matrin-primary/10 text-matrin-primary flex items-center justify-center">
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-matrin-text dark:text-white">
                      {purchase.productName}
                    </div>
                    <div className="text-[10px] text-matrin-gray mt-0.5">
                      Order {purchase.id} • {purchase.date}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-matrin-text dark:text-white">
                  {formatCurrency(purchase.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Full Profile CTA */}
        <Button
          variant="primary"
          className="w-full py-3"
          icon={<ArrowRight className="w-4 h-4" />}
          onClick={() => {
            setSelectedCustomerId(null);
            setActiveModule('customers');
          }}
        >
          View Full Profile
        </Button>
      </div>
    </Drawer>
  );
};
