// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

// ✅ التأكد من وجود متغيرات البيئة
if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET is not defined in environment variables");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ✅ استخدام adapter مع MongoDB
  adapter: MongoDBAdapter(clientPromise),
  
  // ✅ الصفحات المخصصة
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
  
  // ✅ Providers
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
          }

          // استيراد ديناميكي لتجنب مشاكل البناء
          const dbConnect = (await import("@/lib/mongodb")).default;
          const User = (await import("@/models/User")).default;

          await dbConnect();

          const user = await User.findOne({
            email: credentials.email.toString().toLowerCase(),
          }).select("+password");

          if (!user) {
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          }

          // التحقق إذا كان المستخدم مسجل عبر Google
          if (!user.password) {
            throw new Error("هذا الحساب مسجل بواسطة Google. الرجاء استخدام تسجيل الدخول عبر Google");
          }

          // التحقق من كلمة المرور
          const isValid = await bcrypt.compare(
            credentials.password.toString(),
            user.password
          );

          if (!isValid) {
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          }

          // التحقق من حالة الحساب
          if (user.isActive === false) {
            throw new Error("الحساب معطل. يرجى التواصل مع الإدارة");
          }

          // إرجاع بيانات المستخدم
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role || "user",
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "حدث خطأ في تسجيل الدخول");
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  
  // ✅ Callbacks مهمة لإضافة البيانات إلى الجلسة
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // عند تسجيل الدخول
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      // عند تحديث الجلسة
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // توجيه بعد تسجيل الدخول
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    }
  },
  
  // ✅ إعدادات مهمة
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  
  // ✅ إعدادات الـ Cookies
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 يوم
      },
    },
  },
});
