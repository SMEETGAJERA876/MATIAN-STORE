import React, { useState } from 'react';
import { LifeBuoy, Clock, AlertCircle, Plus, Mail, Phone, User, Tag } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { DataTable, Column } from '../ui/DataTable';
import { useAdminStore } from '../../store/adminStore';
import { SupportTicket } from '../../types';

const emptyForm = {
  subject: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  message: '',
  priority: 'Medium' as SupportTicket['priority'],
  status: 'Open' as SupportTicket['status'],
  category: 'General' as SupportTicket['category'],
};

export const SupportTicketsView: React.FC = () => {
  const { supportTickets, addSupportTicket, updateTicketStatus } = useAdminStore();
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Tickets', count: supportTickets.length },
    { id: 'Open', label: 'Open', count: supportTickets.filter((t) => t.status === 'Open').length },
    { id: 'In Progress', label: 'In Progress', count: supportTickets.filter((t) => t.status === 'In Progress').length },
    { id: 'Resolved', label: 'Resolved', count: supportTickets.filter((t) => t.status === 'Resolved').length },
  ];

  const filteredTickets = supportTickets.filter((t) => activeTab === 'all' || t.status === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.customerEmail.trim() || !form.message.trim()) return;
    addSupportTicket({ ...form, customerPhone: form.customerPhone || undefined });
    setForm(emptyForm);
    setModalOpen(false);
  };

  const urgentCount = supportTickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Closed' && t.status !== 'Resolved').length;

  const columns: Column<SupportTicket>[] = [
    {
      header: 'TICKET',
      accessorKey: 'ticketNumber',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-mono font-bold text-xs text-matrin-primary dark:text-blue-400">{row.ticketNumber}</div>
          <div className="text-xs font-semibold text-matrin-text dark:text-white mt-0.5 max-w-xs truncate">{row.subject}</div>
        </div>
      ),
    },
    {
      header: 'CUSTOMER',
      accessorKey: 'customerName',
      sortable: true,
      cell: (row) => (
        <div className="text-xs">
          <div className="font-bold text-matrin-text dark:text-white">{row.customerName}</div>
          <div className="text-matrin-gray">{row.customerEmail}</div>
        </div>
      ),
    },
    {
      header: 'CATEGORY',
      accessorKey: 'category',
      sortable: true,
      cell: (row) => <Badge variant="neutral">{row.category}</Badge>,
    },
    {
      header: 'PRIORITY',
      accessorKey: 'priority',
      sortable: true,
      cell: (row) => {
        const variants: Record<string, any> = { Urgent: 'danger', High: 'warning', Medium: 'info', Low: 'neutral' };
        return <Badge variant={variants[row.priority] || 'neutral'} dot>{row.priority}</Badge>;
      },
    },
    {
      header: 'CREATED',
      accessorKey: 'createdAt',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1 text-xs text-matrin-gray dark:text-slate-400">
          <Clock className="w-3.5 h-3.5" /> {row.createdAt}
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <select
          value={row.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateTicketStatus(row.id, e.target.value as SupportTicket['status'])}
          className="text-xs font-bold bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-matrin-primary"
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-matrin-text dark:text-white tracking-tight">
            Customer Support Desk
          </h2>
          <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
            Track support requests, resolution timers, and ticket routing across the team.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Total Tickets</div>
          <div className="text-3xl font-extrabold text-matrin-text dark:text-white mt-1 flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-matrin-primary" /> {supportTickets.length}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Open</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">
            {supportTickets.filter((t) => t.status === 'Open').length}
          </div>
        </div>
        <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-2xl p-5 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray">Urgent & Unresolved</div>
          <div className="text-3xl font-extrabold text-rose-600 mt-1 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" /> {urgentCount}
          </div>
        </div>
      </div>

      <DataTable
        title="Support Ticket Queue"
        data={filteredTickets}
        columns={columns}
        searchKey="subject"
        searchPlaceholder="Search tickets by subject, customer, or ticket number..."
        filterTabs={filterTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRowClick={(row) => setViewingTicket(row)}
        exportFilename="matrin_support_tickets"
      />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create Support Ticket" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Subject</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Customer Email</label>
              <input
                type="email"
                required
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Customer Phone</label>
            <input
              type="tel"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Message</label>
            <textarea
              rows={3}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as SupportTicket['priority'] })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-matrin-text dark:text-white mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as SupportTicket['category'] })}
                className="w-full px-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              >
                <option>Billing</option>
                <option>Shipping</option>
                <option>Product Issue</option>
                <option>General</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-matrin-border dark:border-matrin-darkborder">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create Ticket</Button>
          </div>
        </form>
      </Modal>

      {/* Full Ticket Detail — shows everything the customer submitted */}
      <Modal
        isOpen={!!viewingTicket}
        onClose={() => setViewingTicket(null)}
        title={viewingTicket ? `Ticket ${viewingTicket.ticketNumber}` : 'Ticket'}
        maxWidth="lg"
      >
        {viewingTicket && (
          <div className="space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray mb-1">Subject</div>
              <div className="text-sm font-extrabold text-matrin-text dark:text-white">{viewingTicket.subject}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-matrin-bg/60 dark:bg-slate-900/60 border border-matrin-border dark:border-matrin-darkborder">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-matrin-primary dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-matrin-gray">Customer</div>
                  <div className="text-xs font-bold text-matrin-text dark:text-white">{viewingTicket.customerName}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-matrin-primary dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-matrin-gray">Email</div>
                  <a href={`mailto:${viewingTicket.customerEmail}`} className="text-xs font-bold text-matrin-primary dark:text-blue-400 hover:underline break-all">
                    {viewingTicket.customerEmail}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-matrin-primary dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-matrin-gray">Phone</div>
                  <div className="text-xs font-bold text-matrin-text dark:text-white">
                    {viewingTicket.customerPhone || 'Not provided'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-matrin-primary dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-matrin-gray">Category</div>
                  <div className="text-xs font-bold text-matrin-text dark:text-white">{viewingTicket.category}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-matrin-gray mb-1.5">Message</div>
              <div className="text-xs leading-relaxed text-matrin-text dark:text-slate-200 whitespace-pre-wrap p-4 rounded-2xl bg-white dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder">
                {viewingTicket.message || 'No message provided.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Badge variant={viewingTicket.priority === 'Urgent' ? 'danger' : viewingTicket.priority === 'High' ? 'warning' : 'neutral'} dot>
                  {viewingTicket.priority} Priority
                </Badge>
                <span className="flex items-center gap-1 text-[11px] text-matrin-gray">
                  <Clock className="w-3.5 h-3.5" /> {viewingTicket.createdAt}
                </span>
              </div>
              <select
                value={viewingTicket.status}
                onChange={(e) => {
                  const status = e.target.value as SupportTicket['status'];
                  updateTicketStatus(viewingTicket.id, status);
                  setViewingTicket({ ...viewingTicket, status });
                }}
                className="text-xs font-bold bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-matrin-primary"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
