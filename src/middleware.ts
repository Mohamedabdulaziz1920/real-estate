// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // الحصول على الـ secret
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  
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
        return NextResponse.redirect(new URL('/unauthorized', request.url));
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (auth endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)',
  ],
};