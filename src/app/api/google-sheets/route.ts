import { jsonResponse } from "@/lib/auth";
import {
  getGoogleSheetsStatus,
  sendToGoogleSheetsWebhook,
  appendOrderToGoogleSheet,
  appendCustomDataToGoogleSheet,
} from "@/lib/googleSheets";
import { connectToDatabase } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function GET() {
  const status = getGoogleSheetsStatus();
  return jsonResponse({
    success: true,
    status,
    scriptTemplate: `/**
 * MATRIN Store - Google Sheets Automation Script
 * Paste this script into Extensions > Apps Script in your Google Sheet.
 * Deploy as Web App (Execute as: Me, Access: Anyone).
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-create headers on row 1 if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Order ID", "Invoice #", "Order Date",
        "Customer Name", "Customer Email", "Customer Phone",
        "Shipping Address", "Items Summary", "Total Amount (₹)",
        "Payment Method", "Payment Status", "Order Status", "Transaction ID", "Source"
      ]);
    }
    
    // Append order row or custom form entry
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.orderId || data.id || "N/A",
      data.invoiceNumber || "N/A",
      data.orderDate || "N/A",
      data.customerName || data.name || "N/A",
      data.customerEmail || data.email || "N/A",
      data.customerPhone || data.phone || "N/A",
      data.shippingAddress || data.address || "N/A",
      data.itemsSummary || data.message || "N/A",
      data.totalAmount || data.amount || 0,
      data.paymentMethod || "N/A",
      data.paymentStatus || "N/A",
      data.orderStatus || "N/A",
      data.transactionId || "N/A",
      data.source || data.formType || "MATRIN Store Data Collection"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, webhookUrl: customWebhookUrl, data } = body;

    // 1. Test Webhook Connection
    if (action === "test") {
      const testPayload = {
        timestamp: new Date().toISOString(),
        orderId: "TEST_ORD_001",
        invoiceNumber: "INV-TEST-2026",
        orderDate: new Date().toISOString().split("T")[0],
        customerName: "MATRIN Connection Test",
        customerEmail: "test@matrin-store.com",
        customerPhone: "+91 99999 88888",
        shippingAddress: "Mumbai, India",
        itemsSummary: "MATRIN Test Cleaning Kit (x1)",
        totalAmount: 499,
        paymentMethod: "UPI Test",
        paymentStatus: "Paid",
        orderStatus: "Completed Test",
        source: "Admin Connection Test",
      };

      const result = await sendToGoogleSheetsWebhook(testPayload, customWebhookUrl);
      if (result.success) {
        return jsonResponse({
          success: true,
          message: "Google Sheets Webhook connection test successful! Sample row dispatched.",
        });
      } else {
        return jsonResponse(
          {
            success: false,
            error: result.error || "Webhook connection test failed",
          },
          400
        );
      }
    }

    // 2. Bulk Sync Existing Orders to Google Sheets
    if (action === "sync_orders") {
      const db = await connectToDatabase();
      let ordersToSync: any[] = [];

      if (db) {
        ordersToSync = await OrderModel.find().sort({ createdAt: -1 });
      } else {
        ordersToSync = inMemoryStore.orders;
      }

      if (ordersToSync.length === 0) {
        return jsonResponse({
          success: true,
          message: "No existing orders found to sync.",
          syncedCount: 0,
        });
      }

      let successCount = 0;
      let failureCount = 0;

      for (const order of ordersToSync) {
        const res = await appendOrderToGoogleSheet(order, customWebhookUrl);
        if (res.success) {
          successCount++;
        } else {
          failureCount++;
        }
      }

      return jsonResponse({
        success: failureCount === 0,
        message: `Synced ${successCount} order(s) to Google Sheets.${
          failureCount > 0 ? ` Failed: ${failureCount}.` : ""
        }`,
        syncedCount: successCount,
        failedCount: failureCount,
      });
    }

    // 3. Custom Lead/Data Collection Form Submission
    if (action === "submit_lead" || data) {
      const payload = data || body;
      const result = await appendCustomDataToGoogleSheet(payload, customWebhookUrl);
      if (result.success) {
        return jsonResponse({
          success: true,
          message: "Data collection entry appended to Google Sheets successfully.",
        });
      } else {
        return jsonResponse(
          {
            success: false,
            error: result.error || "Failed to append custom data payload",
          },
          400
        );
      }
    }

    return jsonResponse(
      { error: "Invalid action. Supported actions: 'test', 'sync_orders', 'submit_lead'" },
      400
    );
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Google Sheets API handler error" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
