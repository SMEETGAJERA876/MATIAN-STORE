import { NextResponse } from "next/server";
import { generateToken, TOKEN_NAME } from "@/lib/auth";

// Backs the client-side "Quick Admin Login" demo account, which never creates
// a Supabase session. Admin-only write routes verify requests via
// getAuthFromReq, which checks for this JWT cookie before falling back to
// Supabase — without it, every admin mutation (add/edit/delete product, etc.)
// silently 403s while the UI still shows a success toast.
const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@matrin.com").toLowerCase();
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Admin123!";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = (body?.email || "").trim().toLowerCase();
  const password = body?.password || "";

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  const token = generateToken({
    userId: "usr_admin_01",
    email,
    role: "ADMIN",
    name: "MATRIN Administrator",
  });

  const res = NextResponse.json({ success: true });
  res.cookies.set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(TOKEN_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
