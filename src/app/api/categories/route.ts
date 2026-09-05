import { connectToDatabase } from "@/lib/db";
import { CategoryModel } from "@/models/Category";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialCategories } from "@/lib/inMemoryStore";

export async function GET() {
  const db = await connectToDatabase();
  if (db) {
    const count = await CategoryModel.countDocuments();
    if (count === 0) {
      await CategoryModel.insertMany(initialCategories);
    }
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    return jsonResponse(categories);
  }

  return jsonResponse(inMemoryStore.categories);
}

export async function POST(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const body = await req.json();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categoryData = {
      id: body.id || `cat_${Date.now()}`,
      name: body.name,
      slug,
      description: body.description || "",
      iconName: body.iconName || "Sparkles",
      productCount: body.productCount || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      status: body.status || "Active",
    };

    const db = await connectToDatabase();
    if (db) {
      const created = await CategoryModel.create(categoryData);
      return jsonResponse({ success: true, category: created }, 201);
    }

    inMemoryStore.categories.unshift(categoryData as unknown as (typeof inMemoryStore.categories)[0]);
    return jsonResponse({ success: true, category: categoryData }, 201);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to create category" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
