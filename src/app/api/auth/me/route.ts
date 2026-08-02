import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function GET(req: Request) {
  const auth = getAuthFromReq(req);
  if (!auth) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const db = await connectToDatabase();
  if (db) {
    const user = await UserModel.findOne({ id: auth.userId });
    if (user) {
      return jsonResponse({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          status: user.status,
          createdAt: user.createdAt,
        },
      });
    }
  }

  const memUser = inMemoryStore.users.find((u) => u.id === auth.userId);
  if (memUser) {
    return jsonResponse({
      user: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        avatar: memUser.avatar,
        status: memUser.status,
        createdAt: memUser.createdAt,
      },
    });
  }

  return jsonResponse({
    user: {
      id: auth.userId,
      name: auth.name,
      email: auth.email,
      role: auth.role,
    },
  });
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
