import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialCategories } from "@/lib/inMemoryStore";
import {
  listOrSeedStoreRecords,
  upsertStoreRecord,
} from "@/lib/firebaseStore";

export async function GET() {
  try {
    return jsonResponse(
      await listOrSeedStoreRecords("Categories", [
        ...inMemoryStore.categories,
        ...initialCategories.filter(
          (initial) => !inMemoryStore.categories.some((category) => category.id === initial.id)
        ),
      ])
    );
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load categories" },
      503
    );
  }
}

export async function POST(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const body = await req.json();
    const categoryData = {
      ...body,
      id: body.id || `cat_${Date.now()}`,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: body.description || "",
      iconName: body.iconName || "Sparkles",
      productCount: body.productCount || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      status: body.status || "Active",
    };
    const created = await upsertStoreRecord("Categories", categoryData);
    return jsonResponse({ success: true, category: created }, 201);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to create category" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
