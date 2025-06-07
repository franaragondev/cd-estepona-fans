import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { verifyToken } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

function logDev(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware]", ...args);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API, _next and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.[^\/]+$/)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const user = await verifyToken(token);

  const locale = pathname.split("/")[1];
  const supportedLocales = ["en", "es", "fr"];
  const currentLocale = supportedLocales.includes(locale) ? locale : "en";

  const isProtectedRoute = pathname.startsWith(`/${currentLocale}/admin`);
  const isAuthRoute = pathname.startsWith(`/${currentLocale}/auth/login`);

  logDev("Path:", pathname);
  logDev("User authenticated:", !!user);
  logDev("Protected route:", isProtectedRoute);
  logDev("Auth route:", isAuthRoute);

  // Redirect to login if accessing protected route without a valid token
  if (isProtectedRoute && !user) {
    logDev("Redirecting to login");
    return NextResponse.redirect(
      new URL(`/${currentLocale}/auth/login`, request.url)
    );
  }

  // Redirect to app if authenticated user tries to access auth routes
  if (isAuthRoute && user) {
    logDev("Redirecting to app");
    return NextResponse.redirect(
      new URL(`/${currentLocale}/app/home`, request.url)
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
