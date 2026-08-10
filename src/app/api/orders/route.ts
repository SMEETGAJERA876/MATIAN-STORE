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

    if (auth && auth.role !== "ADMIN") {
      // Return customer's own orders
      const userOrders = await OrderModel.find({ "customer.email": auth.email }).sort({ createdAt: -1 });
      return jsonResponse(userOrders);
    }

    // Admin receives all orders
    const allOrders = await OrderModel.find().sort({ createdAt: -1 });
    return jsonResponse(allOrders);
  }

  // Memory Fallback
  if (auth && auth.role !== "ADMIN") {
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

    const orderData = {
      id: orderId,
      invoiceNumber,
      orderDate: body.orderDate || new Date().toISOString().split("T")[0],
      dueDate: body.dueDate || new Date().toISOString().split("T")[0],
      customer: body.customer,
      items: body.items,
      subtotal: Number(body.subtotal),
      discountAmount: Number(body.discountAmount || 0),
      appliedCoupon: body.appliedCoupon,
      shippingFee: Number(body.shippingFee || 0),
      taxAmount: Number(body.taxAmount || 0),
      totalAmount: Number(body.totalAmount),
      paymentMethod: body.paymentMethod || "upi",
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

      // Trigger non-blocking Google Sheets data collection sync
      appendOrderToGoogleSheet(createdOrder).catch((err) =>
        console.error("Async Google Sheets order sync error:", err)
      );

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

    // Trigger non-blocking Google Sheets data collection sync
    appendOrderToGoogleSheet(orderData).catch((err) =>
      console.error("Async Google Sheets order sync error:", err)
    );

    return jsonResponse({ success: true, order: orderData }, 201);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to create order" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
