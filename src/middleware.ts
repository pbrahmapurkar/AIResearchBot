import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/app/:path*"] };

export function middleware(req: NextRequest) {
  const isAuthed = req.cookies.has("sb-access-token") || req.cookies.has("sb-access-token.0");
  if (!isAuthed) {
    const url = req.nextUrl;
    const signin = new URL("/signin", url);
    signin.searchParams.set("redirect", url.pathname + url.search);
    return NextResponse.redirect(signin);
  }
  return NextResponse.next();
}
