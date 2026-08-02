import { connectToDatabase } from "@/lib/db";
import { NotificationModel } from "@/models/Notification";
import { jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialNotifications } from "@/lib/inMemoryStore";

export async function GET() {
  const db = await connectToDatabase();
  if (db) {
    const count = await NotificationModel.countDocuments();
    if (count === 0) {
      await NotificationModel.insertMany(initialNotifications);
    }
    const notifications = await NotificationModel.find().sort({ createdAt: -1 });
    return jsonResponse(notifications);
  }

  return jsonResponse(inMemoryStore.notifications);
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, isRead } = body;

    const db = await connectToDatabase();
    if (db) {
      if (id) {
        await NotificationModel.updateOne({ id }, { $set: { isRead } });
      } else {
        await NotificationModel.updateMany({}, { $set: { isRead: true } });
      }
      return jsonResponse({ success: true });
    }

    if (id) {
      const target = inMemoryStore.notifications.find((n) => n.id === id);
      if (target) target.isRead = isRead;
    } else {
      inMemoryStore.notifications.forEach((n) => (n.isRead = true));
    }

    return jsonResponse({ success: true });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update notifications" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
