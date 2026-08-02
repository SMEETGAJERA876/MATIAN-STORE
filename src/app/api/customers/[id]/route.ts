import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromReq(req);
  if (auth && auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const db = await connectToDatabase();
    if (db) {
      const updated = await UserModel.findOneAndUpdate({ id }, { $set: body }, { new: true }).select("-password");
      if (updated) return jsonResponse({ success: true, customer: updated });
    }

    const index = inMemoryStore.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      inMemoryStore.users[index] = { ...inMemoryStore.users[index], ...body };
      const { password, ...cust } = inMemoryStore.users[index];
      return jsonResponse({ success: true, customer: cust });
    }

    return jsonResponse({ error: "Customer not found" }, 404);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update customer" }, 500);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromReq(req);
  if (auth && auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      await UserModel.deleteOne({ id });
      return jsonResponse({ success: true, message: "Customer deleted" });
    }

    inMemoryStore.users = inMemoryStore.users.filter((u) => u.id !== id);
    return jsonResponse({ success: true, message: "Customer deleted" });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to delete customer" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
