// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  const protectedPaths = [
    "/add-property",
    "/profile",
    "/settings",
    "/my-properties",
    "/favorites",
    "/messages",
    "/admin",
  ];

  if (
    protectedPaths.some((path) => pathname.startsWith(path)) &&
    !isLoggedIn
  ) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
