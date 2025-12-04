import {
  Building,
  Building2,
  LayoutDashboard,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Users,
  FileText,
  Mail,
  Image,
  Newspaper,
  BookOpen,
} from 'lucide-react';
import { Route } from '../types';

export const createHeaderRoutes = (): Route[] => [
  {
    title: 'Dashboard',
    url: `/admin`,
    icon: <LayoutDashboard className='h-4 w-4' />,
    isActive: (path: string) => path === `/admin`,
  },
];

export const settingTabs = () => [
  {
    label: 'General',
    value: 'general',
    description: 'Profile, branding, and basic settings',
    icon: <Building2 className="h-4 w-4" />,
    url: `/admin/settings/general`,
  },
  {
    label: 'Banks',
    value: 'banks',
    description: 'Bank accounts and payout settings',
    icon: <Building className="h-4 w-4" />,
    url: `/admin/settings/banks`,
  },
  {
    label: 'Roles',
    value: 'roles',
    description: 'Assign roles and permissions to members',
    icon: <Users className="h-4 w-4" />,
    url: `/admin/settings/roles`,
  },
];

export const createMainRoutes = (): Route[] => [
  {
    title: 'Categories',
    url: '/admin/categories',
    icon: <LayoutGrid className='h-4 w-4' />,
    isActive: (path: string) => path.startsWith('/admin/categories'),
  },
  {
    title: 'Books',
    url: `/admin/books`,
    icon: <Package className='h-4 w-4' />,
    isActive: (path: string) => path.startsWith(`/admin/books`),
  },
  {
    title: 'Blogs',
    url: `/admin/blogs`,
    icon: <FileText className='h-4 w-4' />,
    isActive: (path: string) => path.startsWith(`/admin/blogs`),
  },
  {
    title: 'Publications',
    url: `/admin/publications`,
    icon: <BookOpen className='h-4 w-4' />,
    isActive: (path: string) => path.startsWith(`/admin/publications`),
  },
  {
    title: 'Media',
    url: `/admin/media`,
    icon: <Image className='h-4 w-4' />,
    isActive: (path: string) => path.startsWith(`/admin/media`),
  },
  {
    title: 'Newsletter',
    url: `/admin/newsletter`,
    icon: <Newspaper className='h-4 w-4' />,
    isActive: (path: string) => path.startsWith(`/admin/newsletter`),
  },
  {
    title: 'Contact',
    url: `/admin/contact`,
    icon: <Mail className='h-4 w-4' />,
    isActive: (path: string) => path.startsWith(`/admin/contact`),
  },
  {
    title: 'Orders',
    url: `/admin/orders`,
    icon: <ShoppingCart className='h-4 w-4' />,
    isActive: (path: string) => path.startsWith(`/admin/orders`),
  },
  {
    title: 'Settings',
    url: `/admin/settings`,
    icon: <Settings className='h-4 w-4' />,
    isActive: (path: string) => path.startsWith(`/admin/settings`),
    items: settingTabs().map(tab => ({
      title: tab.label,
      url: tab.url,
      icon: tab.icon,
      isActive: (path: string) => path.startsWith(tab.url),
    })),
  },
];

export const createFooterRoutes = (): Route[] => [
  // {
  //   title: 'Support',
  //   url: `/${baseRoute}/support`,
  //   icon: <HelpCircle className='h-4 w-4' />,
  //   isActive: (path: string) => path.startsWith(`/${baseRoute}/support`),
  // },
  // {
  //   title: 'Docs',
  //   url: `https://docs.yourapp.com`,
  //   icon: <Book className='h-4 w-4' />,
  //   isActive: () => false,
  //   external: true,
  // },
];
