import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  deleteStoreRecord,
  listStoreRecords,
  patchStoreRecord,
  type StoreCollection,
} from "@/lib/firebaseStore";

const adminCollections = {
  suppliers: "Suppliers",
  employees: "Employees",
  warehouses: "Warehouses",
} as const satisfies Record<string, StoreCollection>;

function resolveCollection(value: string) {
  return adminCollections[value as keyof typeof adminCollections];
}

async function requireAdmin(req: Request) {
  return (await getAuthFromReq(req))?.role === "ADMIN";
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  if (!(await requireAdmin(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  const { collection: collectionName, id } = await params;
  const collection = resolveCollection(collectionName);
  if (!collection) return jsonResponse({ error: "Unknown admin collection." }, 404);

  try {
    const updated = await patchStoreRecord(collection, id, await req.json());
    return updated
      ? jsonResponse({ success: true, record: updated })
      : jsonResponse({ error: "Record not found." }, 404);
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Could not update admin record." },
      503
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  if (!(await requireAdmin(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  const { collection: collectionName, id } = await params;
  const collection = resolveCollection(collectionName);
  if (!collection) return jsonResponse({ error: "Unknown admin collection." }, 404);

  try {
    const records = await listStoreRecords(collection);
    const record = records.find((entry) => String(entry.id) === id);
    if (!record) return jsonResponse({ error: "Record not found." }, 404);
    await deleteStoreRecord(collection, record.id);
    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Could not delete admin record." },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
