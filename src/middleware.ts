import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { 
  matcher: [
    "/app/:path*",
    "/dashboard/:path*", 
    "/profile/:path*", 
    "/settings/:path*", 
    "/insights/:path*", 
    "/reports/:path*",
    "/projects/:path*"
  ] 
};

export function middleware(req: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  const isAuthed = req.cookies.has("sb-access-token") || req.cookies.has("sb-access-token.0");
  if (!isAuthed) {
    const url = req.nextUrl;
    const signin = new URL("/signin", url);
    signin.searchParams.set("next", url.pathname + url.search);
    return NextResponse.redirect(signin);
  }
  return NextResponse.next();
}
