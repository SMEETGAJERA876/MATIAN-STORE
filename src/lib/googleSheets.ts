/**
 * Google Sheets Integration Utility for MATRIN Store
 * 
 * Supports data collection via:
 * 1. Google Apps Script Webhook (Recommended: no service account overhead)
 * 2. Custom webhook / API proxy endpoints
 */

export interface GoogleSheetsOrderPayload {
  timestamp: string;
  orderId: string;
  invoiceNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  itemsSummary: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  transactionId?: string;
  source: string;
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
 * Retrieves configured Google Sheets Webhook URL
 */
export function getGoogleSheetsWebhookUrl(): string | null {
  return process.env.GOOGLE_SHEETS_WEBHOOK_URL || null;
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
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      // Apps Script web apps often return redirects (302) or text responses
      redirect: "follow",
    });

    if (response.ok || response.status === 302 || response.status === 200) {
      return { success: true };
    }

    const text = await response.text().catch(() => "");
    return {
      success: false,
      error: `Google Sheets Webhook returned HTTP status ${response.status}: ${text}`,
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
 * Format and append an Order to Google Sheets
 */
export async function appendOrderToGoogleSheet(
  order: any,
  webhookUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const customer = order.customer || {};
    const items = Array.isArray(order.items) ? order.items : [];

    const itemsSummary = items
      .map(
        (item: any) =>
          `${item.product?.name || item.name || "Product"} (x${item.quantity || 1}) - ₹${
            item.product?.price || item.price || 0
          }`
      )
      .join("; ");

    const formattedAddress = [
      customer.addressType ? `[${customer.addressType}]` : null,
      customer.houseFlatNo,
      customer.streetArea || customer.addressLine,
      customer.city,
      customer.state,
      customer.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const payload: GoogleSheetsOrderPayload = {
      timestamp: new Date().toISOString(),
      orderId: order.id || "",
      invoiceNumber: order.invoiceNumber || "",
      orderDate: order.orderDate || new Date().toISOString().split("T")[0],
      customerName: customer.fullName || customer.name || "Customer",
      customerEmail: customer.email || "N/A",
      customerPhone: customer.phone || "N/A",
      shippingAddress: formattedAddress || "N/A",
      itemsSummary: itemsSummary || "No items listed",
      totalAmount: Number(order.totalAmount || 0),
      paymentMethod: order.paymentMethod || "N/A",
      paymentStatus: order.paymentStatus || "Paid",
      orderStatus: order.orderStatus || "Processing",
      transactionId: order.transactionId || "",
      source: "MATRIN Store E-Commerce",
    };

    return await sendToGoogleSheetsWebhook(payload as any, webhookUrl);
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
    timestamp: new Date().toISOString(),
    formType: customData.formType || "Lead Collection",
    ...customData,
  };

  return await sendToGoogleSheetsWebhook(payload, webhookUrl);
}
