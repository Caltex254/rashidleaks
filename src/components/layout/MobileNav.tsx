// RASHID LEAKS - Mobile Bottom Navigation Component
// Provides easy thumb-zone navigation for mobile users

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, Heart, PlusCircle, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

interface MobileNavLink {
  href: string;
  icon: React.ElementType;
  label: string;
  requiresAuth?: boolean;
}

const mainLinks: MobileNavLink[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/categories', icon: Compass, label: 'Categories' },
  { href: '/trending', icon: Heart, label: 'Trending' },
];

const authLinks: MobileNavLink[] = [
  { href: '/account/favorites', icon: Heart, label: 'Favorites', requiresAuth: true },
  { href: '/account', icon: User, label: 'Account', requiresAuth: true },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { setSearchOpen } = useUIStore();

  // Hide on desktop and certain pages
  const isVideoPage = pathname?.startsWith('/video/');
  const isAgeGatePage = pathname === '/age-gate';
  
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) return null;
  if (isVideoPage || isAgeGatePage) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      router.push('/register');
      return;
    }
    router.push('/upload');
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0f0f0f]/95 backdrop-blur-md border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {/* Main Navigation Links */}
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[44px] rounded-lg transition-colors',
                active 
                  ? 'text-red-400' 
                  : 'text-gray-400 hover:text-white active:bg-white/5'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'scale-110 transition-transform')} />
              <span className={cn(
                'text-[10px] mt-1 font-medium',
                active ? 'text-red-400' : 'text-gray-500'
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}

        {/* Upload Button (Center) */}
        <button
          onClick={handleUploadClick}
          className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[44px] -mt-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all active:scale-95">
            <PlusCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-[10px] mt-1 font-medium text-gray-500">Upload</span>
        </button>

        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          className={cn(
            'flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[44px] rounded-lg transition-colors',
            pathname === '/search'
              ? 'text-red-400'
              : 'text-gray-400 hover:text-white active:bg-white/5'
          )}
        >
          <Search className={cn('h-5 w-5', pathname === '/search' && 'scale-110')} />
          <span className={cn(
            'text-[10px] mt-1 font-medium',
            pathname === '/search' ? 'text-red-400' : 'text-gray-500'
          )}>
            Search
          </span>
        </button>

        {/* Account/Favorites */}
        {isAuthenticated ? (
          <Link
            href="/account"
            className={cn(
              'flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[44px] rounded-lg transition-colors',
              pathname?.startsWith('/account')
                ? 'text-red-400'
                : 'text-gray-400 hover:text-white active:bg-white/5'
            )}
          >
            <User className={cn('h-5 w-5', pathname?.startsWith('/account') && 'scale-110')} />
            <span className={cn(
              'text-[10px] mt-1 font-medium',
              pathname?.startsWith('/account') ? 'text-red-400' : 'text-gray-500'
            )}>
              Account
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[44px] rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium text-gray-500">Login</span>
          </Link>
        )}
      </div>

      {/* Safe Area Bottom Padding */}
      <div className="h-safe-area-inset-bottom bg-[#0f0f0f]" />
    </nav>
  );
}

/**
 * Wrapper component that adds bottom padding to content when mobile nav is present
 * Use this in your page layouts to prevent content from being hidden behind the nav
 */
export function MobileNavSpacer() {
  return <div className="h-20 lg:hidden" />;
}

export default MobileNav;
