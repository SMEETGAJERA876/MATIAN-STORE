import fs from "fs";
import path from "path";
import { jsonResponse } from "@/lib/auth";
import {
  getGoogleSheetsStatus,
  sendToGoogleSheetsWebhook,
  appendOrderToGoogleSheet,
  appendCustomDataToGoogleSheet,
  setRuntimeWebhookUrl,
} from "@/lib/googleSheets";
import { connectToDatabase } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { SettingsModel } from "@/models/Settings";
import { inMemoryStore } from "@/lib/inMemoryStore";

function saveWebhookUrlToEnv(webhookUrl: string) {
  try {
    setRuntimeWebhookUrl(webhookUrl);
    const envPath = path.join(process.cwd(), ".env.local");
    let content = "";
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, "utf8");
    }

    if (content.includes("GOOGLE_SHEETS_WEBHOOK_URL=")) {
      content = content.replace(
        /GOOGLE_SHEETS_WEBHOOK_URL=.*/g,
        `GOOGLE_SHEETS_WEBHOOK_URL=${webhookUrl}`
      );
    } else {
      content += `\nGOOGLE_SHEETS_WEBHOOK_URL=${webhookUrl}\n`;
    }

    fs.writeFileSync(envPath, content, "utf8");
  } catch (err) {
    console.error("Failed to write GOOGLE_SHEETS_WEBHOOK_URL to .env.local:", err);
  }
}

export async function GET() {
  const status = getGoogleSheetsStatus();
  return jsonResponse({
    success: true,
    status,
    scriptTemplate: `/**
 * MATRIN Store - Plain Google Sheet Data Collector (19 Columns)
 * 
 * Target Plain Format:
 * | Customer ID | Order Date | Expected Delivery Date | Name | Mobile | Email | Street Address | Address Line | City | State | Pincode | Order ID | Product | Qty | Unit Price | Discount / Promo Code | Total | Payment | Status |
 *
 * Paste this script into Extensions > Apps Script in your Google Sheet.
 * Deploy as Web App (Execute as: Me, Access: Anyone).
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "MATRIN Store Google Sheets Plain Data Collector is active!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-create 19 plain headers on row 1 if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Customer ID",
        "Order Date",
        "Expected Delivery Date",
        "Name",
        "Mobile",
        "Email",
        "Street Address",
        "Address Line",
        "City",
        "State",
        "Pincode",
        "Order ID",
        "Product",
        "Qty",
        "Unit Price",
        "Discount / Promo Code",
        "Total",
        "Payment",
        "Status"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 19);
      headerRange.clearFormat();
      headerRange.setFontWeight("bold");
    }
    
    // Append plain row matching 19 columns format
    sheet.appendRow([
      data.customerId || data.customer_id || "CUST001",
      data.orderDate || data.date || "2026-08-11",
      data.expectedDeliveryDate || data.dueDate || data.deliveryDate || "2026-08-15",
      data.name || data.customerName || data.fullName || "N/A",
      data.mobile || data.phone || data.customerPhone || "N/A",
      data.email || data.customerEmail || "N/A",
      data.streetAddress || data.street || data.houseFlatNo || "N/A",
      data.fullAddress || data.addressLine || data.address || "N/A",
      data.city || "Surat",
      data.state || "Gujarat",
      data.pincode || data.zip || "395007",
      data.orderId || data.invoiceNumber || "ORD1001",
      data.product || data.itemsSummary || "N/A",
      data.qty !== undefined ? data.qty : (data.quantity || 1),
      data.unitPrice || data.price || data.unit_price || (data.totalAmount && data.qty ? ("₹" + Math.round(data.totalAmount / data.qty)) : "₹0"),
      data.discountPromoCode || data.discountCode || data.couponCode || data.discount || "None",
      data.total || (data.totalAmount ? ("₹" + data.totalAmount) : "₹0"),
      data.payment || data.paymentMethod || "UPI",
      data.status || data.orderStatus || "Processing"
    ]);
    
    // Clear all formatting boxes, colors, and borders on appended row for plain sheet output
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var newRowRange = sheet.getRange(lastRow, 1, 1, 19);
      newRowRange.clearFormat();
      newRowRange.setFontFamily("Arial");
      newRowRange.setFontSize(10);
    }
    
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

    if (customWebhookUrl) {
      saveWebhookUrlToEnv(customWebhookUrl);
    }

    // 1. Save Webhook URL Action
    if (action === "save_webhook") {
      if (!customWebhookUrl) {
        return jsonResponse({ error: "Webhook URL is required" }, 400);
      }
      saveWebhookUrlToEnv(customWebhookUrl);

      const db = await connectToDatabase();
      if (db) {
        let settings = await SettingsModel.findOne();
        if (!settings) {
          settings = await SettingsModel.create({ googleSheetsWebhookUrl: customWebhookUrl });
        } else {
          settings.googleSheetsWebhookUrl = customWebhookUrl;
          await settings.save();
        }
      }

      return jsonResponse({
        success: true,
        message: "Google Sheets Webhook URL saved successfully and configured for live order sync!",
      });
    }

    // 2. Test Webhook Connection with exact sample format
    if (action === "test") {
      const testPayload = {
        customerId: "CUST001",
        name: "Rahul Patel",
        mobile: "9876543210",
        email: "rahul@example.com",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380015",
        orderId: "ORD1001",
        product: "Floor Cleaner",
        qty: 2,
        total: "₹537",
        payment: "UPI",
        status: "Processing",
      };

      const result = await sendToGoogleSheetsWebhook(testPayload, customWebhookUrl);
      if (result.success) {
        return jsonResponse({
          success: true,
          message: "Google Sheets Webhook connection test successful! Sample row (CUST001 / Rahul Patel) dispatched.",
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

    // 3. Bulk Sync Existing Orders to Google Sheets
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

    // 4. Custom Lead/Data Collection Form Submission
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
      { error: "Invalid action. Supported actions: 'test', 'save_webhook', 'sync_orders', 'submit_lead'" },
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
