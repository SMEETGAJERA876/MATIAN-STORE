import { inMemoryStore } from "./inMemoryStore";

/**
 * Google Sheets Integration Utility for MATRIN Store
 * 
 * Data payload matches exact table format:
 * | Customer ID | Name | Mobile | Email | City | State | Pincode | Order ID | Product | Qty | Total | Payment | Status |
 */

let runtimeWebhookUrl: string | null = null;

/**
 * Dynamically set Webhook URL at runtime
 */
export function setRuntimeWebhookUrl(url: string) {
  runtimeWebhookUrl = url;
  if (url) {
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = url;
  }
}

export interface GoogleSheetsOrderPayload {
  customerId: string;
  name: string;
  mobile: string;
  email: string;
  houseFlatNo: string;
  streetArea: string;
  fullAddress: string;
  addressType: string;
  city: string;
  state: string;
  pincode: string;
  orderId: string;
  product: string;
  qty: number;
  total: string;
  payment: string;
  status: string;
  [key: string]: unknown;
}

export interface GoogleSheetsCustomPayload {
  timestamp?: string;
  formType?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Helper to generate or retrieve Customer ID (e.g. CUST001)
 */
function getCustomerId(customer: any, orderId: string): string {
  if (customer.customerId || customer.id) {
    return String(customer.customerId || customer.id);
  }
  const seed = customer.email || orderId || "default";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const custNum = (Math.abs(hash) % 900) + 100;
  return `CUST${custNum}`;
}

const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbz6U5MNpC5kI8zISrL2eaZbK_Z-aIkiXT7z32XRR7dBYU8umCxCYumQ-r1h_nQvVMhqNA/exec";

/**
 * Retrieves configured Google Sheets Webhook URL
 */
export function getGoogleSheetsWebhookUrl(): string | null {
  return (
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    runtimeWebhookUrl ||
    (inMemoryStore.settings as any)?.googleSheetsWebhookUrl ||
    DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL
  );
}

/**
 * Check Google Sheets Integration setup status
 */
export function getGoogleSheetsStatus() {
  const webhookUrl = getGoogleSheetsWebhookUrl();
  return {
    isConfigured: Boolean(webhookUrl),
    mode: webhookUrl ? "Apps Script Webhook" : "Not Configured",
    webhookUrl: webhookUrl ? `${webhookUrl.substring(0, 30)}...` : null,
  };
}

/**
 * Sends structured JSON payload to Google Sheets Webhook (Apps Script Web App)
 */
export async function sendToGoogleSheetsWebhook(
  payload: Record<string, unknown>,
  targetUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = targetUrl || getGoogleSheetsWebhookUrl();

  if (!webhookUrl) {
    return {
      success: false,
      error: "Google Sheets Webhook URL is not configured in environment variables or settings.",
    };
  }

  try {
    // text/plain;charset=utf-8 avoids CORS preflight restrictions in Google Apps Script
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (response.ok || response.status === 302 || response.status === 200) {
      return { success: true };
    }

    const text = await response.text().catch(() => "");
    return {
      success: false,
      error: `Google Sheets Webhook returned HTTP status ${response.status}: ${text.substring(0, 200)}`,
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[GoogleSheets] Error sending payload to sheet:", error.message);
    return {
      success: false,
      error: error.message || "Failed to reach Google Sheets webhook",
    };
  }
}

/**
 * Format and append an Order to Google Sheets in exact user-requested format:
 * | Customer ID | Name | Mobile | Email | City | State | Pincode | Order ID | Product | Qty | Total | Payment | Status |
 */
export async function appendOrderToGoogleSheet(
  order: any,
  webhookUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const customer = order.customer || {};
    const items = Array.isArray(order.items) ? order.items : [];

    const custId = getCustomerId(customer, order.id || "");

    const productsSummary = items
      .map((item: any) => {
        const pName = item.product?.name || item.name || "Product";
        const q = item.quantity || 1;
        return `${pName} (x${q})`;
      })
      .join("; ") || "General Item";

    const totalQty = items.reduce(
      (sum: number, item: any) => sum + (item.quantity || 1),
      0
    ) || 1;

    const rawTotal = Number(order.totalAmount || 0);
    const formattedTotal = `₹${rawTotal}`;

    let paymentMethod = (order.paymentMethod || "UPI").toString().toUpperCase();
    if (paymentMethod === "COD") paymentMethod = "COD";
    if (paymentMethod === "CARD") paymentMethod = "Card";

    const orderStatus = order.orderStatus || order.paymentStatus || "Processing";

    const houseFlatNo = customer.houseFlatNo || "";
    const streetArea = customer.streetArea || "";
    const addressType = customer.addressType || "Home";
    const baseCity = customer.city || "Surat";

    const formattedAddressStr =
      [houseFlatNo, streetArea].filter(Boolean).join(", ") ||
      customer.addressLine ||
      "N/A";

    const addressWithDetails = `${formattedAddressStr} [${addressType}]`;

    const payload: GoogleSheetsOrderPayload = {
      customerId: custId,
      name: customer.fullName || customer.name || "Customer",
      mobile: customer.phone || "N/A",
      email: customer.email || "N/A",
      address: addressWithDetails,
      houseFlatNo: houseFlatNo || "N/A",
      streetArea: streetArea || "N/A",
      fullAddress: `${formattedAddressStr}, ${baseCity}, ${customer.state || "Gujarat"} - ${customer.pincode || "395007"} [${addressType}]`,
      addressType,
      city: baseCity,
      state: customer.state || "Gujarat",
      pincode: customer.pincode || "395007",
      orderId: order.invoiceNumber || order.id || "ORD1001",
      product: productsSummary,
      qty: totalQty,
      total: formattedTotal,
      payment: paymentMethod,
      status: orderStatus,
    };

    return await sendToGoogleSheetsWebhook(payload as Record<string, unknown>, webhookUrl);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[GoogleSheets] Failed formatting order payload:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Append general form submission or custom data payload to Google Sheets
 */
export async function appendCustomDataToGoogleSheet(
  customData: GoogleSheetsCustomPayload,
  webhookUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const payload = {
    customerId: customData.customerId || "CUST001",
    name: customData.name || "N/A",
    mobile: customData.mobile || customData.phone || "N/A",
    email: customData.email || "N/A",
    city: customData.city || "N/A",
    state: customData.state || "N/A",
    pincode: customData.pincode || "N/A",
    orderId: customData.orderId || "ORD1001",
    product: customData.product || customData.message || "Enquiry",
    qty: customData.qty || 1,
    total: customData.total || "₹0",
    payment: customData.payment || "N/A",
    status: customData.status || "Submitted",
    ...customData,
  };

  return await sendToGoogleSheetsWebhook(payload, webhookUrl);
}
