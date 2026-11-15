import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  listStoreRecords,
  patchStoreRecord,
} from "@/lib/firebaseStore";

type SheetOrder = { id: string | number; [key: string]: unknown };

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orders = await listStoreRecords<SheetOrder>("Orders");
    const order = orders.find((entry) => String(entry.id) === id);
    return order
      ? jsonResponse(order)
      : jsonResponse({ error: "Order not found" }, 404);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load order" },
      503
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const updated = await patchStoreRecord<SheetOrder>("Orders", id, await req.json());
    return updated
      ? jsonResponse({ success: true, order: updated })
      : jsonResponse({ error: "Order not found" }, 404);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to update order" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
