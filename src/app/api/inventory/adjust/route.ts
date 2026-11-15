import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";
import {
  listOrSeedStoreRecords,
  upsertStoreRecord,
} from "@/lib/firebaseStore";

type SheetProduct = {
  id: string | number;
  name: string;
  stock?: number;
  inStock?: boolean;
  [key: string]: unknown;
};

export async function POST(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const body = await req.json();
    const { productId, productIdentifier, quantityToAdd, reason, performedBy } = body;
    const quantity = Number(quantityToAdd);
    if (!Number.isFinite(quantity) || quantity === 0) {
      return jsonResponse({ error: "Quantity must be a non-zero number" }, 400);
    }

    const products = await listOrSeedStoreRecords<SheetProduct>(
      "Products",
      inMemoryStore.products
    );
    const product = products.find(
      (entry) =>
        (productId !== undefined && String(entry.id) === String(productId)) ||
        (productIdentifier &&
          entry.name.toLowerCase().includes(String(productIdentifier).toLowerCase()))
    );
    if (!product) return jsonResponse({ error: "Product not found" }, 404);

    const previousStock = Number(product.stock) || 0;
    const newStock = Math.max(0, previousStock + quantity);
    const updatedProduct = {
      ...product,
      stock: newStock,
      inStock: newStock > 0,
    };
    await upsertStoreRecord("Products", updatedProduct);

    const log = {
      id: `inv_log_${Date.now()}`,
      productId: product.id,
      productName: product.name,
      previousStock,
      newStock,
      changeAmount: quantity,
      reason: reason || "Manual Adjustment",
      adjustedBy: performedBy || auth?.name || "Admin",
      timestamp: new Date().toISOString(),
    };
    await upsertStoreRecord("InventoryLogs", log);

    return jsonResponse({ success: true, product: updatedProduct, log });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Stock adjustment failed" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
