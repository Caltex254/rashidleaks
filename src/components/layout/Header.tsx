// RASHID LEAKS - Mobile-First Header Component

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  Search, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Upload,
  Home,
  Shield,
  Heart,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useUIStore, useSearchStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { mobileMenuOpen, setMobileMenuOpen, searchOpen, setSearchOpen } = useUIStore();
  const { query, setQuery, recentSearches } = useSearchStore();
  
  const [searchValue, setSearchValue] = useState(query);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue.trim()) {
        setQuery(searchValue.trim());
        if (pathname !== '/search') {
          router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        }
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue, setQuery, pathname, router]);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setQuery(searchValue.trim());
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/categories', label: 'Categories', icon: Shield },
    { href: '/trending', label: 'Trending', icon: Heart },
  ];

  const accountLinks = isAuthenticated ? [
    { href: '/account', label: 'My Account', icon: User },
    { href: '/account/favorites', label: 'Favorites', icon: Heart },
    { href: '/account/history', label: 'History', icon: Clock },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/account/settings', label: 'Settings', icon: Settings },
  ] : [];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled 
          ? 'bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/10 shadow-lg' 
          : 'bg-[#0f0f0f]/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Left Section - Menu + Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[#1a1a1a] border-white/10 p-0">
                <SheetHeader className="p-4 border-b border-white/10">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">RL</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                      RASHID LEAKS
                    </span>
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex flex-col p-4 gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        pathname === link.href
                          ? 'bg-red-500/20 text-red-400'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                  
                  {isAuthenticated && (
                    <>
                      <div className="h-px bg-white/10 my-2" />
                      {accountLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            pathname === link.href
                              ? 'bg-red-500/20 text-red-400'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          )}
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      ))}
                    </>
                  )}
                </nav>

                {!isAuthenticated && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#0f0f0f]">
                    <div className="flex flex-col gap-2">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                          Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/25">
                <span className="text-white font-bold text-xs sm:text-sm">RL</span>
              </div>
              <span className="hidden sm:block text-lg sm:text-xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                RASHID LEAKS
              </span>
            </Link>
          </div>

          {/* Center Section - Search Bar (hidden on small mobile) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search videos..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border-white/10 rounded-full text-white placeholder:text-gray-500 focus:border-red-500/50 focus:ring-red-500/20"
              />
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white"
                  onClick={() => setSearchValue('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </form>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {isAuthenticated ? (
              <>
                {/* Upload Button (desktop) */}
                <Link href="/upload" className="hidden sm:flex">
                  <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 gap-2">
                    <Upload className="h-4 w-4" />
                    <span className="hidden lg:inline">Upload</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border-2 border-red-500/50">
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs">
                          {user?.username?.slice(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {user?.role === 'ADMIN' || user?.role === 'MODERATOR' ? (
                        <Badge className="absolute -bottom-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center bg-yellow-500 text-[10px] text-black">
                          ★
                        </Badge>
                      ) : user?.role === 'CREATOR' ? (
                        <Badge className="absolute -bottom-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center bg-blue-500 text-[10px]">
                          ✓
                        </Badge>
                      ) : null}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1a] border-white/10">
                    <div className="px-2 py-1.5 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{user?.displayName || user?.username}</p>
                      <p className="text-xs text-gray-400">@{user?.username}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    
                    {accountLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer">
                        <Link href={link.href} className="flex items-center gap-2">
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    
                    {(user?.role === 'ADMIN' || user?.role === 'MODERATOR') && (
                      <>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem asChild className="text-yellow-400 focus:text-yellow-300 focus:bg-white/10 cursor-pointer">
                          <Link href="/admin" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hidden sm:flex">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-xs sm:text-sm">
                    <span className="hidden sm:inline">Register</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (expandable) */}
        {searchOpen && (
          <div className="md:hidden pb-3 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search videos..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus
                className="pl-10 pr-10 py-2.5 bg-white/5 border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-red-500/50 focus:ring-red-500/20"
              />
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white"
                  onClick={() => setSearchValue('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              
              {/* Recent Searches */}
              {!searchValue && recentSearches.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  {recentSearches.slice(0, 5).map((term, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSearchValue(term);
                        setQuery(term);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
                    >
                      <Clock className="h-3 w-3 text-gray-500" />
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}

        {/* 18+ Warning Badge */}
        <div className="hidden lg:flex items-center justify-center pb-1">
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 text-[10px] px-2 py-0">
            🔞 18+ Adult Content
          </Badge>
        </div>
      </div>
    </header>
  );
}

export default Header;
