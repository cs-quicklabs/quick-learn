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
  RouteEnum.COMMUNITY,
];

// Define routes that both admin and superadmin can access
const ADMIN_AND_SUPERADMIN_ROUTES = [
  RouteEnum.TEAM,
  RouteEnum.ARCHIVED_USERS,
  RouteEnum.TEAM,
  RouteEnum.APPROVALS,
  RouteEnum.FLAGGED,
];
const EDITOR_ROUTES = [RouteEnum.CONTENT, RouteEnum.FLAGGED];

// Helper functions
const isPublicRoute = (path: string) => PUBLIC_ROUTES.includes(path);
const isSuperAdminOnlyRoute = (path: string) =>
  SUPERADMIN_ONLY_ROUTES.some((route) => path.startsWith(route));
const isAdminAndSuperAdminRoute = (path: string) =>
  ADMIN_AND_SUPERADMIN_ROUTES.some((route) => path.startsWith(route));
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

  // Protected routes
  if (!authToken) {
    // Preserve the original URL (path + search params) in the redirect query parameter
    const redirectUrl = encodeURIComponent(`${pathname}${search}`);
    const loginUrl = new URL(LOGIN_ROUTE, origin);
    loginUrl.searchParams.set('redirect', redirectUrl);
    return NextResponse.redirect(loginUrl);
  }
  // Role-based route checks
  const roleBasedRedirect = (condition: boolean) =>
    condition
      ? NextResponse.next()
      : NextResponse.redirect(new URL(RouteEnum.MY_LEARNING_PATH, request.url));

  if (isEditorRoute(pathname)) {
    return roleBasedRedirect(
      userRoleNum === UserTypeIdEnum.EDITOR ||
        userRoleNum === UserTypeIdEnum.ADMIN ||
        userRoleNum === UserTypeIdEnum.SUPERADMIN,
    );
  }

  if (isSuperAdminOnlyRoute(pathname)) {
    return roleBasedRedirect(userRoleNum === UserTypeIdEnum.SUPERADMIN);
  }

  if (isAdminAndSuperAdminRoute(pathname)) {
    return roleBasedRedirect(
      userRoleNum === UserTypeIdEnum.ADMIN ||
        userRoleNum === UserTypeIdEnum.SUPERADMIN,
    );
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
