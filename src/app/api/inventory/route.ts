import { connectToDatabase } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { InventoryLogModel } from "@/models/InventoryLog";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function GET(req: Request) {
  const auth = getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  const db = await connectToDatabase();
  if (db) {
    const products = await ProductModel.find().select("id name sku stock minStockLevel category price status").sort({ stock: 1 });
    const logs = await InventoryLogModel.find().sort({ createdAt: -1 }).limit(50);
    return jsonResponse({ items: products, logs });
  }

  return jsonResponse({
    items: inMemoryStore.products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: (p as { sku?: string }).sku || `SKU-${p.id}`,
      stock: p.stock,
      minStockLevel: 10,
      category: p.category,
      price: p.price,
      status: p.status,
    })),
    logs: inMemoryStore.inventoryLogs,
  });
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
