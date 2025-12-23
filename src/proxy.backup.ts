import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const protectedPaths = [
  '/add-property',
  '/profile',
  '/settings',
  '/my-properties',
  '/favorites',
  '/messages',
];

const adminPaths = ['/admin'];
const authPaths = ['/auth/login', '/auth/register'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // حماية صفحات الإدارة
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!isLoggedIn || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // حماية الصفحات المحمية
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }
  }

  // إعادة توجيه المستخدم المسجل من صفحات المصادقة
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/add-property/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/my-properties/:path*',
    '/favorites/:path*',
    '/messages/:path*',
    '/admin/:path*',
    '/auth/login',
    '/auth/register',
  ],
};