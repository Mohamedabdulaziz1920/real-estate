// src/auth.ts - النسخة الكاملة المصححة
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // تأكد من أن هذا الملف يصدر MongoClient
import bcrypt from "bcryptjs";

// ✅ تأكد من وجود المتغيرات
if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  throw new Error("AUTH_SECRET or NEXTAUTH_SECRET is not defined");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ⭐ 1. Adapter مهم جداً
  adapter: MongoDBAdapter(clientPromise),
  
  // ⭐ 2. الصفحات
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  
  // ⭐ 3. إعدادات الجلسة
  session: {
    strategy: "jwt", // تأكد من أن هذا موجود
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },
  
  // ⭐ 4. Providers
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

          // استيراد ديناميكي
          const dbConnect = (await import("@/lib/mongoose")).default; // استخدم mongoose هنا
          const User = (await import("@/models/User")).default;

          await dbConnect();

          const user = await User.findOne({
            email: credentials.email.toString().toLowerCase(),
          }).select("+password");

          if (!user) {
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          }

          if (!user.password) {
            throw new Error("هذا الحساب مسجل بواسطة Google");
          }

          const isValid = await bcrypt.compare(
            credentials.password.toString(),
            user.password
          );

          if (!isValid) {
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          }

          // ✅ أضف التحقق من isActive
          if (user.isActive === false) {
            throw new Error("الحساب معطل. يرجى التواصل مع الإدارة");
          }

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
    }),
  ],
  
  // ⭐ 5. Callbacks مهمة جداً
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
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
  
  // ⭐ 6. الإعدادات الأساسية
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  
  // ⭐ 7. إعدادات الـ Cookies
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
});
