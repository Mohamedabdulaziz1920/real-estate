// src/middleware.ts - النسخة المبسطة
import { withAuth } from "next-auth/middleware";

export default withAuth({
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
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
