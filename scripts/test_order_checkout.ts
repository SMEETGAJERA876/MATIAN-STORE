import fs from "fs";
import path from "path";
import { appendOrderToGoogleSheet } from "../src/lib/googleSheets";

// Manual env loader if process.env.GOOGLE_SHEETS_WEBHOOK_URL is not set by node runner
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
        if (key.trim() === "GOOGLE_SHEETS_WEBHOOK_URL") {
          process.env.GOOGLE_SHEETS_WEBHOOK_URL = value;
        }
      }
    }
  }
}

loadEnvLocal();

async function runFirstOrderCheck() {
  const webhookUrlFromEnv = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookUrlFromArg = process.argv[2];
  const activeWebhookUrl = webhookUrlFromArg || webhookUrlFromEnv;

  console.log("==================================================");
  console.log("🛍️  MATRIN STORE - FIRST ORDER CHECK & GOOGLE SHEETS SYNC");
  console.log("==================================================");

  if (!activeWebhookUrl) {
    console.log("⚠️  No GOOGLE_SHEETS_WEBHOOK_URL found in .env.local or passed as argument.");
    console.log("👉 Please make sure you SAVED .env.local with:");
    console.log('   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec\n');
  } else {
    console.log(`🔗 Target Webhook URL: ${activeWebhookUrl}\n`);
  }

  const sampleFirstOrder = {
    id: `ord_${Date.now()}`,
    invoiceNumber: `ORD1001`,
    orderDate: new Date().toISOString().split("T")[0],
    customer: {
      customerId: "CUST001",
      fullName: "Rahul Patel",
      phone: "9876543210",
      email: "rahul@example.com",
      houseFlatNo: "Flat 102, Building A",
      streetArea: "Navrangpura",
      addressLine: "Flat 102, Building A, Navrangpura",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015",
      addressType: "Home",
    },
    items: [
      {
        product: {
          id: 1,
          name: "Floor Cleaner",
          price: 268.5,
          image: "/images/products/floor-cleaner.png",
          category: "Floor Care",
        },
        quantity: 2,
      },
    ],
    subtotal: 537,
    discountAmount: 0,
    shippingFee: 0,
    taxAmount: 96,
    totalAmount: 537,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    transactionId: `TXN_${Date.now()}`,
  };

  console.log("📦 Order Data to be Sent:");
  console.table({
    "Customer ID": sampleFirstOrder.customer.customerId,
    "Name": sampleFirstOrder.customer.fullName,
    "Mobile": sampleFirstOrder.customer.phone,
    "Email": sampleFirstOrder.customer.email,
    "City": sampleFirstOrder.customer.city,
    "State": sampleFirstOrder.customer.state,
    "Pincode": sampleFirstOrder.customer.pincode,
    "Order ID": sampleFirstOrder.invoiceNumber,
    "Product": sampleFirstOrder.items[0].product.name,
    "Qty": sampleFirstOrder.items[0].quantity,
    "Total": `₹${sampleFirstOrder.totalAmount}`,
    "Payment": sampleFirstOrder.paymentMethod,
    "Status": sampleFirstOrder.orderStatus,
  });

  if (activeWebhookUrl) {
    console.log("\n📡 Dispatching Order #1 to Google Sheets...");
    const res = await appendOrderToGoogleSheet(sampleFirstOrder, activeWebhookUrl);
    if (res.success) {
      console.log("✅ SUCCESS! Order #1 row successfully written to your Google Sheet!");
      console.log("👉 Open your Google Sheet to check the newly added row!");
    } else {
      console.log("❌ FAILED:", res.error);
    }
  }
}

runFirstOrderCheck().catch(console.error);
