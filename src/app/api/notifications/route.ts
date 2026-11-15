import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialNotifications } from "@/lib/inMemoryStore";
import {
  deleteStoreRecord,
  listOrSeedStoreRecords,
  listStoreRecords,
  patchStoreRecord,
} from "@/lib/firebaseStore";

type SheetNotification = { id: string | number; [key: string]: unknown };

async function requireAdmin(req: Request) {
  const auth = await getAuthFromReq(req);
  return auth?.role === "ADMIN";
}

export async function GET(req: Request) {
  if (!(await requireAdmin(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const notifications = await listOrSeedStoreRecords<SheetNotification>(
      "Notifications",
      [...inMemoryStore.notifications, ...initialNotifications]
    );
    return jsonResponse(notifications.sort((a, b) =>
      String(b.timestamp || "").localeCompare(String(a.timestamp || ""))
    ));
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load notifications" },
      503
    );
  }
}

export async function PUT(req: Request) {
  if (!(await requireAdmin(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id, isRead } = await req.json();
    const notifications = await listStoreRecords<SheetNotification>("Notifications");
    const targets = id
      ? notifications.filter((notification) => String(notification.id) === String(id))
      : notifications;

    await Promise.all(
      targets.map((notification) =>
        patchStoreRecord<SheetNotification>("Notifications", notification.id, {
          isRead: id ? Boolean(isRead) : true,
        })
      )
    );
    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to update notifications" },
      503
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const notifications = await listStoreRecords<SheetNotification>("Notifications");
    await Promise.all(
      notifications.map((notification) =>
        deleteStoreRecord("Notifications", notification.id)
      )
    );
    return jsonResponse({ success: true, deletedCount: notifications.length });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to delete notifications" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
