import { connectToDatabase } from "@/lib/db";
import { SettingsModel } from "@/models/Settings";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialSettings } from "@/lib/inMemoryStore";

export async function GET() {
  const db = await connectToDatabase();
  if (db) {
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = await SettingsModel.create(initialSettings);
    }
    return jsonResponse(settings);
  }

  return jsonResponse(inMemoryStore.settings);
}

export async function PUT(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const body = await req.json();
    const db = await connectToDatabase();

    if (db) {
      let settings = await SettingsModel.findOne();
      if (!settings) {
        settings = await SettingsModel.create({ ...initialSettings, ...body });
      } else {
        Object.assign(settings, body);
        await settings.save();
      }
      return jsonResponse({ success: true, settings });
    }

    inMemoryStore.settings = { ...inMemoryStore.settings, ...body };
    return jsonResponse({ success: true, settings: inMemoryStore.settings });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update settings" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
