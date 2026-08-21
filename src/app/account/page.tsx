// RASHID LEAKS - Account Dashboard Page

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Heart, 
  Clock, 
  Settings, 
  Upload,
  Shield,
  LogOut,
  ChevronRight,
  Eye,
  ThumbsUp,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/store';
import { useBackNavigation } from '@/hooks/useBackNavigation';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useBackNavigation({ pageKey: 'account' });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a] border-white/10 text-center">
          <CardContent className="pt-8 pb-8">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Not Signed In</h2>
            <p className="text-gray-400 mb-6">Sign in to access your account</p>
            <div className="space-y-3">
              <Link href="/login" className="block">
                <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600">Sign In</Button>
              </Link>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full border-white/20">Create Account</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    {
      title: 'Favorites',
      description: 'Your saved videos',
      icon: Heart,
      href: '/account/favorites',
      color: 'text-pink-400',
    },
    {
      title: 'Watch History',
      description: 'Videos you\'ve watched',
      icon: Clock,
      href: '/account/history',
      color: 'text-blue-400',
    },
    {
      title: 'Upload Video',
      description: 'Share new content',
      icon: Upload,
      href: '/upload',
      color: 'text-green-400',
    },
    {
      title: 'Settings',
      description: 'Account preferences',
      icon: Settings,
      href: '/account/settings',
      color: 'text-gray-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>

        {/* Profile Card */}
        <Card className="bg-[#1a1a1a] border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="w-24 h-24 border-2 border-red-500/30">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-600 text-2xl font-bold">
                  {(user.displayName || user.username).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-white">
                    {user.displayName || user.username}
                  </h2>
                  <Badge 
                    className={`${
                      user.role === 'ADMIN' ? 'bg-yellow-500/20 text-yellow-400' :
                      user.role === 'MODERATOR' ? 'bg-purple-500/20 text-purple-400' :
                      user.role === 'CREATOR' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {user.role}
                  </Badge>
                </div>
                
                <p className="text-gray-400 mt-1">@{user.username}</p>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>

                {user.role === 'CREATOR' && (
                  <Link href={`/creator/${user.username}`}>
                    <Button variant="outline" size="sm" className="mt-3 border-red-500/30 text-red-400 hover:bg-red-500/10">
                      View Public Profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500">Profile Views</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Heart className="w-5 h-5 mx-auto mb-1 text-pink-400" />
              <p className="text-xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500">Favorites</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <ThumbsUp className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500">Likes Given</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-xl font-bold text-white">{user.emailVerified ? 'Yes' : 'No'}</p>
              <p className="text-xs text-gray-500">Verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="bg-[#1a1a1a] border-white/10 hover:border-white/20 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white group-hover:text-red-400 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{item.description}</p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Danger Zone */}
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            
            <Link href="/account/settings#delete-account">
              <Button
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 justify-start"
              >
                Delete Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
