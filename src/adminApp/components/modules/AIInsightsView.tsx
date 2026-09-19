import React, { useMemo } from 'react';
import { Bot, AlertTriangle, Trophy, UserX, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency } from '../../utils/formatters';

export const AIInsightsView: React.FC = () => {
  const { products, orders, customers, setActiveModule, setStockAdjustmentModalOpen } = useAdminStore();

  // Units sold per product, derived from real order history
  const unitsSoldByProduct = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((it) => {
        map[it.productId] = (map[it.productId] || 0) + it.quantity;
      });
    });
    return map;
  }, [orders]);

  // Restock priority: low-stock items ranked by how fast they're actually selling
  const restockPriority = useMemo(() => {
    return products
      .filter((p) => (p.stock || 0) <= 15)
      .map((p) => ({
        ...p,
        sold: unitsSoldByProduct[p.id] || 0,
        urgency: (unitsSoldByProduct[p.id] || 0) / ((p.stock || 0) + 1),
      }))
      .sort((a, b) => b.urgency - a.urgency)
      .slice(0, 6);
  }, [products, unitsSoldByProduct]);

  // Best sellers by real units sold
  const bestSellers = useMemo(() => {
    return products
      .map((p) => ({ ...p, sold: unitsSoldByProduct[p.id] || 0 }))
      .filter((p) => p.sold > 0)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
  }, [products, unitsSoldByProduct]);

  // Customers flagged as churn risk
  const churnRisk = useMemo(
    () => customers.filter((c) => c.segment === 'Inactive' || c.status === 'Blocked').slice(0, 6),
    [customers]
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl shadow-card">
          <Bot className="w-6 h-6 text-matrin-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            AI Predictive Intelligence
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Rule-based insights computed live from your real product, order, and customer data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restock Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Restock Recommendations
              </span>
            </CardTitle>
          </CardHeader>
          {restockPriority.length > 0 ? (
            <div className="space-y-2">
              {restockPriority.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-matrin-bg/60 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-matrin-text dark:text-white truncate">{p.name}</div>
                      <div className="text-[11px] text-matrin-gray dark:text-slate-400">
                        {p.sold} sold &middot; {p.stock} left
                      </div>
                    </div>
                  </div>
                  <Badge variant={p.stock <= 5 ? 'danger' : 'warning'} dot>
                    {p.stock <= 5 ? 'Critical' : 'Low'}
                  </Badge>
                </div>
              ))}
              <button
                onClick={() => setActiveModule('inventory')}
                className="text-xs font-bold text-matrin-primary dark:text-blue-400 hover:underline mt-2"
              >
                Manage stock in Inventory &rarr;
              </button>
            </div>
          ) : (
            <p className="text-sm text-matrin-gray dark:text-slate-400 py-6 text-center">
              No products are low on stock right now.
            </p>
          )}
        </Card>

        {/* Best Sellers */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Best Sellers
              </span>
            </CardTitle>
          </CardHeader>
          {bestSellers.length > 0 ? (
            <div className="space-y-2">
              {bestSellers.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-matrin-bg/60 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-black text-matrin-gray dark:text-slate-500 w-4">#{idx + 1}</span>
                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-matrin-text dark:text-white truncate">{p.name}</div>
                      <div className="text-[11px] text-matrin-gray dark:text-slate-400">{p.category}</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-matrin-primary dark:text-blue-400 shrink-0">{p.sold} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-matrin-gray dark:text-slate-400 py-6 text-center">
              No sales recorded yet.
            </p>
          )}
        </Card>
      </div>

      {/* Churn Risk */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-500" /> Customer Churn Risk
            </span>
          </CardTitle>
        </CardHeader>
        {churnRisk.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {churnRisk.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-matrin-border dark:border-matrin-darkborder">
                <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-matrin-text dark:text-white truncate">{c.name}</div>
                  <div className="text-[11px] text-matrin-gray dark:text-slate-400">
                    {formatCurrency(c.lifetimeValue)} lifetime &middot; {c.segment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-matrin-gray dark:text-slate-400 py-6 text-center">
            No customers are currently flagged as at-risk.
          </p>
        )}
      </Card>

      <div className="bg-matrin-primary/5 dark:bg-blue-950/30 border border-matrin-primary/20 dark:border-blue-800/40 rounded-2xl p-4 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-matrin-primary dark:text-blue-400 shrink-0" />
        <p className="text-xs text-matrin-gray dark:text-slate-400">
          These insights update automatically as your products, orders, and customers change — there's nothing to configure.
        </p>
      </div>
    </div>
  );
};
