// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";
import { UserRole } from "@/types/next-auth"; 

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/admin");
      
      const protectedPaths = [
        "/add-property",
        "/profile",
        "/settings",
        "/my-properties",
        "/favorites",
        "/messages",
      ];

      const isProtectedRoute = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        if (userRole === "user") {
            return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },

    jwt({ token, user }) {
      if (user) {
        // ✅ الإصلاح هنا: استخدام (?? "") لضمان أن القيمة نص دائماً
        token.id = user.id ?? "";
        token.role = user.role;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user && token) {
        // ✅ نستخدم as string هنا لأن token.id قد يكون مخزناً كـ undefined في حالات نادرة
        session.user.id = token.id as string;     
        session.user.role = token.role; 
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [], 

} satisfies NextAuthConfig;