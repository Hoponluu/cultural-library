import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/ChatVietCMS/login";
  const isLoginApi = pathname === "/api/admin/login";

  const isAdminPage = pathname.startsWith("/ChatVietCMS") && !isLoginPage;
  const isAdminApi = pathname.startsWith("/api/admin") && !isLoginApi;

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = verifySessionToken(token);

  if (authed) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/ChatVietCMS/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/ChatVietCMS/:path*", "/api/admin/:path*"],
};
