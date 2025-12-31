// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  // ✅ صفحات مخصصة
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  
  // ✅ إعدادات الجلسة
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },
  
  // ✅ Callbacks للمصادقة في الـ middleware
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const pathname = nextUrl.pathname;
      
      // ✅ المسارات العامة (لا تحتاج مصادقة)
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
      
      // ✅ التحقق من المسارات العامة أولاً
      if (publicPaths.some(path => pathname.startsWith(path))) {
        return true;
      }
      
      // ✅ المسارات المحمية
      const protectedPaths = [
        "/add-property",
        "/profile",
        "/settings",
        "/my-properties",
        "/favorites",
        "/messages",
        "/dashboard",
        "/admin",
        "/edit-property",
      ];
      
      const isProtectedRoute = protectedPaths.some(path => 
        pathname.startsWith(path)
      );
      
      if (isProtectedRoute) {
        // إذا لم يكن مسجلاً
        if (!isLoggedIn) {
          return false;
        }
        
        // ✅ التحقق من صلاحيات الأدمن
        if (pathname.startsWith("/admin") && userRole !== "admin") {
          return false;
        }
        
        return true;
      }
      
      return true;
    },
  },
  
  // ✅ إعدادات أخرى
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
