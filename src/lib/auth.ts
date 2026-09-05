import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { extractCredentials, verifyCredentials, createAdminClient } from "@supabase/server/core";
import { resolveSupabaseEnv, getSupabaseJwks } from "./supabase/env";
import type { Database } from "./supabase/types";

const JWT_SECRET = process.env.JWT_SECRET || "matrin_enterprise_secret_jwt_key_2026_x9823";
const TOKEN_NAME = "matrin_token";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  name: string;
}

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// Authentication is backed by Supabase Auth. Since supabase-js keeps its
// session client-side (not as an httpOnly cookie), AuthContext mirrors the
// current access token into a plain "sb-access-token" cookie so same-origin
// fetch() calls from the admin dashboard keep working without every call
// site having to attach an Authorization header.
export async function getAuthFromReq(req: Request): Promise<TokenPayload | null> {
  const baseEnv = resolveSupabaseEnv();
  if (!baseEnv.url) return null;

  let creds = extractCredentials(req);

  if (!creds.token) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => {
          const [k, ...v] = c.split("=");
          return [k, decodeURIComponent(v.join("="))];
        })
      );
      if (cookies["sb-access-token"]) {
        creds = { token: cookies["sb-access-token"], apikey: null };
      }
    }
  }

  const jwks = await getSupabaseJwks(baseEnv.url);
  const env = { ...baseEnv, jwks };

  const { data: auth, error } = await verifyCredentials(creds, { auth: "user", env });
  if (error || !auth?.userClaims) return null;

  // Role lookup is best-effort: a misconfigured/missing secret key must never
  // crash the request, and must never fail open to ADMIN — default CUSTOMER.
  try {
    const supabaseAdmin = createAdminClient<Database>({ env });
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("name, email, role")
      .eq("id", auth.userClaims.id)
      .single();

    return {
      userId: auth.userClaims.id,
      email: profile?.email || auth.userClaims.email || "",
      name: profile?.name || "",
      role: (profile?.role as "ADMIN" | "CUSTOMER") || "CUSTOMER",
    };
  } catch (err) {
    console.error("Failed to resolve Supabase profile/role:", err);
    return {
      userId: auth.userClaims.id,
      email: auth.userClaims.email || "",
      name: "",
      role: "CUSTOMER",
    };
  }
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export function jsonResponse(data: unknown, status = 200, headers = {}) {
  return NextResponse.json(data, {
    status,
    headers: {
      ...corsHeaders(),
      ...headers,
    },
  });
}

export { TOKEN_NAME };
