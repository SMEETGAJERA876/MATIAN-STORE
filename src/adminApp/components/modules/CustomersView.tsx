import React, { useState } from 'react';
import { Plus, Users, UserCheck, UserPlus, Eye, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { Customer } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const CustomersView: React.FC = () => {
  const { customers, setSelectedCustomerId, addToast } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All', count: customers.length },
    { id: 'new', label: 'New', count: customers.filter((c) => c.segment === 'New').length },
    { id: 'returning', label: 'Returning', count: customers.filter((c) => c.segment === 'Returning').length },
    { id: 'vip', label: 'VIP', count: customers.filter((c) => c.segment === 'VIP').length },
    { id: 'inactive', label: 'Inactive', count: customers.filter((c) => c.segment === 'Inactive').length },
  ];

  const filteredCustomers = customers.filter((c) => {
    if (activeTab === 'all') return true;
    return c.segment.toLowerCase() === activeTab;
  });

  const columns: Column<Customer>[] = [
    {
      header: 'CUSTOMER',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-matrin-primary/10"
          />
          <div>
            <div className="font-bold text-matrin-text dark:text-white text-sm">
              {row.name}
            </div>
            <div className="text-xs text-matrin-gray dark:text-slate-400">
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'LOCATION',
      accessorKey: 'location',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-matrin-text dark:text-slate-200">
          {row.location}
        </span>
      ),
    },
    {
      header: 'ORDERS',
      accessorKey: 'totalOrders',
      sortable: true,
      cell: (row) => (
        <span className="text-sm font-extrabold text-matrin-text dark:text-white">
          {row.totalOrders}
        </span>
      ),
    },
    {
      header: 'TOTAL SPENT',
      accessorKey: 'totalSpent',
      sortable: true,
      cell: (row) => (
        <span className="text-sm font-black text-matrin-primary dark:text-blue-400">
          {formatCurrency(row.totalSpent)}
        </span>
      ),
    },
    {
      header: 'SEGMENT',
      accessorKey: 'segment',
      sortable: true,
      cell: (row) => {
        const variants: Record<string, any> = {
          VIP: 'vip',
          Returning: 'info',
          New: 'success',
          Inactive: 'neutral',
        };
        return <Badge variant={variants[row.segment] || 'neutral'}>{row.segment}</Badge>;
      },
    },
    {
      header: 'ACTIONS',
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Eye className="w-4 h-4" />}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCustomerId(row.id);
          }}
        >
          Quick View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Customers
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Manage enterprise accounts, customer segments, lifetime values, and purchase histories.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => addToast('info', 'Add Customer Form')}
        >
          Add Customer
        </Button>
      </div>

      {/* 3 Metrics Cards (Matching Reference Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">
            Total Customers
          </div>
          <div className="text-3xl font-extrabold text-matrin-primary dark:text-white mt-1">
            12,842
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> 12.5% vs last month
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">
            Active this month
          </div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">
            8,291
          </div>
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-2">
            ⚡ 64% retention rate
          </div>
        </div>

        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">
            New Signups
          </div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">
            432
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
            +48 today
          </div>
        </div>
      </div>

      {/* Main Customers Table with Filter Tabs */}
      <DataTable
        title="Customer Directory"
        data={filteredCustomers}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search customers by name, email or location..."
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
        onRowClick={(row) => setSelectedCustomerId(row.id)}
        exportFilename="matrin_customers"
      />
    </div>
  );
};
