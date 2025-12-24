// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
   pages: {
    signIn: '/auth/sign-in', 
    signOut: '/',
    error: '/auth/error',
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [], 
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        
        // --- التعديل هنا ---
        // نقوم بإجبار النوع ليكون مطابقاً للأنواع المسموحة
        session.user.role = (token.role as "user" | "agent" | "admin") || "user"; 
      }
      return session;
    },
    authorized({ auth }) {
      const isLoggedIn = !!auth?.user;
      return isLoggedIn;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;
