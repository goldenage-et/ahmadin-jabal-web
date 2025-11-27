'use client';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  Settings as Cog,
  User,
  Home,
  ShoppingCart,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AdminHeader({
  onMenu,
  sidebarCollapsed,
  onToggleSidebar
}: {
  onMenu: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Track screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize(); // Check on mount
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <header className='sticky top-0 z-30 border-b bg-white'>
      <div className='h-14 flex items-center justify-between px-4 md:px-6'>
        {/* Left Section - Brand, Menu, Search */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Hamburger Menu */}
          <button
            onClick={() => {
              // On mobile, open the modal overlay
              // On desktop, toggle sidebar collapse
              if (isMobile) {
                onMenu();
              } else {
                onToggleSidebar?.();
              }
            }}
            className='p-1.5 rounded-md hover:bg-gray-100'
            aria-label={isMobile ? 'Open menu' : (sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
          >
            <Menu size={18} className='text-gray-600' />
          </button>
          {/* Back to Home Button */}
          <Button variant='outline' size='sm' asChild className='text-xs'>
            <Link href="/">
              <Home className='h-4 w-4 mr-1' />
              Back to Home
            </Link>
          </Button>



          {/* Search Bar */}
          <div className='hidden md:flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5'>
            <Search size={16} className='text-gray-500' />
            <input
              placeholder='Search for Results...'
              className='outline-none text-xs bg-transparent w-40 lg:w-48 text-gray-600 placeholder-gray-400'
            />
          </div>
        </div>

        {/* Right Section - Icons and Time */}
        <div className='flex items-center gap-1 sm:gap-2'>
          {/* Dark Mode Toggle */}
          <button className='hidden sm:block p-1 rounded-md hover:bg-gray-100'>
            <span className='text-lg'>🌙</span>
          </button>

          {/* Notifications */}
          <div className='relative' ref={notifRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotifOpen((v) => !v);
              }}
              className='relative p-1 rounded-md hover:bg-gray-100'
              aria-haspopup='menu'
              aria-expanded={notifOpen}
              aria-label='Notifications'
            >
              <Bell size={18} className='text-gray-600' />
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center text-[8px]'>4</span>
            </button>
            {notifOpen && (
              <div className='absolute right-0 mt-2 w-64 rounded-md border bg-white shadow-lg p-2'>
                <p className='px-2 py-1 text-xs text-gray-500'>Notifications</p>
                <ul className='max-h-64 overflow-auto'>
                  {[
                    { id: 1, text: 'New vendor signup' },
                    { id: 2, text: 'Order A1032 paid' },
                    { id: 3, text: 'System backup complete' },
                  ].map((n) => (
                    <li
                      key={n.id}
                      className='px-2 py-1.5 text-xs hover:bg-gray-50 rounded'
                    >
                      {n.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>


          {/* User Avatar */}
          <div className='relative' ref={profileRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((v) => !v);
              }}
              className='h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 shadow-sm flex items-center justify-center'
              aria-haspopup='menu'
              aria-expanded={profileOpen}
              aria-label='Profile menu'
            >
              <User size={18} className='text-white' />
            </button>
            {profileOpen && (
              <div className='absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-lg py-1'>
                <div className='px-3 py-1.5 text-xs text-gray-700 flex items-center gap-2'>
                  <User size={12} />
                  <span>My Profile</span>
                </div>
                <div className='px-3 py-1.5 text-xs text-gray-700 flex items-center gap-2'>
                  <Cog size={12} />
                  <span>Settings</span>
                </div>
                <div className='border-t my-1' />
                <button className='w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2'>
                  <LogOut size={12} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
