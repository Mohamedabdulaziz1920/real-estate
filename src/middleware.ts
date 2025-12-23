// src/middleware.ts - النسخة النهائية
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;
  
  // ⭐ 1. صفحات auth تعمل بدون تدخل
  if (pathname.startsWith('/auth/')) {
    // إذا كان المستخدم مسجلاً ويحاول الوصول إلى صفحات auth
    if (isLoggedIn && (pathname === '/auth/sign-in' || pathname === '/auth/register')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  
  // ⭐ 2. حماية صفحات الإدارة (admin فقط)
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // ⭐ 3. حماية الصفحات الشخصية (يحتاج تسجيل دخول)
  const protectedPaths = [
    '/add-property',
    '/profile', 
    '/settings',
    '/my-properties',
    '/favorites',
    '/messages'
  ];
  
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth/sign-in", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // ⭐ 4. الصفحات العامة المسموح للجميع
  const publicPaths = [
    "/",                    // الصفحة الرئيسية
    "/about",               // صفحة عنا
    "/contact",             // اتصل بنا
    "/properties",          // قائمة العقارات
    "/properties/:path*",   // تفاصيل العقارات
    "/auth/sign-in",        // تسجيل الدخول (معالج أعلاه)
    "/auth/register",       // إنشاء حساب (معالج أعلاه)
    "/auth/forgot-password" // نسيان كلمة المرور
  ];
  
  const isPublicPath = publicPaths.some(path => {
    if (path.includes(":path*")) {
      return pathname.startsWith(path.replace(":path*", ""));
    }
    return pathname === path;
  });
  
  // ⭐ 5. إذا لم تكن الصفحة عامة والمستخدم غير مسجل
  if (!isLoggedIn && !isPublicPath) {
    const loginUrl = new URL("/auth/sign-in", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  // ⭐ استثني الملفات الثابتة وملفات API وصفحات auth من المعالجة المسبقة
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/).*)"],
};