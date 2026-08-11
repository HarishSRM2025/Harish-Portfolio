import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE = "portfolio_admin_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

async function isValidToken(token) {
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow the login page and its API route through untouched.
  if (pathname === "/admin/login" || pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");

  // /api/contact is special-cased: POST (visitor sending a message) is public,
  // but GET/PATCH/DELETE (admin reading/managing the inbox) require auth.
  const isContactApi = pathname.startsWith("/api/contact");
  const isContactProtected = isContactApi && request.method !== "POST";

  const isOtherProtectedApi =
    pathname.startsWith("/api/") &&
    !isContactApi &&
    request.method !== "GET" &&
    !pathname.startsWith("/api/auth");

  const isProtectedApi = isContactProtected || isOtherProtectedApi;

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const valid = token ? await isValidToken(token) : false;

  if (!valid) {
    if (isAdminPage) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"]
};
