import { NextRequest, NextResponse } from 'next/server';
import { RouteEnum } from './constants/route.enum';
import { UserTypeIdEnum } from 'lib/shared/src';

// Constants
const PUBLIC_ROUTES = [
  '/',
  RouteEnum.LOGIN,
  RouteEnum.FORGOT_PASSWORD,
  RouteEnum.RESET_PASSWORD,
  RouteEnum.DAILY_LESSONS,
];
const LOGIN_ROUTE = RouteEnum.LOGIN;
const SUPERADMIN_ONLY_ROUTES = [
  RouteEnum.ACCOUNT_SETTINGS,  
  RouteEnum.COMMUNITY
  // Account settings restricted to superadmin only
];

// Define routes that both admin and superadmin can access
const ADMIN_AND_SUPERADMIN_ROUTES = [
  RouteEnum.TEAM,
  RouteEnum.ARCHIVED_USERS,
  RouteEnum.CONTENT,
];
const EDITOR_ROUTES = [RouteEnum.CONTENT];

// Helper functions
const isPublicRoute = (path: string) => PUBLIC_ROUTES.includes(path);
const isSuperAdminOnlyRoute = (path: string) => 
  SUPERADMIN_ONLY_ROUTES.some(route => path.startsWith(route));
const isAdminAndSuperAdminRoute = (path: string) => 
  ADMIN_AND_SUPERADMIN_ROUTES.some(route => path.startsWith(route));
const isEditorRoute = (path: string) =>
  EDITOR_ROUTES.some((route) => path.startsWith(route));

export async function middleware(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl;
  const authToken = request.cookies.get('refresh_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const userRoleNum = userRole ? parseInt(userRole) : null;
  // Public routes
  if (isPublicRoute(pathname)) {
    return authToken
      ? NextResponse.redirect(new URL(RouteEnum.MY_LEARNING_PATH, request.url))
      : NextResponse.next();
  }

//   // Protected routes
  if (!authToken) {
    // Preserve the original URL (path + search params) in the redirect query parameter
    const redirectUrl = encodeURIComponent(`${pathname}${search}`);
    const loginUrl = new URL(LOGIN_ROUTE, origin);
    loginUrl.searchParams.set('redirect', redirectUrl);
    return NextResponse.redirect(loginUrl);
  }

// Check superadmin-only routes first
  if (isSuperAdminOnlyRoute(pathname)) {
    if (userRoleNum !== UserTypeIdEnum.SUPERADMIN) {
      return NextResponse.redirect(
        new URL(RouteEnum.MY_LEARNING_PATH, request.url),
      );
    }
    return NextResponse.next();
  }

  // Check admin and superadmin routes
  if (isAdminAndSuperAdminRoute(pathname)) {
    if (
      userRoleNum !== UserTypeIdEnum.ADMIN &&
      userRoleNum !== UserTypeIdEnum.SUPERADMIN
    ) {
      return NextResponse.redirect(
        new URL(RouteEnum.MY_LEARNING_PATH, request.url),
      );
    }
    return NextResponse.next();
  }

  // Check if the route is editor-only and user has the correct role
  if (isEditorRoute(pathname)) {
    if (
      (userRole && parseInt(userRole) === UserTypeIdEnum.MEMBER) ||
      !userRole
    ) {
      return NextResponse.redirect(
        new URL(RouteEnum.MY_LEARNING_PATH, request.url),
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/forgot-password',
    '/reset-password',
  ],
};
