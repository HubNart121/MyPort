import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('port_track_auth');
  const isAuthenticated = authCookie?.value === 'authenticated';

  // Public paths that don't need authentication
  const publicPaths = ['/login', '/debug/auth', '/diag'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // If trying to access a protected page without being authenticated
  if (!isAuthenticated && !isPublicPath && pathname !== '/') {
    // Also protect the root path
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle root path specifically since it's the main dashboard
  if (pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
