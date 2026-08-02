import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

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

export function getAuthFromReq(req: Request): TokenPayload | null {
  // 1. Check Authorization header
  const authHeader = req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (decoded) return decoded;
  }

  // 2. Check Cookies
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [k, ...v] = c.split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
    );
    if (cookies[TOKEN_NAME]) {
      const decoded = verifyToken(cookies[TOKEN_NAME]);
      if (decoded) return decoded;
    }
  }

  return null;
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
