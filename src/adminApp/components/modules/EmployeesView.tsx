import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit3, Trash2, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { DataTable, Column } from '../ui/DataTable';
import { Tooltip } from '../ui/Tooltip';
import { useAdminStore } from '../../store/adminStore';
import { Employee } from '../../types';

const roleOptions: Employee['role'][] = ['Super Admin', 'Admin', 'Manager', 'Warehouse', 'Support', 'Accountant', 'Editor'];

const emptyForm = {
  name: '',
  email: '',
  role: 'Editor' as Employee['role'],
  department: 'Operations',
  status: 'Active' as Employee['status'],
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
};

export const EmployeesView: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus } = useAdminStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isModalOpen) return;
    if (editing) {
      setForm({
        name: editing.name,
        email: editing.email,
        role: editing.role,
        department: editing.department,
        status: editing.status,
        avatar: editing.avatar,
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
      updateEmployee(editing.id, form);
    } else {
      addEmployee({ ...form, lastActive: 'Just now' });
    }
    closeModal();
  };

  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const inactiveCount = employees.length - activeCount;
  const adminCount = employees.filter((e) => e.role === 'Super Admin' || e.role === 'Admin').length;

  const filterTabs = [
    { id: 'all', label: 'All', count: employees.length },
    { id: 'Active', label: 'Active', count: activeCount },
    { id: 'Inactive', label: 'Inactive', count: inactiveCount },
    { id: 'admin', label: 'Admin-Level', count: adminCount },
  ];

  const filteredEmployees = useMemo(() => {
    if (activeTab === 'all') return employees;
    if (activeTab === 'admin') return employees.filter((e) => e.role === 'Super Admin' || e.role === 'Admin');
    return employees.filter((e) => e.status === activeTab);
  }, [employees, activeTab]);

  const columns: Column<Employee>[] = [
    {
      header: 'EMPLOYEE',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-full object-cover" />
          <div>
            <div className="font-extrabold text-xs text-matrin-text dark:text-white">{row.name}</div>
            <div className="text-[10px] text-matrin-gray">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'ROLE',
      accessorKey: 'role',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1.5 text-xs font-bold text-matrin-primary dark:text-blue-400">
          <ShieldCheck className="w-3.5 h-3.5" /> {row.role}
        </span>
      ),
    },
    {
      header: 'DEPARTMENT',
      accessorKey: 'department',
      sortable: true,
      cell: (row) => <span className="text-xs font-medium text-matrin-gray dark:text-slate-400">{row.department}</span>,
    },
    {
      header: 'LAST ACTIVE',
      accessorKey: 'lastActive',
      sortable: true,
      cell: (row) => <span className="text-xs text-matrin-gray dark:text-slate-400">{row.lastActive}</span>,
    },
    {
      header: 'STATUS',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <label className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={row.status === 'Active'}
            onChange={() => toggleEmployeeStatus(row.id)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-matrin-secondary relative" />
          <Badge variant={row.status === 'Active' ? 'success' : 'neutral'} size="sm">{row.status}</Badge>
        </label>
      ),
    },
    {
      header: 'ACTIONS',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Tooltip label="Edit Employee">
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
          <Tooltip label="Remove Employee">
            <button
              onClick={() => deleteEmployee(row.id)}
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
            Employee Directory & Access
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Manage team members, role assignments, and account access status.
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
          Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Total Employees</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1">{employees.length}</div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Active Accounts</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1 flex items-center gap-2">
            <UserCheck className="w-6 h-6" /> {activeCount}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Admin-Level Access</div>
          <div className="text-3xl font-extrabold text-matrin-primary dark:text-blue-400 mt-1">{adminCount}</div>
        </div>
      </div>

      <DataTable
        title="Team Members"
        data={filteredEmployees}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search employees by name, role, or department..."
        exportFilename="matrin_employees"
        onBulkDelete={(ids) => ids.forEach((id) => deleteEmployee(id))}
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Edit Employee' : 'Add New Employee'} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Employee['role'] })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              >
                {roleOptions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Department</label>
              <input
                type="text"
                required
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Employee['status'] })}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-matrin-border dark:border-matrin-darkborder">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit">{editing ? 'Save Changes' : 'Add Employee'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
