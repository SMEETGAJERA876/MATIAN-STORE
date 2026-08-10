import React, { useState, useEffect } from 'react';
import { Settings, Shield, Key, CreditCard, Building, CheckCircle2, KeyRound, FileSpreadsheet, Copy, Check, RefreshCw, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';

export const SettingsView: React.FC = () => {
  const { user, addToast } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'payments' | 'apikeys' | 'googlesheets' | 'roles'>('general');

  const [companyName, setCompanyName] = useState('MATRIN Enterprise Home Care Systems');
  const [taxId, setTaxId] = useState('GSTIN-9920149201A');
  const [apiKey, setApiKey] = useState('mtr_live_9941029318491029410294');

  // Google Sheets state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [scriptCode, setScriptCode] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Fetch Google Sheets script template & status on mount
    fetch('/api/google-sheets')
      .then((res) => res.json())
      .then((data) => {
        if (data.scriptTemplate) {
          setScriptCode(data.scriptTemplate);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Settings updated successfully');
  };

  const handleSaveWebhook = async () => {
    if (!webhookUrl.trim()) {
      addToast('error', 'Please enter a valid Google Sheets Web App URL');
      return;
    }
    try {
      const res = await fetch('/api/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_webhook',
          webhookUrl: webhookUrl.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConnectionStatus('success');
        addToast('success', 'Google Sheets Webhook URL saved to .env.local!');
      } else {
        addToast('error', data.error || 'Failed to save Webhook URL');
      }
    } catch {
      addToast('error', 'Error saving Webhook URL');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('idle');
    try {
      if (webhookUrl.trim()) {
        await handleSaveWebhook();
      }
      const res = await fetch('/api/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          webhookUrl: webhookUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConnectionStatus('success');
        addToast('success', data.message || 'Google Sheets connection successful!');
      } else {
        setConnectionStatus('error');
        addToast('error', data.error || 'Connection test failed. Check Webhook URL.');
      }
    } catch (err: any) {
      setConnectionStatus('error');
      addToast('error', 'Network error reaching Google Sheets API handler');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncOrders = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_orders',
          webhookUrl: webhookUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast('success', data.message || 'Orders synced to Google Sheets successfully!');
      } else {
        addToast('error', data.error || 'Failed to sync orders');
      }
    } catch (err: any) {
      addToast('error', 'Network error during order sync');
    } finally {
      setIsSyncing(false);
    }
  };

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopiedScript(true);
    addToast('info', 'Google Apps Script snippet copied to clipboard');
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          System Settings
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Manage platform configuration, MATRIN branding, payment gateways, and Google Sheets integrations.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-matrin-border dark:border-matrin-darkborder pb-3 overflow-x-auto">
        {[
          { id: 'general', label: 'General & Company' },
          { id: 'branding', label: 'MATRIN Branding' },
          { id: 'payments', label: 'Payment Gateways' },
          { id: 'googlesheets', label: '📊 Google Sheets Data Collection' },
          { id: 'apikeys', label: 'API Keys & Webhooks' },
          { id: 'roles', label: 'Roles Matrix' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

          {activeTab === 'googlesheets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-matrin-text dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    Google Sheets Data Collection & Order Sync
                  </h3>
                  <p className="text-xs text-matrin-gray dark:text-slate-400 mt-1">
                    Automatically export incoming orders and lead collection forms to a live Google Sheet in real-time.
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
                      ? 'Verified Connected'
                      : connectionStatus === 'error'
                      ? 'Connection Error'
                      : 'Ready for Config'}
                  </span>
                </div>
              </div>

              {/* Step 1: Webhook Configuration */}
              <div className="p-4 border border-matrin-border dark:border-matrin-darkborder rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-3">
                <label className="block text-xs font-bold text-matrin-text dark:text-white">
                  Google Apps Script Webhook Web App URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={isTesting}
                    onClick={handleTestConnection}
                    className="flex items-center gap-1"
                  >
                    {isTesting ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-matrin-primary" />
                    ) : (
                      <Send className="w-4 h-4 text-emerald-600" />
                    )}
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
                <p className="text-[11px] text-matrin-gray">
                  You can set this in <code className="font-mono text-matrin-primary">.env.local</code> as{' '}
                  <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">GOOGLE_SHEETS_WEBHOOK_URL</code> or test directly above.
                </p>
              </div>

              {/* Step 2: Historical Order Sync */}
              <div className="p-4 border border-matrin-border dark:border-matrin-darkborder rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-matrin-text dark:text-white">
                    Sync Existing Orders to Google Sheets
                  </div>
                  <div className="text-xs text-matrin-gray">
                    Export all current store orders into your configured spreadsheet with 1-click.
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  type="button"
                  disabled={isSyncing}
                  onClick={handleSyncOrders}
                  className="flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing Orders...' : 'Sync Orders Now'}
                </Button>
              </div>

              {/* Step 3: Google Apps Script Instructions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-matrin-text dark:text-white uppercase tracking-wider">
                    Quick Setup Guide (30 Seconds)
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={copyScriptToClipboard}
                    className="flex items-center gap-1 text-xs"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedScript ? 'Copied Snippet!' : 'Copy Script Snippet'}
                  </Button>
                </div>

                <ol className="list-decimal list-inside text-xs text-matrin-gray space-y-1.5 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-matrin-border dark:border-matrin-darkborder">
                  <li>Open your <strong>Google Sheet</strong> (or create a new blank one).</li>
                  <li>Click on <strong>Extensions &gt; Apps Script</strong> in the top menu.</li>
                  <li>Delete any sample code, paste the script below, and click <strong>Save</strong>.</li>
                  <li>Click <strong>Deploy &gt; New deployment</strong>, choose type <strong>Web app</strong>.</li>
                  <li>Set <em>Execute as:</em> <strong>Me</strong> and <em>Who has access:</em> <strong>Anyone</strong>.</li>
                  <li>Click <strong>Deploy</strong>, copy the Web app URL, and paste it into the field above!</li>
                </ol>

                <div className="relative">
                  <pre className="p-4 text-xs font-mono bg-slate-900 text-emerald-400 rounded-2xl overflow-x-auto max-h-64 border border-slate-800">
                    {scriptCode || '// Loading Apps Script code snippet...'}
                  </pre>
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
