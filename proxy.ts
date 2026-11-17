import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "sr-Latn"];
const intlMiddleware = createMiddleware({ locales, defaultLocale: "en" });

const publicPaths = ["/", "/login", "/register", "/landing"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session")?.value;

  const first = pathname.split("/")[1];
  const hasLocale = locales.includes(first);
  const locale = hasLocale ? first : "en";
  const path = hasLocale ? pathname.slice(first.length + 1) || "/" : pathname;

  const isPublic = publicPaths.includes(path);

  if (sessionToken && isPublic) {
    // Logged-in users on auth/marketing pages go to the dashboard
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  if (!sessionToken && path === "/") {
    return NextResponse.redirect(new URL(`/${locale}/landing`, request.url));
  }

  if (!sessionToken && !isPublic) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
