import { getAuthFromReq, isAdminEmail, jsonResponse, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { getStoreRecord, upsertStoreRecord } from "@/lib/firebaseStore";

const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
  status: "Active" | "Blocked" | "Inactive";
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
};

function createProfile(
  uid: string,
  email: string,
  name: string,
  emailVerified: boolean,
  existing?: Partial<UserProfile> | null
): UserProfile {
  return {
    id: uid,
    email,
    name: name || existing?.name || email.split("@")[0],
    role: isAdminEmail(email, emailVerified) ? "ADMIN" : "CUSTOMER",
    status: existing?.status || "Active",
    createdAt: existing?.createdAt || new Date().toISOString(),
    totalOrders: Number(existing?.totalOrders) || 0,
    totalSpent: Number(existing?.totalSpent) || 0,
  };
}

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  };
}

export async function GET(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth) {
    return jsonResponse({ error: "Unauthorized" }, 401, { "Cache-Control": "no-store" });
  }

  try {
    const existing = await getStoreRecord<UserProfile>("Users", auth.userId);
    const profile = createProfile(auth.userId, auth.email, auth.name, auth.role === "ADMIN", existing);
    await upsertStoreRecord("Users", profile);
    return jsonResponse({ user: profile }, 200, { "Cache-Control": "no-store" });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Could not load the user profile." },
      503
    );
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return jsonResponse({ error: "Invalid request origin." }, 403);

  try {
    const { idToken, name } = await req.json();
    if (typeof idToken !== "string" || !idToken) {
      return jsonResponse({ error: "Firebase ID token is required." }, 400);
    }

    const adminAuth = getFirebaseAdminAuth();
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    const email = decoded.email?.trim().toLowerCase();
    if (!decoded.uid || !email) {
      return jsonResponse({ error: "The Firebase account must have an email address." }, 401);
    }

    const existing = await getStoreRecord<UserProfile>("Users", decoded.uid);
    if (existing?.status === "Blocked" || existing?.status === "Inactive") {
      return jsonResponse({ error: "This account is currently disabled." }, 403);
    }

    const profile = createProfile(
      decoded.uid,
      email,
      name || decoded.name || "",
      decoded.email_verified === true,
      existing
    );
    await upsertStoreRecord("Users", profile);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    const response = jsonResponse({ success: true, user: profile });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, cookieOptions());
    return response;
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Could not establish Firebase session." },
      401
    );
  }
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return jsonResponse({ error: "Invalid request origin." }, 403);
  const response = jsonResponse({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", { ...cookieOptions(), maxAge: 0 });
  return response;
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
