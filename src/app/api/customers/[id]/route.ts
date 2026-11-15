import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  deleteStoreRecord,
  listStoreRecords,
  patchStoreRecord,
} from "@/lib/firebaseStore";

type SheetCustomer = { id: string | number; [key: string]: unknown };

async function requireAdmin(req: Request) {
  const auth = await getAuthFromReq(req);
  return auth?.role === "ADMIN";
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const update: Record<string, unknown> = {};
    for (const key of ["name", "status", "role"] as const) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const customers = await listStoreRecords<SheetCustomer>("Customers");
    const users = await listStoreRecords<SheetCustomer>("Users");
    const customer = customers.find((entry) => String(entry.id) === id || entry.email === id);
    const user = users.find((entry) => String(entry.id) === id || entry.email === customer?.email);
    const updatedCustomer = customer
      ? await patchStoreRecord<SheetCustomer>("Customers", customer.id, update)
      : null;
    const updatedUser = user
      ? await patchStoreRecord<SheetCustomer>("Users", user.id, update)
      : null;
    const updated = updatedCustomer || updatedUser;
    return updated ? jsonResponse({ success: true, customer: updated }) : jsonResponse({ error: "Customer not found" }, 404);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to update customer" },
      503
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const [customers, users] = await Promise.all([
      listStoreRecords<SheetCustomer>("Customers"),
      listStoreRecords<SheetCustomer>("Users"),
    ]);
    const customer = customers.find((entry) => String(entry.id) === id || entry.email === id);
    if (!customer) return jsonResponse({ error: "Customer not found" }, 404);
    await deleteStoreRecord("Customers", customer.id);
    const user = users.find((entry) => String(entry.id) === id || entry.email === customer.email);
    if (user) await deleteStoreRecord("Users", user.id);
    return jsonResponse({
      success: true,
      message: "Customer profile removed from the database. Their Firebase Authentication account remains active.",
    });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to delete customer" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
