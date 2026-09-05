import { connectToDatabase } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";
import { NotificationModel } from "@/models/Notification";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialOrders } from "@/lib/inMemoryStore";
import { appendOrderToGoogleSheet } from "@/lib/googleSheets";

export async function GET(req: Request) {
  const auth = getAuthFromReq(req);
  const db = await connectToDatabase();

  if (db) {
    const count = await OrderModel.countDocuments();
    if (count === 0) {
      await OrderModel.insertMany(initialOrders);
    }

    if (!auth) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    if (auth.role !== "ADMIN") {
      // Return customer's own orders
      const userOrders = await OrderModel.find({ "customer.email": auth.email }).sort({ createdAt: -1 });
      return jsonResponse(userOrders);
    }

    // Admin receives all orders
    const allOrders = await OrderModel.find().sort({ createdAt: -1 });
    return jsonResponse(allOrders);
  }

  // Memory Fallback
  if (!auth) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  if (auth.role !== "ADMIN") {
    const userOrders = inMemoryStore.orders.filter((o) => o.customer.email === auth.email);
    return jsonResponse(userOrders);
  }

  return jsonResponse(inMemoryStore.orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectToDatabase();

    const orderId = body.id || `ord_${Date.now()}`;
    const invoiceNumber = body.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const rawCustomer = body.customer || {};
    const houseFlatNo = (rawCustomer.houseFlatNo || "").toString().trim();
    const streetArea = (rawCustomer.streetArea || "").toString().trim();
    const city = (rawCustomer.city || "").toString().trim();
    const state = (rawCustomer.state || "").toString().trim();
    const pincode = (rawCustomer.pincode || "").toString().trim();

    const fullAddress =
      [houseFlatNo, streetArea, city, state, pincode].filter(Boolean).join(", ") ||
      (rawCustomer.addressLine || "").toString().trim() ||
      "N/A";

    const customer = {
      fullName: (rawCustomer.fullName || rawCustomer.name || "Customer").toString().trim(),
      email: (rawCustomer.email || "customer@example.com").toString().trim().toLowerCase(),
      phone: (rawCustomer.phone || "N/A").toString().trim(),
      houseFlatNo,
      streetArea,
      addressLine: fullAddress,
      city: city || "Surat",
      state: state || "Gujarat",
      pincode: pincode || "395007",
      addressType: rawCustomer.addressType || "Home",
    };

    const subtotal = Math.round(Number(body.subtotal || 0));
    const discountAmount = Math.round(Number(body.discountAmount || 0));
    const shippingFee = Math.round(Number(body.shippingFee || 0));
    const totalAmount = Math.round(Number(body.totalAmount || 0));
    const netSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = Number(body.taxAmount) || Math.round((netSubtotal * 18) / 118);

    const orderData = {
      id: orderId,
      invoiceNumber,
      orderDate: body.orderDate || new Date().toISOString().split("T")[0],
      dueDate: body.dueDate || new Date().toISOString().split("T")[0],
      customer,
      items: Array.isArray(body.items) ? body.items : [],
      subtotal,
      discountAmount,
      appliedCoupon: body.appliedCoupon || undefined,
      shippingFee,
      taxAmount,
      totalAmount,
      paymentMethod: (body.paymentMethod || "upi").toString().toLowerCase(),
      paymentStatus: body.paymentStatus || "Paid",
      orderStatus: body.orderStatus || "Processing",
      transactionId: body.transactionId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    if (db) {
      const createdOrder = await OrderModel.create(orderData);

      // Decrement inventory stock automatically in Database
      if (body.items && Array.isArray(body.items)) {
        for (const item of body.items) {
          const prodId = item.product?.id;
          const qty = item.quantity || 1;
          if (prodId) {
            await ProductModel.updateOne(
              { id: prodId },
              { $inc: { stock: -qty, salesCount: qty } }
            );
          }
        }
      }

      // Create Admin Notification
      await NotificationModel.create({
        id: `notif_${Date.now()}`,
        title: "New Customer Order",
        message: `Order #${invoiceNumber} placed by ${body.customer?.fullName || "Customer"} (₹${body.totalAmount})`,
        type: "order",
        isRead: false,
        link: "/admin/orders",
      });

      // Trigger Google Sheets data collection sync
      try {
        const sheetsResult = await appendOrderToGoogleSheet(createdOrder);
        if (!sheetsResult.success) {
          console.error("Google Sheets sync error:", sheetsResult.error);
        }
      } catch (sheetsErr) {
        console.error("Google Sheets sync exception:", sheetsErr);
      }

      return jsonResponse({ success: true, order: createdOrder }, 201);
    }

    // Memory Store update
    inMemoryStore.orders.unshift(orderData as unknown as (typeof inMemoryStore.orders)[0]);
    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        const prodId = item.product?.id;
        const qty = item.quantity || 1;
        const target = inMemoryStore.products.find((p) => p.id === prodId);
        if (target) {
          target.stock = Math.max(0, target.stock - qty);
          target.salesCount = (target.salesCount || 0) + qty;
        }
      }
    }

    inMemoryStore.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: "New Customer Order",
      message: `Order #${invoiceNumber} placed by ${body.customer?.fullName || "Customer"} (₹${body.totalAmount})`,
      timestamp: new Date().toISOString(),
      type: "order" as const,
      isRead: false,
      link: "/admin/orders",
    });

    // Trigger Google Sheets data collection sync
    try {
      const sheetsResult = await appendOrderToGoogleSheet(orderData);
      if (!sheetsResult.success) {
        console.error("Google Sheets sync error:", sheetsResult.error);
      }
    } catch (sheetsErr) {
      console.error("Google Sheets sync exception:", sheetsErr);
    }

    return jsonResponse({ success: true, order: orderData }, 201);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to create order" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
