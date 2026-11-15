import React from 'react';
import { Shield, ShieldCheck, Monitor, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAdminStore } from '../../store/adminStore';

export const SecurityView: React.FC = () => {
  const {
    securitySettings,
    activeSessions,
    stockLogs,
    notifications,
  } = useAdminStore();

  const securityAlerts = notifications.filter((n) => n.type === 'security');

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          Security & Audit Logs
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Review the system audit trail. Authentication and network access controls are managed by Firebase.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        Two-factor authentication, IP allowlisting, and session revocation are not enforced by this panel. Configure authentication directly in Firebase; the values below are informational only.
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
                    Firebase-managed setting; this panel cannot enable or enforce it.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorEnabled}
                  disabled
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-matrin-secondary relative" />
              </label>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-matrin-text dark:text-white mb-1">IP Access Whitelist</h3>
            <p className="text-xs text-matrin-gray dark:text-slate-400 mb-4">
              These saved addresses are not used to restrict access.
            </p>

            <div className="space-y-2">
              {securitySettings.ipWhitelist.length === 0 ? (
                <p className="text-xs text-matrin-gray italic">No IP restrictions configured — all locations allowed.</p>
              ) : (
                securitySettings.ipWhitelist.map((ip) => (
                  <div key={ip} className="flex items-center justify-between px-4 py-2 bg-matrin-bg/60 dark:bg-slate-900/60 rounded-xl border border-matrin-border dark:border-matrin-darkborder">
                    <span className="font-mono text-xs font-bold text-matrin-text dark:text-white">{ip}</span>
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
                  </div>
                </div>
              ))}
              {activeSessions.length === 0 && (
                <p className="text-xs text-matrin-gray italic">Active sessions are not tracked by this panel.</p>
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
                Use Firebase Authentication to manage account access and sign-in security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
