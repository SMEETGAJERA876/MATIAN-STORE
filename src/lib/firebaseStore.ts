import { getFirebaseAdminDatabase } from "@/lib/firebase/admin";

export const collections = [
  "Products",
  "Categories",
  "Coupons",
  "Orders",
  "Customers",
  "Users",
  "Reviews",
  "SupportTickets",
  "Notifications",
  "Settings",
  "InventoryLogs",
  "Leads",
  "Suppliers",
  "Employees",
  "Warehouses",
] as const;

export type StoreCollection = (typeof collections)[number];
export type StoreRecord = { id: string | number };

function recordKey(id: string | number) {
  return Buffer.from(String(id), "utf8").toString("base64url");
}

function firebaseSafeValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function listStoreRecords<T extends StoreRecord>(
  collection: StoreCollection
): Promise<T[]> {
  const snapshot = await getFirebaseAdminDatabase().ref(collection).once("value");
  const values = snapshot.val();
  if (!values || typeof values !== "object") return [];
  return Object.values(values).filter(
    (value): value is T =>
      value !== null && typeof value === "object" && "id" in value
  );
}

export async function getStoreRecord<T extends StoreRecord>(
  collection: StoreCollection,
  id: string | number
): Promise<T | null> {
  const snapshot = await getFirebaseAdminDatabase()
    .ref(collection)
    .child(recordKey(id))
    .once("value");
  return (snapshot.val() as T | null) || null;
}

export async function upsertStoreRecord<T extends StoreRecord>(
  collection: StoreCollection,
  record: T
): Promise<T> {
  const safeRecord = firebaseSafeValue(record);
  await getFirebaseAdminDatabase()
    .ref(collection)
    .child(recordKey(record.id))
    .set(safeRecord);
  return record;
}

export async function patchStoreRecord<T extends StoreRecord>(
  collection: StoreCollection,
  id: string | number,
  patch: Partial<T>
): Promise<T | null> {
  const reference = getFirebaseAdminDatabase().ref(collection).child(recordKey(id));
  const snapshot = await reference.once("value");
  const current = snapshot.val() as T | null;
  if (!current) return null;

  const updated = firebaseSafeValue({ ...current, ...patch, id: current.id }) as T;
  await reference.set(updated);
  return updated;
}

export async function deleteStoreRecord(
  collection: StoreCollection,
  id: string | number
): Promise<boolean> {
  const reference = getFirebaseAdminDatabase().ref(collection).child(recordKey(id));
  const snapshot = await reference.once("value");
  if (!snapshot.exists()) return false;
  await reference.remove();
  return true;
}

export async function listOrSeedStoreRecords<T extends StoreRecord>(
  collection: StoreCollection,
  seedRecords: T[]
): Promise<T[]> {
  const records = await listStoreRecords<T>(collection);
  if (records.length > 0 || seedRecords.length === 0) return records;

  for (const record of seedRecords) {
    await upsertStoreRecord(collection, record);
  }
  return listStoreRecords<T>(collection);
}

export async function testFirebaseConnection() {
  await getFirebaseAdminDatabase().ref("_meta/health").set({
    checkedAt: new Date().toISOString(),
  });
  return true;
}
