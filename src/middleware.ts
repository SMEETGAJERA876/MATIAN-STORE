import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, TOKEN_NAME } from "./lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected admin route
  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin-panel") ||
    pathname.startsWith("/api/admin");

  const isAdminLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isAdminLoginRoute) {
    const token = request.cookies.get(TOKEN_NAME)?.value;

    if (!token) {
      // Redirect to /admin/login for admin routes or /403
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized: Missing authentication token" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
      }
      // Customer trying to enter admin route -> redirect to 403 Unauthorized page
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/admin-panel/:path*",
    "/api/admin/:path*",
  ],
};
