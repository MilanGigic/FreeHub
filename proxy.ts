import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "sr-Latn"],
  defaultLocale: "en",
});

const publicRoutes = ["/", "/login", "/register", "/landing", "/dashboard"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session")?.value;
  const locale = pathname.split("/")[1] || "en";

  const intlResponse = intlMiddleware(request);
  if (intlResponse) return intlResponse;

  const isPublicRoute = publicRoutes.some((route) => pathname.endsWith(route));

  if (isPublicRoute) {
    // Logged in users hitting auth/marketing pages → redirect to dashboard
    if (
      sessionToken &&
      (pathname.endsWith("/login") ||
        pathname.endsWith("/register") ||
        pathname.endsWith("/landing") ||
        pathname === "/")
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard`, request.url),
      );
    }

    // Unauthenticated users hitting root → redirect to landing
    if (!sessionToken && pathname === "/") {
      return NextResponse.redirect(new URL(`/${locale}/landing`, request.url));
    }

    return NextResponse.next();
  }

  // Protect all other routes
  if (!sessionToken && !pathname.includes("/landing")) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
