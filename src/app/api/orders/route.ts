import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { initialOrders } from "@/lib/inMemoryStore";
import {
  listOrSeedStoreRecords,
  listStoreRecords,
  patchStoreRecord,
  upsertStoreRecord,
} from "@/lib/firebaseStore";

type SheetOrder = {
  id: string | number;
  customer: { email: string; fullName?: string; phone?: string; [key: string]: unknown };
  items: Array<{ product?: { id?: string | number; [key: string]: unknown }; quantity?: number }>;
  totalAmount?: number;
  orderDate?: string;
  [key: string]: unknown;
};

type SheetProduct = {
  id: string | number;
  stock?: number;
  salesCount?: number;
  inStock?: boolean;
  [key: string]: unknown;
};

type SheetCustomer = {
  id: string | number;
  email: string;
  totalOrders?: number;
  totalSpent?: number;
  [key: string]: unknown;
};

export async function GET(req: Request) {
  const auth = await getAuthFromReq(req);
  const isAdmin = auth?.role === "ADMIN";
  const customerEmail = auth?.email?.toLowerCase();
  if (!isAdmin && !customerEmail) return jsonResponse({ error: "Unauthorized" }, 401);

  try {
    let orders = await listOrSeedStoreRecords<SheetOrder>("Orders", initialOrders);
    orders.sort((a, b) => String(b.orderDate || "").localeCompare(String(a.orderDate || "")));
    if (!isAdmin) {
      orders = orders.filter(
        (order) => order.customer?.email?.toLowerCase() === customerEmail
      );
    }
    return jsonResponse(orders);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load orders" },
      503
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = body.id || `ord_${Date.now()}`;
    const invoiceNumber = body.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

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

    const orderData: SheetOrder = {
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

    const existingOrders = await listStoreRecords<SheetOrder>("Orders");
    const isNewOrder = !existingOrders.some((order) => String(order.id) === String(orderId));
    const savedOrder = await upsertStoreRecord("Orders", orderData);

    if (isNewOrder) {
      const products = await listStoreRecords<SheetProduct>("Products");
      for (const item of orderData.items) {
        const productId = item.product?.id;
        const product = products.find((entry) => String(entry.id) === String(productId));
        if (!product) continue;
        const quantity = Number(item.quantity) || 1;
        const stock = Math.max(0, Number(product.stock) - quantity);
        await patchStoreRecord<SheetProduct>("Products", product.id, {
          stock,
          inStock: stock > 0,
          salesCount: (Number(product.salesCount) || 0) + quantity,
        });
      }

      const customers = await listStoreRecords<SheetCustomer>("Customers");
      const existingCustomer = customers.find(
        (entry) => entry.email?.toLowerCase() === customer.email
      );
      const customerRecord: SheetCustomer = {
        ...(existingCustomer || {}),
        id: existingCustomer?.id || customer.email,
        ...customer,
        name: customer.fullName,
        email: customer.email,
        totalOrders: (Number(existingCustomer?.totalOrders) || 0) + 1,
        totalSpent: (Number(existingCustomer?.totalSpent) || 0) + totalAmount,
        updatedAt: new Date().toISOString(),
      };
      await upsertStoreRecord("Customers", customerRecord);

      await upsertStoreRecord("Notifications", {
        id: `notif_${Date.now()}`,
        title: "New Customer Order",
        message: `Order #${invoiceNumber} placed by ${customer.fullName} (₹${totalAmount})`,
        timestamp: new Date().toISOString(),
        type: "order",
        isRead: false,
        link: "/admin/orders",
      });
    }

    return jsonResponse({ success: true, order: savedOrder }, 201);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to create order" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
