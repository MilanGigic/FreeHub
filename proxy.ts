import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/landing", "/dashboard"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session")?.value;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    // If user is logged in and tries to access marketing/auth pages, redirect to dashboard
    if (
      sessionToken &&
      (pathname === "/" ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/landing")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Unauthenticated users hitting root should go to landing
    if (!sessionToken && pathname === "/") {
      return NextResponse.redirect(new URL("/landing", request.url));
    }

    return NextResponse.next();
  }

  // Protect all other routes
  if (!sessionToken && !pathname.includes("/landing")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
