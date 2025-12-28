// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// الحصول على الـ secret
const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // السماح بالوصول لصفحات المصادقة والملفات الثابتة
  if (
    pathname.startsWith('/auth/') || 
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // المسارات المحمية
  const protectedPaths = [
    '/add-property',
    '/profile', 
    '/settings',
    '/my-properties',
    '/favorites',
    '/messages',
    '/admin',
    '/dashboard',
    '/edit-property',
  ];
  
  const isProtectedRoute = protectedPaths.some(path => 
    pathname.startsWith(path)
  );
  
  if (isProtectedRoute) {
    // التحقق من وجود الـ secret
    if (!secret) {
      console.error('NEXTAUTH_SECRET is not defined');
      // في حالة عدم وجود secret، نسمح بالمرور ونترك الصفحة تتعامل مع المصادقة
      return NextResponse.next();
    }

    try {
      // استخدم getToken للتحقق من الجلسة
      const token = await getToken({
        req: request,
        secret: secret,
      });
      
      if (!token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // التحقق من صلاحيات الأدمن
      if (pathname.startsWith('/admin') && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/add-property/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/my-properties/:path*',
    '/favorites/:path*',
    '/messages/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    '/edit-property/:path*',
  ],
};