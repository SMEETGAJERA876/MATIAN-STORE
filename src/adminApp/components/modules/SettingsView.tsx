import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';

export const SettingsView: React.FC = () => {
  const { addToast } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'payments' | 'apikeys' | 'firebase' | 'roles'>('general');

  const [companyName, setCompanyName] = useState('MATRIN Enterprise Home Care Systems');
  const [taxId, setTaxId] = useState('GSTIN-9920149201A');
  const [apiKey] = useState('mtr_live_9941029318491029410294');

  // Firebase state
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/firebase')
      .then((res) => res.json())
      .then((data) => {
        setConnectionStatus(data.status?.ready ? 'success' : 'error');
      })
      .catch(() => setConnectionStatus('error'));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Settings updated successfully');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('idle');
    try {
      const res = await fetch('/api/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConnectionStatus('success');
        addToast('success', data.message || 'Firebase connection successful!');
      } else {
        setConnectionStatus('error');
        addToast('error', data.error || 'Firebase connection test failed.');
      }
    } catch {
      setConnectionStatus('error');
      addToast('error', 'Network error reaching the Firebase API handler.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          System Settings
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Manage platform configuration, MATRIN branding, payment gateways, and Firebase.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-matrin-border dark:border-matrin-darkborder pb-3 overflow-x-auto">
        {[
          { id: 'general', label: 'General & Company' },
          { id: 'branding', label: 'MATRIN Branding' },
          { id: 'payments', label: 'Payment Gateways' },
          { id: 'firebase', label: 'Firebase Database' },
          { id: 'apikeys', label: 'API Keys & Webhooks' },
          { id: 'roles', label: 'Roles Matrix' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
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
                  <div className="font-bold text-sm text-matrin-text dark:text-white">Razorpay (Live)</div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Connected</span>
                </div>
                <div className="p-4 border border-matrin-border dark:border-matrin-darkborder rounded-2xl flex items-center justify-between">
                  <div className="font-bold text-sm text-matrin-text dark:text-white">UPI Instant Payments</div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Connected</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'firebase' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-matrin-text dark:text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-600" />
                    Firebase Realtime Database & Authentication
                  </h3>
                  <p className="text-xs text-matrin-gray dark:text-slate-400 mt-1">
                    Store products, orders, customer details, and admin data in Firebase. Sign-in uses Firebase Authentication.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full ${
                      connectionStatus === 'success'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : connectionStatus === 'error'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'success'
                          ? 'bg-emerald-500 animate-pulse'
                          : connectionStatus === 'error'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    {connectionStatus === 'success'
                      ? 'Configured'
                      : connectionStatus === 'error'
                      ? 'Connection Error'
                      : 'Ready for Config'}
                  </span>
                </div>
              </div>

              <div className="p-4 border border-matrin-border dark:border-matrin-darkborder rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-matrin-text dark:text-white">Firebase project</h4>
                  <p className="text-xs text-matrin-gray mt-1">
                    Project ID: <code>matrin-product</code><br />
                    Realtime Database URL: <code>https://matrin-product-default-rtdb.asia-southeast1.firebasedatabase.app/</code>
                  </p>
                  <p className="text-xs text-matrin-gray mt-2">
                    Configure the Firebase web app settings and server-only service-account JSON in Vercel, then redeploy. Never expose the service-account key in a <code>NEXT_PUBLIC_</code> variable.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  disabled={isTesting}
                  onClick={handleTestConnection}
                  className="flex items-center gap-1.5"
                >
                  {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-matrin-text dark:text-white uppercase tracking-wider">
                  Setup checklist
                </h4>
                <ol className="list-decimal list-inside text-xs text-matrin-gray space-y-1.5 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-matrin-border dark:border-matrin-darkborder">
                  <li>Create the Realtime Database and leave its rules locked (deny client reads and writes).</li>
                  <li>Enable Email/Password in Firebase Authentication and create the admin account.</li>
                  <li>Set <code>ADMIN_EMAIL</code> to the admin account email in Vercel.</li>
                  <li>Add the Firebase Web App API key, auth domain, app ID, project ID, and database URL to the named environment variables.</li>
                  <li>Add the Firebase service-account JSON as server-only <code>FIREBASE_SERVICE_ACCOUNT_JSON</code>, then redeploy.</li>
                </ol>
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

          <div className="pt-4 border-t border-matrin-border flex items-center justify-between">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
