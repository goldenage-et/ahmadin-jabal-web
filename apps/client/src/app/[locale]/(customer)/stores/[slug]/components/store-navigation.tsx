'use client';

import { useRouter, usePathname } from 'next/navigation';

interface StoreNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function StoreNavigation({
  activeTab,
  onTabChange,
}: StoreNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: 'home', label: 'Store Home', path: '' },
    { id: 'books', label: 'Books', path: '/books' },
    { id: 'feedback', label: 'Feedback', path: '/feedback' },
  ];

  const handleTabClick = (tab: { id: string; path: string }) => {
    onTabChange(tab.id);

    // Extract the store slug from the current path
    const pathParts = pathname.split('/');
    const storeIndex = pathParts.findIndex((part) => part === 'stores');
    const storeSlug = pathParts[storeIndex + 1];

    // Navigate to the appropriate page
    if (tab.path === '') {
      router.push(`/stores/${storeSlug}`);
    } else {
      router.push(`/stores/${storeSlug}${tab.path}`);
    }
  };

  return (
    <div className='bg-white border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <nav className='flex items-center space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.id === 'books' && (
                <svg
                  className='inline-block ml-1 w-3 h-3 sm:w-4 sm:h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
