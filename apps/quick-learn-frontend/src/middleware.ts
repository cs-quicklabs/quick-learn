import { NextRequest, NextResponse } from 'next/server';
import { RouteEnum } from './constants/route.enum';
import { UserTypeIdEnum } from 'lib/shared/src';

// Constants
const PUBLIC_ROUTES = [
  '/',
  RouteEnum.LOGIN,
  RouteEnum.FORGOT_PASSWORD,
  RouteEnum.RESET_PASSWORD,
];
const LOGIN_ROUTE = RouteEnum.LOGIN;
const ADMIN_ROUTES = [
  RouteEnum.TEAM,
  RouteEnum.ACCOUNT_SETTINGS,
  RouteEnum.ARCHIVE,
];
const EDITOR_ROUTES = [RouteEnum.CONTENT];

// Helper functions
const isPublicRoute = (path: string) => PUBLIC_ROUTES.includes(path);
const isAdminRoute = (path: string) =>
  ADMIN_ROUTES.some((route) => path.startsWith(route));
const isEditorRoute = (path: string) =>
  EDITOR_ROUTES.some((route) => path.startsWith(route));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('refresh_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  // Public routes
  if (isPublicRoute(pathname)) {
    return authToken
      ? NextResponse.redirect(new URL(RouteEnum.MY_LEARNING_PATH, request.url))
      : NextResponse.next();
  }

  // Protected routes
  if (!authToken) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
  }

  // Check if the route is admin-only and user has the correct role
  if (isAdminRoute(pathname)) {
    if (
      (userRole &&
        parseInt(userRole) !== UserTypeIdEnum.ADMIN &&
        parseInt(userRole) !== UserTypeIdEnum.SUPERADMIN) ||
      !userRole
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
