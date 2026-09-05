import { connectToDatabase } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await connectToDatabase();

  if (db) {
    const order = await OrderModel.findOne({ id });
    if (order) return jsonResponse(order);
  }

  const memOrder = inMemoryStore.orders.find((o) => o.id === id);
  if (memOrder) return jsonResponse(memOrder);

  return jsonResponse({ error: "Order not found" }, 404);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const db = await connectToDatabase();
    if (db) {
      const updated = await OrderModel.findOneAndUpdate({ id }, { $set: body }, { new: true });
      if (updated) return jsonResponse({ success: true, order: updated });
    }

    const index = inMemoryStore.orders.findIndex((o) => o.id === id);
    if (index !== -1) {
      inMemoryStore.orders[index] = { ...inMemoryStore.orders[index], ...body };
      return jsonResponse({ success: true, order: inMemoryStore.orders[index] });
    }

    return jsonResponse({ error: "Order not found" }, 404);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update order" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
