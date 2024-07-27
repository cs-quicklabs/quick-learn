import { NextRequest, NextResponse } from 'next/server';
export function middleware(request: NextRequest) {
  console.log('middleware executed');
  const authToken = request.cookies.get('authToken')?.value;
  if (request.nextUrl.pathname === '/') {
    return;
  }
  const loggedInUserNotAccessPaths = request.nextUrl.pathname === '/';
  if (loggedInUserNotAccessPaths) {
    // access not secured route
    if (authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // accessing secured route
    if (!authToken) {
      return NextResponse.redirect(new URL('/', request.url));
    } else {
      // verify...
    }
  }
  // console.log(authToken);
  //   return NextResponse.redirect(new URL("/home", request.url));
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard',
    '/call-logs/:path*',
    '/expert-management/:path*',
    '/wallet-management/:path*',
    '/user-management/:path*',
    '/profile/:path*',
    '/api/:path*',
  ],
};
