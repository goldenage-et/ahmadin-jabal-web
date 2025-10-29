import { ReactNode } from 'react';

export interface Route {
  isActive: (pathname: string) => boolean;
  className?: string;
  title: string;
  icon: ReactNode;
  url: string;
  end?: ReactNode;
  items?: RouteItem[];
  external?: boolean;
  show?: boolean;
}

export interface RouteItem {
  isActive: (pathname: string) => boolean;
  className?: string;
  title: string;
  icon?: ReactNode;
  end?: ReactNode;
  url: string;
  show?: boolean;
}

export interface NavigationConfig {
  headerRoutes: Route[];
  mainRoutes: Route[];
  footerRoutes: Route[];
}

export interface SidebarProps {
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
}

export interface NavItemProps {
  item: Route;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan?: string;
}

export interface User {
  id: string;
  firstName?: string;
  email?: string;
}

export interface AuthOrg {
  organization: Organization;
}

export interface OrganizationSwitcherProps {
  user: User | null;
  organizations: AuthOrg[];
  noSidebar?: boolean;
  className?: string;
}
