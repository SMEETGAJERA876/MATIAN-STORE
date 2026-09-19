import React, { useState } from 'react';
import { Bell, Package, Star, ShoppingCart, Shield, Info, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { useAdminStore } from '../../store/adminStore';
import { NotificationItem } from '../../types';

const typeIcons: Record<NotificationItem['type'], React.ReactNode> = {
  order: <ShoppingCart className="w-4 h-4" />,
  inventory: <Package className="w-4 h-4" />,
  review: <Star className="w-4 h-4" />,
  system: <Info className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />,
};

const typeColors: Record<NotificationItem['type'], string> = {
  order: 'bg-blue-50 text-matrin-primary dark:bg-blue-950/40',
  inventory: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40',
  review: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40',
  system: 'bg-slate-100 text-slate-600 dark:bg-slate-800',
  security: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40',
};

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, clearNotifications } = useAdminStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Notifications Center
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Real-time feed of order, inventory, review, and security alerts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<CheckCheck className="w-4 h-4" />}
            onClick={() => notifications.filter((n) => !n.read).forEach((n) => markNotificationRead(n.id))}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </Button>
          <Button
            variant="danger"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={clearNotifications}
            disabled={notifications.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Total Notifications</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1 flex items-center gap-2">
            <Bell className="w-6 h-6 text-matrin-primary" /> {notifications.length}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Unread</div>
          <div className="text-3xl font-extrabold text-rose-600 mt-1">{unreadCount}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-3xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-matrin-border dark:border-matrin-darkborder flex items-center gap-1">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all capitalize ${
                filter === f
                  ? 'bg-matrin-primary text-white shadow-soft'
                  : 'text-matrin-gray dark:text-slate-400 hover:text-matrin-text hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="p-4">
          {filtered.length === 0 ? (
            <EmptyState title="No Notifications" description="You're all caught up. New alerts will appear here." icon={<Bell className="w-8 h-8" />} />
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markNotificationRead(n.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer ${
                    n.read
                      ? 'border-transparent hover:bg-matrin-bg/60 dark:hover:bg-slate-800/40'
                      : 'border-matrin-primary/20 bg-matrin-primary/5 dark:bg-blue-950/20'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeColors[n.type]}`}>
                    {typeIcons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-matrin-text dark:text-white">{n.title}</h4>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-matrin-primary shrink-0" />}
                      {n.priority === 'high' && <Badge variant="danger" size="sm">High Priority</Badge>}
                    </div>
                    <p className="text-xs text-matrin-gray dark:text-slate-400 mt-0.5">{n.description}</p>
                    <span className="text-[10px] text-matrin-gray mt-1 block">{n.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
