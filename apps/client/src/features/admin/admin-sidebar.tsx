'use client';
import {
  CreditCard,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  Settings,
  Store,
  Users,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function AdminSidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(prev => !prev));

  const nav = [
    { href: '/admin/', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', Icon: Users },
    { href: '/admin/stores', label: 'Stores', Icon: Store },
    { href: '/admin/categories', label: 'Categories', Icon: LayoutGrid },
    { href: '/admin/payment-methods', label: 'Payment Methods', Icon: CreditCard },
    { href: '/admin/settings', label: 'Settings', Icon: Settings },
    { href: '/admin/support', label: 'Support', Icon: LifeBuoy },
  ];

  const widthCls = isCollapsed ? 'md:w-20' : 'md:w-72';

  return (
    <>
      <aside
        className={[
          'fixed z-40 md:static h-svh border-r shadow-sm flex flex-col',
          widthCls,
          'bg-white',
          'transition-transform md:transition-[width] md:duration-300',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className='absolute right-2 top-2 p-2 rounded-md hover:bg-gray-100 md:hidden'
          aria-label='Close menu'
        >
          <X size={16} />
        </button>

        <div className='h-14 px-5   flex items-center justify-between'>
          <div>
            <Link href='/admin/' className='block'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>A</span>
                </div>
                <span
                  className={[
                    'text-2xl font-extrabold tracking-tight text-gray-800',
                    isCollapsed ? 'hidden' : '',
                  ].join(' ')}
                >
                  ahmadin
                </span>
              </div>
            </Link>
          </div>
        </div>

        <nav className='p-3'>
          <div className='mb-4'>
            <h3 className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>
              {isCollapsed ? '' : 'MAIN'}
            </h3>
          </div>
          <ul className='space-y-1'>
            {nav.map(({ href, label, Icon }) => {
              const active =
                href === '/admin/'
                  ? pathname === '/admin/'
                  : pathname?.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-gray-200 text-gray-900 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                    ].join(' ')}
                    title={isCollapsed ? label : undefined}
                  >
                    <Icon size={18} />
                    <span className={isCollapsed ? 'hidden' : ''}>
                      {label}
                    </span>
                    {active && !isCollapsed && (
                      <span className='ml-auto text-xs'>▲</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className='mt-auto p-3 text-xs text-gray-500'>
          <p className={isCollapsed ? 'hidden' : ''}>v1.0 • Control Center</p>
        </div>
      </aside>
      {open && (
        <div
          onClick={onClose}
          className='fixed inset-0 z-30 bg-black/30 md:hidden'
        />
      )}
    </>
  );
}
