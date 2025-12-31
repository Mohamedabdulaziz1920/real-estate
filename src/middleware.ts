// src/middleware.ts - النسخة النهائية الموصى بها
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // التحقق من صلاحيات الأدمن
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // المسارات العامة
        const publicPaths = [
          "/",
          "/auth/login",
          "/auth/register",
          "/auth/forgot-password",
          "/auth/reset-password",
          "/properties",
          "/api/auth",
          "/_next",
          "/images",
          "/favicon.ico",
          "/api/upload", // ⭐ أضف هذا إذا كان upload مسار عام
        ];

        // السماح بالوصول للمسارات العامة
        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true;
        }

        // المسارات المحمية
        const protectedPaths = [
          "/add-property",
          "/profile",
          "/settings",
          "/my-properties",
          "/favorites",
          "/messages",
          "/admin",
          "/dashboard",
          "/edit-property",
        ];

        const isProtected = protectedPaths.some(path => 
          pathname.startsWith(path)
        );

        if (isProtected && !token) {
          return false;
        }

        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
