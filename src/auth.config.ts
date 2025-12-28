import type { NextAuthConfig } from "next-auth";

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

      const protectedPaths = [
        "/add-property",
        "/profile",
        "/settings",
        "/my-properties",
        "/favorites",
        "/messages",
        "/admin",
        "/dashboard",
      ];

      const isProtectedRoute = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },

    jwt({ token, user }) {
      if (user) {
        // تم التعديل هنا: استخدام (??) للتعامل مع احتمال أن يكون الـ id غير موجود
        token.id = user.id ?? "";
        token.role = (user as any).role || "user";
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  
  // تم التعديل هنا: إضافة مصفوفة المزودين (مطلوبة حتى لو كانت فارغة في ملف الـ config)
  providers: [], 

} satisfies NextAuthConfig;