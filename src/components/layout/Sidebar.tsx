// RASHID LEAKS - Sidebar Navigation Component (Desktop)

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Compass, 
  TrendingUp, 
  Clock, 
  Heart,
  User,
  Settings,
  Upload,
  Shield,
  Flag,
  FileText,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarLink {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

const mainSections: SidebarSection[] = [
  {
    title: 'Menu',
    links: [
      { href: '/', icon: Home, label: 'Home' },
      { href: '/trending', icon: TrendingUp, label: 'Trending', badge: '🔥' },
      { href: '/categories', icon: Compass, label: 'Categories' },
      { href: '/search', icon: HelpCircle, label: 'Search' },
    ],
  },
  {
    title: 'Your Content',
    links: [
      { href: '/account/favorites', icon: Heart, label: 'Favorites', requiresAuth: true },
      { href: '/account/history', icon: Clock, label: 'Watch History', requiresAuth: true },
      { href: '/upload', icon: Upload, label: 'Upload Video', requiresAuth: true },
    ],
  },
];

const legalSections: SidebarSection[] = [
  {
    title: 'Legal & Safety',
    links: [
      { href: '/legal/terms', icon: FileText, label: 'Terms of Service' },
      { href: '/legal/privacy', icon: Shield, label: 'Privacy Policy' },
      { href: '/reports', icon: Flag, label: 'Report Content' },
      { href: '/legal/contact', icon: HelpCircle, label: 'Contact Us' },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, role } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const renderLink = (link: SidebarLink) => {
    // Skip auth-required links if not authenticated
    if (link.requiresAuth && !isAuthenticated) return null;
    
    // Skip admin-only links if not admin/moderator
    if (link.adminOnly && user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') return null;

    const Icon = link.icon;
    const active = isActive(link.href);

    return (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          active
            ? 'bg-gradient-to-r from-red-500/20 to-pink-500/10 text-red-400 border border-red-500/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        )}
      >
        <Icon className={cn('h-4 w-4 shrink-0', active && 'text-red-400')} />
        <span className="flex-1">{link.label}</span>
        {link.badge && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-white/10 text-gray-300">
            {link.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0f0f0f] border-r border-white/10',
        className
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
            <span className="text-white font-bold">RL</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              RASHID LEAKS
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Adult Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-6">
          {/* Main Sections */}
          {mainSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.links.map(renderLink)}
              </div>
            </div>
          ))}

          {/* Admin Section */}
          {(user?.role === 'ADMIN' || user?.role === 'MODERATOR') && (
            <>
              <Separator className="bg-white/10" />
              <div>
                <h3 className="px-3 mb-2 text-xs font-semibold text-yellow-500 uppercase tracking-wider">
                  Administration
                </h3>
                <div className="space-y-0.5">
                  <Link
                    href="/admin"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      pathname === '/admin'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                        : 'text-yellow-500/70 hover:text-yellow-400 hover:bg-white/5'
                    )}
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Legal Section */}
          <Separator className="bg-white/10" />
          {legalSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.links.map(renderLink)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Section */}
      {isAuthenticated && user && (
        <div className="p-4 border-t border-white/10">
          <Link
            href="/account"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Avatar className="h-9 w-9 border-2 border-red-500/30">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.displayName || user.username}
              </p>
              <p className="text-xs text-gray-500 truncate">@{user.username}</p>
            </div>
            {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[10px]">
                ★
              </Badge>
            )}
          </Link>
        </div>
      )}

      {!isAuthenticated && (
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
              Create Account
            </Button>
          </Link>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
