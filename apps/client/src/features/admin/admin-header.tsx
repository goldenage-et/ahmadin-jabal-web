'use client';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  Settings as Cog,
  User,
  Home,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

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
    <header className='sticky top-0 z-30 border-b bg-background border-border dark:bg-background-dark dark:border-border-dark'>
      <div className='h-14 flex items-center justify-between px-4 md:px-6'>
        {/* Left Section - Brand, Menu, Search */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Hamburger Menu */}
          <button
            type='button'
            onClick={() => {
              // On mobile, open the modal overlay
              // On desktop, toggle sidebar collapse
              if (isMobile) {
                onMenu();
              } else {
                onToggleSidebar?.();
              }
            }}
            className='p-1.5 rounded-md hover:bg-accent dark:hover:bg-accent-dark'
            aria-label={isMobile ? 'Open menu' : (sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
          >
            <Menu size={18} className='text-foreground dark:text-foreground-dark' />
          </button>
          {/* Back to Home Button */}
          <Button variant='outline' size='sm' asChild className='text-xs'>
            <Link href="/">
              <Home className='h-4 w-4 mr-1' />
              Back to Home
            </Link>
          </Button>



          {/* Search Bar */}
          <div className='hidden md:flex items-center gap-2 bg-muted dark:bg-muted-dark rounded-md px-3 py-1.5'>
            <Search size={16} className='text-muted-foreground dark:text-muted-foreground-dark' />
            <input
              placeholder='Search for Results...'
              className='outline-none text-xs bg-transparent w-40 lg:w-48 text-foreground placeholder-muted-foreground dark:text-foreground-dark placeholder-muted-foreground-dark'
            />
          </div>
        </div>

        {/* Right Section - Icons and Time */}
        <div className='flex items-center gap-1 sm:gap-2'>

          {/* Notifications */}
          <div className='relative' ref={notifRef}>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                setNotifOpen((v) => !v);
              }}
              className='relative p-1 rounded-md hover:bg-accent dark:hover:bg-accent-dark'
              aria-haspopup='menu'
              aria-expanded={notifOpen}
              aria-label='Notifications'
            >
              <Bell size={18} className='text-foreground dark:text-foreground-dark' />
              <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-3 w-3 flex items-center justify-center text-[8px]'>4</span>
            </button>
            {notifOpen && (
              <div className='absolute right-0 mt-2 w-64 rounded-md border bg-background border-border shadow-lg p-2'>
                <p className='px-2 py-1 text-xs text-muted-foreground dark:text-muted-foreground-dark'>Notifications</p>
                <ul className='max-h-64 overflow-auto'>
                  {[
                    { id: 1, text: 'New vendor signup' },
                    { id: 2, text: 'Order A1032 paid' },
                    { id: 3, text: 'System backup complete' },
                  ].map((n) => (
                    <li
                      key={n.id}
                      className='px-2 py-1.5 text-xs hover:bg-accent text-foreground dark:text-foreground-dark dark:hover:bg-accent-dark rounded'
                    >
                      {n.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />



          {/* User Avatar */}
          <div className='relative' ref={profileRef}>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((v) => !v);
              }}
              className='h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 shadow-sm flex items-center justify-center dark:from-yellow-400 dark:to-orange-500 dark:text-white'
              aria-haspopup='menu'
              aria-expanded={profileOpen}
              aria-label='Profile menu'
            >
              <User size={18} className='text-white' />
            </button>
            {profileOpen && (
              <div className='absolute right-0 mt-2 w-44 rounded-md border bg-background border-border shadow-lg py-1'>
                <div className='px-3 py-1.5 text-xs text-foreground dark:text-foreground-dark hover:bg-accent flex items-center gap-2 cursor-pointer'>
                  <User size={12} />
                  <span>My Profile</span>
                </div>
                <div className='px-3 py-1.5 text-xs text-foreground dark:text-foreground-dark hover:bg-accent flex items-center gap-2 cursor-pointer'>
                  <Cog size={12} />
                  <span>Settings</span>
                </div>
                <div className='border-t border-border my-1' />
                <button type='button' className='w-full text-left px-3 py-1.5 text-xs text-destructive dark:text-destructive-foreground hover:bg-destructive/10 flex items-center gap-2'>
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
