import { NextResponse } from "next/server";

// Route-level guard: only logged-in users (a token cookie present) can open
// the /products pages. Already-logged-in users skip straight past /login.
// This only checks that a token exists, not that it's still valid — the
// axios response interceptor handles an expired/rejected token.
export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/products") && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/products";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/login"],
};
