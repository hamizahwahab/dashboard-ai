import { NextResponse } from 'next/server';

/**
 * Middleware to protect private routes.
 * Checks for the existence of the 'token' cookie.
 */
export function middleware(request) {
  // 1. Get the token from cookies
  const token = request.cookies.get('token');
  
  // 2. Define protected routes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/chat');

  // 3. If it's a protected route and no token exists, redirect to /auth
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  // 4. Otherwise, allow the request to proceed
  return NextResponse.next();
}

// Matcher ensures the middleware only runs on specific paths for performance
export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*'],
};
