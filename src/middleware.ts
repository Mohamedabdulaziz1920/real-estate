import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ⭐ أضف هذا السطر ⭐
export const dynamic = 'force-dynamic';

// ⭐ استبدل export const config بـ export const matcher ⭐
export const matcher = [
  '/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // الحصول على الـ secret
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  
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
