import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  listStoreRecords,
  upsertStoreRecord,
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  if (!(await requireAdmin(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  const { collection: collectionName } = await params;
  const collection = resolveCollection(collectionName);
  if (!collection) return jsonResponse({ error: "Unknown admin collection." }, 404);

  try {
    return jsonResponse(await listStoreRecords(collection));
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Could not load admin records." },
      503
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  if (!(await requireAdmin(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  const { collection: collectionName } = await params;
  const collection = resolveCollection(collectionName);
  if (!collection) return jsonResponse({ error: "Unknown admin collection." }, 404);

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return jsonResponse({ error: "A name is required." }, 400);
    const id = body.id || (collection === "Warehouses" ? name : `${collectionName}-${Date.now()}`);
    const record = await upsertStoreRecord(collection, { ...body, id, name });
    return jsonResponse({ success: true, record }, 201);
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Could not save admin record." },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
