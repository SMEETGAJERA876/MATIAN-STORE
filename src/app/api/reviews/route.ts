import { connectToDatabase } from "@/lib/db";
import { ReviewModel } from "@/models/Review";
import { jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialReviews } from "@/lib/inMemoryStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const db = await connectToDatabase();
  if (db) {
    const count = await ReviewModel.countDocuments();
    if (count === 0) {
      await ReviewModel.insertMany(initialReviews);
    }

    const query = productId ? { productId: Number(productId) } : {};
    const reviews = await ReviewModel.find(query).sort({ createdAt: -1 });
    return jsonResponse(reviews);
  }

  let list = [...inMemoryStore.reviews];
  if (productId) {
    list = list.filter((r) => r.productId === Number(productId));
  }
  return jsonResponse(list);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reviewData = {
      id: body.id || `rev_${Date.now()}`,
      productId: Number(body.productId),
      productName: body.productName || "Cleaning Product",
      customerName: body.customerName || "Verified Customer",
      customerEmail: body.customerEmail,
      rating: Number(body.rating),
      comment: body.comment,
      date: body.date || new Date().toISOString().split("T")[0],
      status: body.status || "Pending",
    };

    const db = await connectToDatabase();
    if (db) {
      const created = await ReviewModel.create(reviewData);
      return jsonResponse({ success: true, review: created }, 201);
    }

    inMemoryStore.reviews.unshift(reviewData as unknown as (typeof inMemoryStore.reviews)[0]);
    return jsonResponse({ success: true, review: reviewData }, 201);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to submit review" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
