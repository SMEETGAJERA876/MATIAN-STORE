import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialSettings } from "@/lib/inMemoryStore";
import {
  listOrSeedStoreRecords,
  patchStoreRecord,
} from "@/lib/firebaseStore";

type SheetSettings = typeof initialSettings & {
  id: string;
  securitySettings?: { twoFactorEnabled: boolean; ipWhitelist: string[] };
};

export async function GET(req: Request) {
  try {
    const [settings] = await listOrSeedStoreRecords<SheetSettings>("Settings", [
      { ...initialSettings, id: "settings_main" },
    ]);
    const result = settings || { ...initialSettings, ...inMemoryStore.settings, id: "settings_main" };
    if ((await getAuthFromReq(req))?.role === "ADMIN") return jsonResponse(result);
    const publicSettings = { ...result };
    delete publicSettings.securitySettings;
    return jsonResponse(publicSettings);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load settings" },
      503
    );
  }
}

export async function PUT(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const body = await req.json();
    const [current] = await listOrSeedStoreRecords<SheetSettings>("Settings", [
      { ...initialSettings, id: "settings_main" },
    ]);
    const settings = await patchStoreRecord<SheetSettings>(
      "Settings",
      "settings_main",
      { ...current, ...body, id: "settings_main" }
    );
    if (!settings) return jsonResponse({ error: "Settings record not found" }, 404);
    return jsonResponse({ success: true, settings });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to update settings" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
