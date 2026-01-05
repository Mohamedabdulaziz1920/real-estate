// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";

// ✅ تأكد من وجود المتغيرات
if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  console.warn("⚠️ AUTH_SECRET or NEXTAUTH_SECRET is not defined");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ⭐ 1. Adapter - استخدم type assertion لحل المشكلة
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  
  // ⭐ 2. الصفحات
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  
  // ⭐ 3. إعدادات الجلسة - مهم جداً
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
    updateAge: 24 * 60 * 60, // تحديث كل 24 ساعة
  },
  
  // ⭐ 4. Providers
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Missing credentials");
            return null;
          }

          // استيراد ديناميكي
          const dbConnect = (await import("@/lib/mongoose")).default;
          const User = (await import("@/models/User")).default;

          await dbConnect();

          const user = await User.findOne({
            email: credentials.email.toString().toLowerCase(),
          }).select("+password");

          if (!user) {
            console.log("❌ User not found");
            return null;
          }

          if (!user.password) {
            console.log("❌ No password - Google account");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password.toString(),
            user.password
          );

          if (!isValid) {
            console.log("❌ Invalid password");
            return null;
          }

          if (user.isActive === false) {
            console.log("❌ Account disabled");
            return null;
          }

          console.log("✅ User authenticated:", user.email);

          // ✅ إرجاع بيانات المستخدم
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("❌ Auth error:", error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  
  // ⭐ 5. Callbacks - مهمة جداً
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // عند تسجيل الدخول لأول مرة
      if (user) {
        console.log("🔑 JWT callback - user:", user.email);
        token.id = user.id;
        token.role = user.role || "user";
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      
      // عند تحديث الجلسة
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log("📦 Session callback - token:", token.email);
      
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "user";
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // إذا كان URL نسبي
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // إذا كان من نفس الموقع
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // الافتراضي
      return baseUrl;
    },
  },
  
  // ⭐ 6. Events - للتتبع
  events: {
    async signIn({ user }) {
      console.log("✅ Sign in event:", user.email);
    },
    async signOut() {
      console.log("👋 Sign out event");
    },
  },
  
  // ⭐ 7. الإعدادات الأساسية
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});