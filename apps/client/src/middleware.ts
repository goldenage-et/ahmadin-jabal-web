import {
  isAdminRoute,
  isAuthRoute,
  isPrivateRoute,
  isProfileRoute,
} from '@/middleware/endpointValidator';
import { ErrorType } from '@repo/common';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuth } from './actions/auth.action';
import { client_host } from './config/host.config.mjs';
import { isValidCallbackUrl } from './utils/url';
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const local = request.nextUrl.locale;
  const response = intlMiddleware(request);

  if (!pathname.startsWith('/api') && !pathname.includes('.')) {
    const { user, error } = await getAuth();
    const isLoggedIn = !!user;

    if (
      error &&
      error.errorType === ErrorType.EMAIL_NOT_VERIFIED &&
      !pathname.includes('/auth/verify-email')
    ) {
      const verifyUrl = new URL(`/${local}/auth/verify-email`, request.url);
      verifyUrl.searchParams.set('callbackUrl', pathname);
      return response || NextResponse.redirect(verifyUrl);
    }

    if (isPrivateRoute(local, pathname) && !isAuthRoute(local, pathname) && !isLoggedIn) {
      const loginUrl = new URL(`/${local}/auth/signin`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return response || NextResponse.redirect(loginUrl);
    }

    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    if (
      callbackUrl &&
      !isValidCallbackUrl(client_host + `/${local}` + callbackUrl, client_host)
    ) {
      return response || NextResponse.json({ error: 'Invalid callback URL' });
    }

    if (isLoggedIn && callbackUrl) {
      return response || NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    const isSuperAdmin = user?.roles?.length && user.roles.length > 0;
    if (isPrivateRoute(local, pathname)) {
      if (isProfileRoute(local, pathname)) {
        return response || NextResponse.next();
      } else if (isSuperAdmin && isAdminRoute(local, pathname)) {
        return response || NextResponse.next();
      } else if (!pathname.startsWith(`/${local}/not-found`)) {
        return response || NextResponse.redirect(new URL(`/${local}/not-found`, request.url));
      }
    }
  }

  return response || NextResponse.next();
};

export const config = {
  matcher: [
    '/((?!api|offline|static|manifest.json|favicon.ico|robots.txt|_next/static|_next/image|sw.js|service-worker.js|[^/]+\\.[^/]+$).*)',
    "/(en|am|or)/:path*"
  ],
};
