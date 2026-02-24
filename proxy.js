import { NextResponse } from 'next/server';

export function proxy(request) {
  // 1. Define which paths are protected
  const path = request.nextUrl.pathname;
  const isProtectedPath = path.startsWith('/dashboard');

  // 2. Get the token (usually from cookies for Middleware)
  // Note: LocalStorage is not accessible in Middleware. 
  // For now, we will check if a "token" cookie exists.
  const token = request.cookies.get('token')?.value || '';

  // 3. If it's a protected path and there's no token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 4. If they are logged in and try to go to /login, send them to /dashboard
  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }
}

// Specify exactly which routes this middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};