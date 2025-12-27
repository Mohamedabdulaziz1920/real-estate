// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // السماح بالوصول لصفحات المصادقة
  if (nextUrl.pathname.startsWith("/auth/")) {
    // إذا مسجل دخول، وجهه للرئيسية
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // المسارات المحمية
  const protectedPaths = [
    "/add-property",
    "/profile",
    "/settings",
    "/my-properties",
    "/favorites",
    "/messages",
    "/dashboard",
  ];

  const isProtectedRoute = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  // مسارات الأدمن
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isProtectedRoute || isAdminRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl)
      );
    }

    // تحقق من صلاحيات الأدمن
    if (isAdminRoute && req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|public).*)",
  ],
};