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
export function getGoogleSheetsWebhookUrl(): string {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ||
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
    const isBrowser = typeof window !== "undefined";
    const fetchOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    };

    // Browsers require mode: 'no-cors' to post to Google Apps Script web apps on deployed sites
    if (isBrowser) {
      fetchOptions.mode = "no-cors";
    }

    const response = await fetch(webhookUrl, fetchOptions);

    if (isBrowser || response.ok || response.status === 302 || response.status === 200 || response.type === "opaque") {
      return { success: true };
    }

    const text = await response.text().catch(() => "");
    if (response.status === 404) {
      return {
        success: false,
        error: "Google Sheets Webhook URL returned 404 Page Not Found. Please deploy the script in Google Sheets (Deploy > New deployment > Web App > Access: Anyone) and save the generated Web App URL in .env.local or Admin Settings.",
      };
    }

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
 * Format payment method for display & reporting (Plain Text)
 */
export function formatPaymentMethodLabel(method: string = ""): string {
  const m = method.toString().trim().toLowerCase();
  if (m === "upi") return "UPI";
  if (m === "card") return "Card";
  if (m === "cod") return "COD";
  if (m === "test") return "Test";
  if (m === "netbanking") return "Net Banking";
  return method || "UPI";
}

/**
 * Format order status for reporting (Plain Text)
 */
export function formatOrderStatusLabel(status: string = ""): string {
  if (!status) return "Processing";
  const s = status.toString().trim();
  if (s.toLowerCase() === "paid") return "Paid";
  if (s.toLowerCase() === "pending") return "Pending";
  if (s.toLowerCase() === "cash on delivery") return "Cash on Delivery";
  if (s.toLowerCase() === "shipped") return "Shipped";
  if (s.toLowerCase() === "delivered") return "Delivered";
  if (s.toLowerCase() === "cancelled") return "Cancelled";
  if (s.toLowerCase() === "refunded") return "Refunded";
  return s;
}

/**
 * Format and append an Order to Google Sheets in plain text format:
 * | Customer ID | Name | Mobile | Email | Address | City | State | Pincode | Order ID | Product | Qty | Total | Payment | Status |
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
        return q > 1 ? `${pName} x${q}` : pName;
      })
      .join(", ") || "Product";

    const totalQty = items.reduce(
      (sum: number, item: any) => sum + (item.quantity || 1),
      0
    ) || 1;

    const rawTotal = Number(order.totalAmount || 0);
    const formattedTotal = `₹${rawTotal.toLocaleString("en-IN")}`;

    const paymentMethod = formatPaymentMethodLabel(order.paymentMethod);
    const orderStatus = formatOrderStatusLabel(order.orderStatus || order.paymentStatus);

    const houseFlatNo = (customer.houseFlatNo || "").trim();
    const streetArea = (customer.streetArea || "").trim();
    const baseCity = (customer.city || "Surat").trim();
    const baseState = (customer.state || "Gujarat").trim();
    const basePincode = (customer.pincode || "395007").trim();

    // Complete shipping address for courier delivery label
    const fullShippingAddress =
      [houseFlatNo, streetArea, baseCity, baseState, basePincode ? `PIN: ${basePincode}` : ""]
        .filter(Boolean)
        .join(", ") ||
      customer.addressLine ||
      "N/A";

    const payload: Record<string, unknown> = {
      customerId: custId,
      customer_id: custId,
      name: (customer.fullName || customer.name || "Customer").trim(),
      fullName: (customer.fullName || customer.name || "Customer").trim(),
      customerName: (customer.fullName || customer.name || "Customer").trim(),
      mobile: (customer.phone || "N/A").toString().trim(),
      phone: (customer.phone || "N/A").toString().trim(),
      customerPhone: (customer.phone || "N/A").toString().trim(),
      email: (customer.email || "N/A").toString().trim().toLowerCase(),
      customerEmail: (customer.email || "N/A").toString().trim().toLowerCase(),
      addressLine: fullShippingAddress,
      address: fullShippingAddress,
      fullAddress: fullShippingAddress,
      houseFlatNo: houseFlatNo || "N/A",
      streetArea: streetArea || "N/A",
      city: baseCity,
      state: baseState,
      pincode: basePincode,
      zip: basePincode,
      orderId: order.invoiceNumber || order.id || "ORD1001",
      invoiceNumber: order.invoiceNumber || order.id || "ORD1001",
      product: productsSummary,
      itemsSummary: productsSummary,
      qty: totalQty,
      quantity: totalQty,
      total: formattedTotal,
      totalAmount: rawTotal,
      payment: paymentMethod,
      paymentMethod: paymentMethod,
      status: orderStatus,
      orderStatus: orderStatus,
    };

    return await sendToGoogleSheetsWebhook(payload, webhookUrl);
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
  const houseFlatNo = (customData.houseFlatNo || "").toString().trim();
  const streetArea = (customData.streetArea || "").toString().trim();
  const city = (customData.city || "N/A").toString().trim();
  const state = (customData.state || "N/A").toString().trim();
  const pincode = (customData.pincode || "N/A").toString().trim();

  const formattedAddr =
    (customData.address as string) ||
    (customData.fullAddress as string) ||
    [houseFlatNo, streetArea, city, state, pincode].filter((s) => s && s !== "N/A").join(", ") ||
    "N/A";

  const rawTotal = customData.total || (customData.totalAmount ? `₹${customData.totalAmount}` : "₹0");
  const formattedTotal = typeof rawTotal === "number" ? `₹${rawTotal.toLocaleString("en-IN")}` : String(rawTotal);

  const payload = {
    customerId: customData.customerId || "CUST001",
    name: customData.name || "N/A",
    mobile: customData.mobile || customData.phone || "N/A",
    email: customData.email || "N/A",
    address: formattedAddr,
    fullAddress: formattedAddr,
    city,
    state,
    pincode,
    orderId: customData.orderId || "ORD1001",
    product: customData.product || customData.message || "Enquiry",
    qty: customData.qty || 1,
    total: formattedTotal,
    payment: formatPaymentMethodLabel(customData.payment as string || "N/A"),
    status: formatOrderStatusLabel(customData.status as string || "Submitted"),
    ...customData,
  };

  return await sendToGoogleSheetsWebhook(payload, webhookUrl);
}
