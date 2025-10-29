'use client';

import { useEffect } from 'react';

// Screen reader announcements for dynamic content
export function useScreenReaderAnnouncement() {
  const announce = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite',
  ) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
}

// Keyboard navigation helpers
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content (Alt + M)
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const mainContent =
          document.querySelector('main') ||
          document.querySelector('[role="main"]');
        if (mainContent) {
          (mainContent as HTMLElement).focus();
          (mainContent as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Skip to search (Alt + S)
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="search" i], input[type="search"]',
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Skip to filters (Alt + F)
      if (event.altKey && event.key === 'f') {
        event.preventDefault();
        const filterButton = document.querySelector(
          '[data-testid="filter-button"], button[aria-label*="filter" i]',
        ) as HTMLButtonElement;
        if (filterButton) {
          filterButton.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Focus management for modals and dropdowns
export function useFocusManagement(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);
}

// High contrast mode detection
export function useHighContrastMode() {
  useEffect(() => {
    const checkHighContrast = () => {
      const isHighContrast = window.matchMedia(
        '(prefers-contrast: high)',
      ).matches;
      document.documentElement.classList.toggle(
        'high-contrast',
        isHighContrast,
      );
    };

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    checkHighContrast();

    mediaQuery.addEventListener('change', checkHighContrast);
    return () => mediaQuery.removeEventListener('change', checkHighContrast);
  }, []);
}

// Reduced motion detection
export function useReducedMotion() {
  useEffect(() => {
    const checkReducedMotion = () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      document.documentElement.classList.toggle(
        'reduced-motion',
        prefersReducedMotion,
      );
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    checkReducedMotion();

    mediaQuery.addEventListener('change', checkReducedMotion);
    return () => mediaQuery.removeEventListener('change', checkReducedMotion);
  }, []);
}

// Accessibility announcement component
interface AccessibilityAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export function AccessibilityAnnouncer({
  message,
  priority = 'polite',
}: AccessibilityAnnouncerProps) {
  return (
    <div aria-live={priority} aria-atomic='true' className='sr-only'>
      {message}
    </div>
  );
}

// Skip links component
export function SkipLinks() {
  return (
    <div className='sr-only focus-within:not-sr-only'>
      <a
        href='#main-content'
        className='absolute top-4 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
      >
        Skip to main content
      </a>
      <a
        href='#search'
        className='absolute top-4 left-32 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
      >
        Skip to search
      </a>
      <a
        href='#filters'
        className='absolute top-4 left-64 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
      >
        Skip to filters
      </a>
    </div>
  );
}
