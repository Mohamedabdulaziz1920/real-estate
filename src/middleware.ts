import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;
  const isLoggedIn = !!sessionToken;
  
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }
  
  const protectedPaths = [
    '/add-property', '/profile', '/settings',
    '/my-properties', '/favorites', '/messages', '/admin'
  ];
  
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/).*)'],
};
