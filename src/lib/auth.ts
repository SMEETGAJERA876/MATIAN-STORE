import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { getStoreRecord } from "@/lib/firebaseStore";
import { jsonResponse } from "@/lib/authResponse";

const SESSION_COOKIE_NAME = "firebase_session";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  name: string;
}

function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...value] = cookie.trim().split("=");
      try {
        return [key, decodeURIComponent(value.join("="))];
      } catch {
        return [key, value.join("=")];
      }
    })
  );
}

export async function getAuthFromReq(req: Request): Promise<TokenPayload | null> {
  const cookies = parseCookies(req);
  const bearer = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const sessionCookie = cookies[SESSION_COOKIE_NAME];
  if (!sessionCookie && !bearer) return null;

  try {
    const adminAuth = getFirebaseAdminAuth();
    const decoded = sessionCookie
      ? await adminAuth.verifySessionCookie(sessionCookie, true)
      : await adminAuth.verifyIdToken(bearer!, true);
    const email = decoded.email?.toLowerCase() || "";
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
    const profile = await getStoreRecord<{ id: string; name?: string; status?: string }>(
      "Users",
      decoded.uid
    );

    if (profile?.status === "Blocked" || profile?.status === "Inactive") return null;

    return {
      userId: decoded.uid,
      email,
      role:
        email &&
        email === configuredAdminEmail &&
        decoded.email_verified === true
          ? "ADMIN"
          : "CUSTOMER",
      name: profile?.name || decoded.name || "",
    };
  } catch {
    return null;
  }
}

export function isAdminEmail(email: string, emailVerified = false) {
  const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  return (
    emailVerified &&
    Boolean(configuredAdminEmail) &&
    email.trim().toLowerCase() === configuredAdminEmail
  );
}

export { jsonResponse, SESSION_COOKIE_NAME };
