import React, { useState } from 'react';
import { Settings, Shield, Key, CreditCard, Building, CheckCircle2, KeyRound } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';

export const SettingsView: React.FC = () => {
  const { user, addToast } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'payments' | 'apikeys' | 'roles'>('general');

  const [companyName, setCompanyName] = useState('MATRIN Enterprise Home Care Systems');
  const [taxId, setTaxId] = useState('GSTIN-9920149201A');
  const [apiKey, setApiKey] = useState('mtr_live_9941029318491029410294');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Settings updated successfully');
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          System Settings
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Manage platform configuration, MATRIN branding, payment gateway integrations, and API keys.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-matrin-border dark:border-matrin-darkborder pb-3 overflow-x-auto">
        {[
          { id: 'general', label: 'General & Company' },
          { id: 'branding', label: 'MATRIN Branding' },
          { id: 'payments', label: 'Payment Gateways' },
          { id: 'apikeys', label: 'API Keys & Webhooks' },
          { id: 'roles', label: 'Roles Matrix' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-matrin-primary text-white shadow-soft'
                : 'text-matrin-gray hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-matrin-text dark:text-white">Company Identity</h3>
              <div>
                <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">
                  Company Legal Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full max-w-md px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">
                  GST / Tax Registration Number
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full max-w-md px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary font-mono"
                />
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-matrin-text dark:text-white">Brand Tokens & Logo</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-matrin-primary text-white flex items-center justify-center font-black text-2xl shadow-soft">
                  M
                </div>
                <div>
                  <div className="text-xs font-bold text-matrin-text dark:text-white">MATRIN Official Logo</div>
                  <div className="text-[11px] text-matrin-gray">Primary Color: #0B3A75 • Radius: 16px</div>
                  <Button variant="outline" size="sm" className="mt-2" type="button" onClick={() => addToast('info', 'Logo updated')}>
                    Upload New Logo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-matrin-text dark:text-white">Connected Payment Gateways</h3>
              <div className="space-y-3 max-w-md">
                <div className="p-4 border border-matrin-border dark:border-matrin-darkborder rounded-2xl flex items-center justify-between">
                  <div className="font-bold text-sm text-matrin-text dark:text-white">Stripe Payments</div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Connected</span>
                </div>
                <div className="p-4 border border-matrin-border dark:border-matrin-darkborder rounded-2xl flex items-center justify-between">
                  <div className="font-bold text-sm text-matrin-text dark:text-white">PayPal Express</div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Connected</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apikeys' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-matrin-text dark:text-white">Live API Secret Key</h3>
              <div>
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="w-full max-w-md px-4 py-2 text-sm font-mono bg-matrin-bg dark:bg-slate-900 border border-matrin-border rounded-xl"
                />
              </div>
              <Button variant="outline" size="sm" type="button" onClick={() => addToast('success', 'New API secret key generated')}>
                Regenerate Key
              </Button>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-matrin-text dark:text-white">Role Permission Matrix</h3>
              <div className="text-xs text-matrin-gray">
                Super Admin has unrestricted read/write access across catalog, financial payouts, and employee accounts.
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-matrin-border">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
