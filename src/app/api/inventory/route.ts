import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";
import {
  listOrSeedStoreRecords,
  listStoreRecords,
} from "@/lib/firebaseStore";

type SheetProduct = {
  id: string | number;
  name: string;
  sku?: string;
  stock?: number;
  minStockLevel?: number;
  category?: string;
  price?: number;
  status?: string;
  [key: string]: unknown;
};

type SheetInventoryLog = { id: string | number; [key: string]: unknown };

export async function GET(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const [products, logs] = await Promise.all([
      listOrSeedStoreRecords<SheetProduct>("Products", inMemoryStore.products),
      listStoreRecords<SheetInventoryLog>("InventoryLogs"),
    ]);
    return jsonResponse({
      items: products
        .map((product) => ({
          id: product.id,
          name: product.name,
          sku: product.sku || `SKU-${product.id}`,
          stock: Number(product.stock) || 0,
          minStockLevel: Number(product.minStockLevel) || 10,
          category: product.category,
          price: product.price,
          status: product.status,
        }))
        .sort((a, b) => a.stock - b.stock),
      logs: logs
        .sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")))
        .slice(0, 50),
    });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load inventory" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
