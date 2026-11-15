import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { getFirebaseConfigStatus } from "@/lib/firebase/admin";
import { testFirebaseConnection } from "@/lib/firebaseStore";

export async function GET() {
  const status = getFirebaseConfigStatus();
  return jsonResponse({
    status: {
      ...status,
      ready:
        status.serviceAccountConfigured &&
        status.authWebConfigConfigured &&
        status.adminEmailConfigured,
    },
  });
}

export async function POST(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    await testFirebaseConnection();
    return jsonResponse({ success: true, message: "Firebase Realtime Database connection is working." });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Firebase connection test failed." },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
