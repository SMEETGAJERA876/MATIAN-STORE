import React, { useMemo } from 'react';
import { TrendingUp, ShoppingBag, Layers, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency } from '../../utils/formatters';

interface ProductSalesRow {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
}

export const SalesReportsView: React.FC = () => {
  const { orders, products } = useAdminStore();

  const validOrders = useMemo(
    () => orders.filter((o) => o.paymentStatus !== 'Failed' && o.shippingStatus !== 'Cancelled'),
    [orders]
  );

  const totalSales = useMemo(() => validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [validOrders]);
  const orderCount = validOrders.length;
  const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

  // Revenue broken down by product category
  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    validOrders.forEach((o) => {
      o.items.forEach((it) => {
        const product = products.find((p) => p.id === it.productId);
        const cat = product?.category || 'General';
        catMap[cat] = (catMap[cat] || 0) + it.totalPrice;
      });
    });
    return Object.entries(catMap)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [validOrders, products]);

  const topCategory = categoryData[0]?.category || 'N/A';

  // Top selling products by revenue
  const productSales = useMemo(() => {
    const map: Record<string, ProductSalesRow> = {};
    validOrders.forEach((o) => {
      o.items.forEach((it) => {
        const product = products.find((p) => p.id === it.productId);
        if (!map[it.productId]) {
          map[it.productId] = {
            id: it.productId,
            name: it.productName,
            category: product?.category || 'General',
            unitsSold: 0,
            revenue: 0,
          };
        }
        map[it.productId].unitsSold += it.quantity;
        map[it.productId].revenue += it.totalPrice;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [validOrders, products]);

  const columns: Column<ProductSalesRow>[] = [
    {
      header: 'PRODUCT',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <span className="font-bold text-xs text-matrin-text dark:text-white">{row.name}</span>
      ),
    },
    {
      header: 'CATEGORY',
      accessorKey: 'category',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-medium text-matrin-gray dark:text-slate-400">{row.category}</span>
      ),
    },
    {
      header: 'UNITS SOLD',
      accessorKey: 'unitsSold',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-bold text-matrin-text dark:text-white">{row.unitsSold}</span>
      ),
    },
    {
      header: 'REVENUE',
      accessorKey: 'revenue',
      sortable: true,
      cell: (row) => (
        <span className="text-sm font-black text-matrin-primary dark:text-blue-400">
          {formatCurrency(row.revenue)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
          Sales & Cohort Reports
        </h2>
        <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
          Sales breakdowns by product category, computed live from your order history.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <TrendingUp className="w-4 h-4" /> Total Sales
          </div>
          <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">
            {formatCurrency(totalSales)}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <ShoppingBag className="w-4 h-4" /> Orders
          </div>
          <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">{orderCount}</div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <Layers className="w-4 h-4" /> Avg Order Value
          </div>
          <div className="text-2xl font-extrabold text-matrin-text dark:text-white mt-1">
            {formatCurrency(avgOrderValue)}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-matrin-gray dark:text-slate-400">
            <Award className="w-4 h-4" /> Top Category
          </div>
          <div className="text-2xl font-extrabold text-matrin-primary dark:text-blue-400 mt-1">{topCategory}</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        {categoryData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenue']} />
                <Bar dataKey="revenue" fill="#0B3A75" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-matrin-gray dark:text-slate-400 py-8 text-center">
            No sales recorded yet — revenue by category will appear once orders come in.
          </p>
        )}
      </Card>

      <DataTable
        title="Top Selling Products"
        data={productSales}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search products..."
        exportFilename="matrin_sales_by_product"
      />
    </div>
  );
};
