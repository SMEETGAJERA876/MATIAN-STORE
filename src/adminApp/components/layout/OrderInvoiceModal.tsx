import React from 'react';
import { Printer, Download, CheckCircle, Clock } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAdminStore } from '../../store/adminStore';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OrderInvoiceModal: React.FC = () => {
  const { selectedOrderId, setSelectedOrderId, orders, addToast } = useAdminStore();

  const order = orders.find((o) => o.id === selectedOrderId);

  if (!order) return null;

  const subtotal = order.items.reduce((acc, i) => acc + i.totalPrice, 0);
  const taxGST = subtotal * 0.18; // 18% GST
  const shippingFee = 15.00;
  const grandTotal = subtotal + taxGST + shippingFee;

  const handlePrint = () => {
    window.print();
    addToast('success', `Printing invoice for ${order.orderNumber}`);
  };

  return (
    <Modal
      isOpen={!!selectedOrderId}
      onClose={() => setSelectedOrderId(null)}
      title={`TAX INVOICE — ${order.orderNumber}`}
      maxWidth="2xl"
    >
      <div id="printable-invoice" className="space-y-6 bg-white dark:bg-matrin-darkcard text-matrin-text dark:text-white p-2">
        {/* Header Branding & Status */}
        <div className="flex flex-wrap items-center justify-between pb-6 border-b border-matrin-border dark:border-matrin-darkborder gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-matrin-primary flex items-center justify-center text-white font-black text-xl shadow-soft">
              M
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-matrin-primary dark:text-white">
                MATRIN ENTERPRISE
              </h2>
              <p className="text-xs text-matrin-gray">Tax Registration: GSTIN-9920149201A</p>
            </div>
          </div>

          <div className="text-right">
            <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'warning'} size="md">
              {order.paymentStatus === 'Paid' ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : <Clock className="w-3.5 h-3.5 mr-1" />}
              {order.paymentStatus}
            </Badge>
            <div className="text-xs text-matrin-gray mt-1">Issued Date: {formatDate(order.date)}</div>
          </div>
        </div>

        {/* Addresses & Courier info */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-matrin-bg dark:bg-slate-900 rounded-2xl border border-matrin-border dark:border-matrin-darkborder">
            <div className="font-bold text-matrin-gray uppercase mb-1">Billed To</div>
            <div className="font-bold text-sm text-matrin-text dark:text-white">{order.customerName}</div>
            <div className="text-matrin-gray mt-0.5">{order.customerEmail}</div>
            <div className="text-matrin-gray mt-1">{order.shippingAddress}</div>
          </div>

          <div className="p-4 bg-matrin-bg dark:bg-slate-900 rounded-2xl border border-matrin-border dark:border-matrin-darkborder">
            <div className="font-bold text-matrin-gray uppercase mb-1">Shipping & Courier</div>
            <div className="font-bold text-sm text-matrin-text dark:text-white">{order.courier || 'Standard Courier'}</div>
            <div className="text-matrin-gray mt-0.5">Tracking: <code className="text-matrin-primary font-bold">{order.trackingNumber || 'N/A'}</code></div>
            <div className="text-matrin-gray mt-1">Status: <span className="font-bold">{order.shippingStatus}</span></div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-matrin-border dark:border-matrin-darkborder rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-matrin-bg dark:bg-slate-900 border-b border-matrin-border font-bold uppercase text-matrin-gray">
              <tr>
                <th className="p-3">Item Description</th>
                <th className="p-3">SKU</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-matrin-border">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-bold text-matrin-text dark:text-white">{item.productName}</td>
                  <td className="p-3 text-matrin-gray">{item.sku}</td>
                  <td className="p-3 text-right font-medium">{item.quantity}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3 text-right font-bold">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation summary */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-matrin-gray">
              <span>Subtotal:</span>
              <span className="font-bold text-matrin-text dark:text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-matrin-gray">
              <span>GST Tax (18%):</span>
              <span className="font-bold text-matrin-text dark:text-white">{formatCurrency(taxGST)}</span>
            </div>
            <div className="flex justify-between text-matrin-gray">
              <span>Express Freight:</span>
              <span className="font-bold text-matrin-text dark:text-white">{formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-matrin-border text-matrin-primary dark:text-blue-400">
              <span>Grand Total:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Print / Actions Bar */}
        <div className="flex justify-end gap-3 pt-4 border-t border-matrin-border no-print">
          <Button variant="outline" onClick={() => setSelectedOrderId(null)}>
            Close
          </Button>
          <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={handlePrint}>
            Download PDF
          </Button>
          <Button variant="primary" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print Tax Invoice
          </Button>
        </div>
      </div>
    </Modal>
  );
};
