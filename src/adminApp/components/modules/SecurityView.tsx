import React, { useState } from 'react';
import { Shield, ShieldCheck, Monitor, X, Plus, Trash2, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAdminStore } from '../../store/adminStore';

export const SecurityView: React.FC = () => {
  const {
    securitySettings,
    toggleTwoFactor,
    addIpToWhitelist,
    removeIpFromWhitelist,
    activeSessions,
    revokeSession,
    stockLogs,
    notifications,
  } = useAdminStore();

  const [newIp, setNewIp] = useState('');

  const securityAlerts = notifications.filter((n) => n.type === 'security');

  const handleAddIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim()) return;
    addIpToWhitelist(newIp.trim());
    setNewIp('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          Security & Audit Logs
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Manage authentication policy, IP access rules, active sessions, and the system audit trail.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2FA + IP Whitelist */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-matrin-text dark:text-white">Two-Factor Authentication</h3>
                  <p className="text-xs text-matrin-gray dark:text-slate-400 mt-0.5">
                    Require an authenticator code for every admin sign-in.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorEnabled}
                  onChange={toggleTwoFactor}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-matrin-secondary relative" />
              </label>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-matrin-text dark:text-white mb-1">IP Access Whitelist</h3>
            <p className="text-xs text-matrin-gray dark:text-slate-400 mb-4">
              Only these IP addresses may access the Enterprise Admin panel.
            </p>

            <form onSubmit={handleAddIp} className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="e.g. 203.0.113.10"
                className="flex-1 px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
              <Button type="submit" variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                Add IP
              </Button>
            </form>

            <div className="space-y-2">
              {securitySettings.ipWhitelist.length === 0 ? (
                <p className="text-xs text-matrin-gray italic">No IP restrictions configured — all locations allowed.</p>
              ) : (
                securitySettings.ipWhitelist.map((ip) => (
                  <div key={ip} className="flex items-center justify-between px-4 py-2 bg-matrin-bg/60 dark:bg-slate-900/60 rounded-xl border border-matrin-border dark:border-matrin-darkborder">
                    <span className="font-mono text-xs font-bold text-matrin-text dark:text-white">{ip}</span>
                    <button
                      onClick={() => removeIpFromWhitelist(ip)}
                      className="p-1 text-matrin-gray hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-matrin-text dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-matrin-secondary" /> Audit Trail
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {[...securityAlerts.map((n) => ({ id: n.id, label: n.title, detail: n.description, timestamp: n.timestamp })),
                ...stockLogs.map((l) => ({ id: l.id, label: `${l.reason}`, detail: `${l.productName} • ${l.performedBy}`, timestamp: l.timestamp }))]
                .slice(0, 10)
                .map((entry) => (
                  <div key={entry.id} className="p-3 bg-matrin-bg/60 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder rounded-2xl text-xs">
                    <div className="font-bold text-matrin-text dark:text-white">{entry.label}</div>
                    <div className="text-matrin-gray mt-0.5">{entry.detail} • {entry.timestamp}</div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Active Sessions */}
        <div>
          <Card>
            <h3 className="text-sm font-bold text-matrin-text dark:text-white mb-4 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-matrin-primary" /> Active Sessions
            </h3>
            <div className="space-y-3">
              {activeSessions.map((s) => (
                <div key={s.id} className="p-3 bg-matrin-bg/60 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder rounded-2xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-matrin-text dark:text-white flex items-center gap-1.5">
                        {s.device}
                        {s.current && <Badge variant="success" size="sm">This device</Badge>}
                      </div>
                      <div className="text-[10px] text-matrin-gray mt-1">{s.location} • {s.ipAddress}</div>
                      <div className="text-[10px] text-matrin-gray mt-0.5">{s.lastActive}</div>
                    </div>
                    {!s.current && (
                      <button
                        onClick={() => revokeSession(s.id)}
                        className="p-1.5 text-matrin-gray hover:text-rose-600 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {activeSessions.length === 0 && (
                <p className="text-xs text-matrin-gray italic">No other active sessions.</p>
              )}
            </div>
          </Card>

          <div className="mt-6 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-3xl p-6 flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-soft">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-rose-600 dark:text-rose-400">Security Reminder</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                Revoke sessions from devices you no longer use and keep the IP whitelist limited to trusted networks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
