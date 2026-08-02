import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Megaphone,
  Bot,
  Truck,
  RotateCcw,
  Building2,
  Warehouse,
  Wallet,
  UserCheck,
  LifeBuoy,
  Bell,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAdminStore } from '../../store/adminStore';
import { ModuleType } from '../../types';

export const OtherModulesView: React.FC<{ module: ModuleType }> = ({ module }) => {
  const { addToast } = useAdminStore();

  const moduleMeta: Record<string, { title: string; desc: string; icon: React.ReactNode }> = {
    'sales-reports': { title: 'Sales & Cohort Reports', desc: 'Granular sales breakdowns by category, geographic region, and customer cohort.', icon: <TrendingUp className="w-6 h-6 text-matrin-primary" /> },
    revenue: { title: 'Revenue & Financial Ledgers', desc: 'Real-time gross margin tracking, tax liabilities, payouts, and net profit analytics.', icon: <DollarSign className="w-6 h-6 text-emerald-600" /> },
    marketing: { title: 'Marketing Campaigns', desc: 'Email automation, push notification triggers, SMS engagement, and referral tracking.', icon: <Megaphone className="w-6 h-6 text-indigo-600" /> },
    'ai-insights': { title: 'AI Predictive Intelligence', desc: 'Neural demand forecasting, stock replenishment recommendations, and customer churn prediction.', icon: <Bot className="w-6 h-6 text-matrin-secondary" /> },
    shipping: { title: 'Shipping & Courier Integrations', desc: 'Courier dispatch rules for FedEx, UPS, and DHL Express with automated label printing.', icon: <Truck className="w-6 h-6 text-blue-600" /> },
    returns: { title: 'Returns & RMA Management', desc: 'Customer return requests, inspection workflows, and refund issuance logs.', icon: <RotateCcw className="w-6 h-6 text-rose-600" /> },
    suppliers: { title: 'Suppliers & Vendors', desc: 'Supplier contact directory, procurement lead times, and purchase order logs.', icon: <Building2 className="w-6 h-6 text-amber-600" /> },
    warehouse: { title: 'Warehouse Map & Stock Rules', desc: 'Bin locations, aisle maps, and automated reorder threshold triggers.', icon: <Warehouse className="w-6 h-6 text-slate-700 dark:text-slate-200" /> },
    finance: { title: 'Finance & Payouts', desc: 'Bank payouts, Stripe balance settlements, and enterprise tax invoices.', icon: <Wallet className="w-6 h-6 text-emerald-600" /> },
    employees: { title: 'Employee Directory & Access', desc: 'Team member role assignments, permission matrix, and activity logs.', icon: <UserCheck className="w-6 h-6 text-matrin-primary" /> },
    'support-tickets': { title: 'Customer Support Desk', desc: 'Help desk ticketing queue, SLA resolution timers, and live agent routing.', icon: <LifeBuoy className="w-6 h-6 text-blue-600" /> },
    notifications: { title: 'Notifications Center', desc: 'Realtime notification feed, push alert configuration, and system alerts.', icon: <Bell className="w-6 h-6 text-amber-500" /> },
    security: { title: 'Security & Audit Logs', desc: '2FA authentication settings, IP whitelist, active session revocation, and security logs.', icon: <Shield className="w-6 h-6 text-rose-600" /> },
  };

  const current = moduleMeta[module] || {
    title: module.replace('-', ' ').toUpperCase(),
    desc: 'Enterprise administrative module',
    icon: <CheckCircle2 className="w-6 h-6 text-matrin-primary" />,
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl shadow-card">
          {current.icon}
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            {current.title}
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            {current.desc}
          </p>
        </div>
      </div>

      <Card className="text-center p-12">
        <div className="w-16 h-16 rounded-3xl bg-matrin-primary/10 text-matrin-primary dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
          {current.icon}
        </div>
        <h3 className="text-xl font-bold text-matrin-text dark:text-white mb-2">
          {current.title} Control Panel
        </h3>
        <p className="text-sm text-matrin-gray dark:text-slate-400 max-w-md mx-auto mb-6">
          All data feeds, active sensors, and administrative controls for {current.title.toLowerCase()} are operational and synchronized in real-time.
        </p>
        <Button variant="primary" onClick={() => addToast('success', `${current.title} refreshed`)}>
          Run System Diagnostic
        </Button>
      </Card>
    </div>
  );
};
