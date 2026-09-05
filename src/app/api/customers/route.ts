import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialUsers } from "@/lib/inMemoryStore";

export async function GET(req: Request) {
  const auth = getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  const db = await connectToDatabase();
  if (db) {
    const count = await UserModel.countDocuments();
    if (count === 0) {
      await UserModel.insertMany(initialUsers);
    }

    const customers = await UserModel.find({ role: "CUSTOMER" }).select("-password").sort({ createdAt: -1 });
    return jsonResponse(customers);
  }

  const memCustomers = inMemoryStore.users
    .filter((u) => u.role === "CUSTOMER")
    .map(({ password, ...u }) => u);
  return jsonResponse(memCustomers);
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
