import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Building2, Mail, Phone, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { DataTable, Column } from '../ui/DataTable';
import { Tooltip } from '../ui/Tooltip';
import { useAdminStore } from '../../store/adminStore';
import { Supplier } from '../../types';

const emptyForm = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  category: 'Automation & Hardware',
  leadTimeDays: 14,
  status: 'Active' as Supplier['status'],
};

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useAdminStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isModalOpen) return;
    if (editing) {
      setForm({
        name: editing.name,
        contactPerson: editing.contactPerson,
        email: editing.email,
        phone: editing.phone,
        category: editing.category,
        leadTimeDays: editing.leadTimeDays,
        status: editing.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [isModalOpen, editing]);

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) {
      updateSupplier(editing.id, form);
    } else {
      addSupplier(form);
    }
    closeModal();
  };

  const activeCount = suppliers.filter((s) => s.status === 'Active').length;
  const avgLeadTime = suppliers.length
    ? Math.round(suppliers.reduce((sum, s) => sum + s.leadTimeDays, 0) / suppliers.length)
    : 0;

  const columns: Column<Supplier>[] = [
    {
      header: 'SUPPLIER',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-matrin-text dark:text-white">{row.name}</div>
            <div className="text-[10px] text-matrin-gray">{row.category}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'CONTACT',
      accessorKey: 'contactPerson',
      sortable: true,
      cell: (row) => (
        <div className="text-xs">
          <div className="font-bold text-matrin-text dark:text-white">{row.contactPerson}</div>
          <div className="flex items-center gap-1 text-matrin-gray mt-0.5">
            <Mail className="w-3 h-3" /> {row.email}
          </div>
          <div className="flex items-center gap-1 text-matrin-gray mt-0.5">
            <Phone className="w-3 h-3" /> {row.phone}
          </div>
        </div>
      ),
    },
    {
      header: 'LEAD TIME',
      accessorKey: 'leadTimeDays',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1.5 text-xs font-bold text-matrin-text dark:text-white">
          <Clock className="w-3.5 h-3.5 text-matrin-gray" /> {row.leadTimeDays} days
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => {
        const variants: Record<string, any> = { Active: 'success', 'On Hold': 'warning', 'Under Review': 'danger' };
        return <Badge variant={variants[row.status] || 'neutral'} dot>{row.status}</Badge>;
      },
    },
    {
      header: 'ACTIONS',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Tooltip label="Edit Supplier">
            <button
              onClick={() => {
                setEditing(row);
                setModalOpen(true);
              }}
              className="p-2 text-matrin-gray hover:text-matrin-primary dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip label="Remove Supplier">
            <button
              onClick={() => deleteSupplier(row.id)}
              className="p-2 text-matrin-gray hover:text-rose-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Suppliers & Vendors
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Manage your supplier directory, procurement lead times, and vendor relationships.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Total Suppliers</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">{suppliers.length}</div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Active Vendors</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">{activeCount}</div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Avg. Lead Time</div>
          <div className="text-3xl font-extrabold text-matrin-primary dark:text-blue-400 mt-1">{avgLeadTime}d</div>
        </div>
      </div>

      <DataTable
        title="Supplier Directory"
        data={suppliers}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search suppliers by name, category, or contact..."
        exportFilename="matrin_suppliers"
        onBulkDelete={(ids) => ids.forEach((id) => deleteSupplier(id))}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Edit Supplier' : 'Add New Supplier'} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Supplier Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Category</label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Phone</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Lead Time (days)</label>
              <input
                type="number"
                min={1}
                required
                value={form.leadTimeDays}
                onChange={(e) => setForm({ ...form, leadTimeDays: Number(e.target.value) })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Supplier['status'] })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              >
                <option>Active</option>
                <option>On Hold</option>
                <option>Under Review</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-matrin-border dark:border-matrin-darkborder">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit">{editing ? 'Save Changes' : 'Add Supplier'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
