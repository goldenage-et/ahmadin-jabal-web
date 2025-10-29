const checkMach = (routes: string[], pathname: string) => {
  return routes.some((route) => {
    const pathnames = pathname.split('/').filter((url) => url !== '');
    const urls = route.split('/').filter((url) => url !== '');
    const indexOf = urls.indexOf('*');
    if (indexOf !== -1) {
      const allMatch = pathnames.every(
        (pathname, idx) => idx >= indexOf || pathname === urls[idx],
      );
      return allMatch;
    }
    const valid = urls.every(
      (url, idx) => pathnames.at(idx) === url || url === '_',
    );
    return valid;
  });
};

export const isHomeRoute = (local: string, url: string) => url === `/${local}/`;

export const isAuthRoute = (local: string, pathname: string): boolean => {
  const routes = [
    `/${local}/auth/signin`,
    `/${local}/auth/signup`,
    `/${local}/auth/verify-email`,
    `/${local}/auth/forgot-password`,
  ];
  return checkMach(routes, pathname);
};

export const isAdminRoute = (local: string, pathname: string): boolean => {
  const routes = [
    `/${local}/admin`,
    `/${local}/admin/*`
  ];
  return checkMach(routes, pathname);
};

export const isProfileRoute = (local: string, pathname: string): boolean => {
  const routes = [`/${local}/me`, `/${local}/profile`, `/${local}/my-orders`];
  return checkMach(routes, pathname);
};

export const isProtectedRoute = (local: string, pathname: string): boolean => {
  const routes = [
    `/${local}/profile/*`,
    `/${local}/my-orders/*`,
    `/${local}/checkout/*`,
  ];
  return checkMach(routes, pathname);
};

export const isPublicRoute = (local: string, pathname: string): boolean => {
  const routes = [
    `/${local}/not-found`,
    `/${local}/offline`,
    `/${local}/next/image`,
    `/${local}/shop/*`,
    `/${local}/projects/*`,
    `/${local}/about/*`,
    `/${local}/cart/*`,
    `/${local}/checkout/*`,
    `/${local}/contact/*`,
    `/${local}/faq/*`,
    `/${local}/books/*`,
    `/${local}/categories/*`,
    `/${local}/privacy-policy/*`,
    `/${local}/terms-of-service/*`,
    `/${local}/returns-and-refunds/*`,
    `/${local}/create-store/*`,
  ];
  return (
    isHomeRoute(local, pathname) ||
    isAuthRoute(local, pathname) ||
    checkMach(routes, pathname)
  );
};

export const isBadRoute = (local: string, pathname: string): boolean => {
  const routes = [`${local}/undefined`, `${local}/null`];
  return checkMach(routes, pathname);
};

export const isBadSlug = (local: string, slug: string): boolean => {
  const slugs = [`${local}/undefined`, `${local}/null`];
  return checkMach(slugs, slug);
};

export const isPrivateRoute = (local: string, pathname: string): boolean => {
  if (isPublicRoute(local, pathname)) {
    return false;
  }
  const result =
    isAdminRoute(local, pathname) ||
    isProfileRoute(local, pathname) ||
    isProtectedRoute(local, pathname);
  return result;
};

export const isSyncWithUserIdentificationEndpoint = (
  url: string,
): { organizationId: string; userId: string } | false => {
  const regex = /\/api\/v1\/client\/([^/]+)\/app\/sync\/([^/]+)/;
  const match = url.match(regex);
  return match ? { organizationId: match[1], userId: match[2] } : false;
};
