import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { verifyToken } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

const supportedLocales = ["en", "es", "fr"];
const defaultLocale = "es";

function logDev(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware]", ...args);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and APIs
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.[^\/]+$/)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const user = await verifyToken(token);

  const pathnameLocale = pathname.split("/")[1];
  const hasLocale = supportedLocales.includes(pathnameLocale);

  const isProtectedRoute =
    hasLocale && pathname.startsWith(`/${pathnameLocale}/admin`);
  const isAuthRoute =
    hasLocale && pathname.startsWith(`/${pathnameLocale}/auth/login`);

  logDev("Path:", pathname);
  logDev("User authenticated:", !!user);
  logDev("Protected route:", isProtectedRoute);
  logDev("Auth route:", isAuthRoute);

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !user) {
    logDev("Redirecting to login");
    return NextResponse.redirect(
      new URL(`/${pathnameLocale}/auth/login`, request.url)
    );
  }

  // Redirect to app if logged in user accesses login page
  if (isAuthRoute && user) {
    logDev("Redirecting to app");
    return NextResponse.redirect(new URL(`/${pathnameLocale}`, request.url));
  }

  if (!hasLocale) {
    const botAgents = ["googlebot", "adsbot-google", "mediapartners-google"];
    const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
    const isGooglebot = botAgents.some((bot) => userAgent.includes(bot));

    if (isGooglebot) {
      return NextResponse.redirect(new URL(`/es${pathname}`, request.url), 301);
    }

    const acceptedLanguages = request.headers.get("accept-language");
    const preferredLocale =
      acceptedLanguages
        ?.split(",")
        .map((lang) => lang.split(";")[0].trim().split("-")[0])
        .find((lang) => supportedLocales.includes(lang)) || defaultLocale;

    logDev("No locale in path. Redirecting to preferred:", preferredLocale);

    return NextResponse.redirect(
      new URL(`/${preferredLocale}${pathname}`, request.url),
      301
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
