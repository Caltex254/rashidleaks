// RASHID LEAKS - Homepage
// Main landing page with featured videos, trending, categories, and more

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  Users, 
  ChevronRight,
  Play,
  Shield,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoCard } from '@/components/video/VideoCard';
import { VideoGrid } from '@/components/video/VideoGrid';
import { AgeGate } from '@/components/auth/AgeGate';
import { useAgeVerificationStore, useAuthStore } from '@/lib/store';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import type { Video, Category, User as UserType } from '@/types';

// Mock data for development - will be replaced with API calls
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Premium Content Collection Vol. 1',
    slug: 'premium-content-1',
    creatorId: 'user1',
    categoryId: 'cat1',
    videoUrl: '/videos/sample1.mp4',
    thumbnailUrl: null,
    duration: 1245,
    viewCount: 125000,
    likeCount: 8900,
    favoriteCount: 3200,
    commentCount: 456,
    moderationStatus: 'APPROVED',
    visibility: 'PUBLIC',
    isExplicit: true,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
    creator: {
      id: 'user1',
      username: 'creator_one',
      email: 'creator1@example.com',
      role: 'CREATOR',
      displayName: 'Creator One',
      avatar: null,
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: '2',
    title: 'Exclusive Behind The Scenes Footage',
    slug: 'exclusive-bts',
    creatorId: 'user2',
    categoryId: 'cat2',
    videoUrl: '/videos/sample2.mp4',
    thumbnailUrl: null,
    duration: 2340,
    viewCount: 89000,
    likeCount: 6700,
    favoriteCount: 2100,
    commentCount: 234,
    moderationStatus: 'APPROVED',
    visibility: 'PUBLIC',
    isExplicit: true,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(),
    creator: {
      id: 'user2',
      username: 'star_creator',
      email: 'star@example.com',
      role: 'CREATOR',
      displayName: 'Star Creator',
      avatar: null,
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: '3',
    title: 'Hot New Release - Full HD Quality',
    slug: 'hot-new-release',
    creatorId: 'user3',
    categoryId: 'cat3',
    videoUrl: '/videos/sample3.mp4',
    thumbnailUrl: null,
    duration: 1890,
    viewCount: 234000,
    likeCount: 15600,
    favoriteCount: 5400,
    commentCount: 789,
    moderationStatus: 'APPROVED',
    visibility: 'PUBLIC',
    isExplicit: true,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(),
    creator: {
      id: 'user3',
      username: 'hot_studio',
      email: 'studio@example.com',
      role: 'CREATOR',
      displayName: 'Hot Studio',
      avatar: null,
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: '4',
    title: 'Trending Now - Most Watched This Week',
    slug: 'trending-now',
    creatorId: 'user4',
    categoryId: 'cat1',
    videoUrl: '/videos/sample4.mp4',
    thumbnailUrl: null,
    duration: 1567,
    viewCount: 456000,
    likeCount: 23400,
    favoriteCount: 12000,
    commentCount: 1234,
    moderationStatus: 'APPROVED',
    visibility: 'PUBLIC',
    isExplicit: true,
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(),
    creator: {
      id: 'user4',
      username: 'viral_queen',
      email: 'viral@example.com',
      role: 'CREATOR',
      displayName: 'Viral Queen',
      avatar: null,
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: '5',
    title: 'Fan Favorite Collection 2024',
    slug: 'fan-favorite-2024',
    creatorId: 'user5',
    categoryId: 'cat4',
    videoUrl: '/videos/sample5.mp4',
    thumbnailUrl: null,
    duration: 3210,
    viewCount: 178000,
    likeCount: 11200,
    favoriteCount: 6700,
    commentCount: 567,
    moderationStatus: 'APPROVED',
    visibility: 'PUBLIC',
    isExplicit: true,
    createdAt: new Date(Date.now() - 432000000),
    updatedAt: new Date(),
    creator: {
      id: 'user5',
      username: 'fan_favorite',
      email: 'fan@example.com',
      role: 'CREATOR',
      displayName: 'Fan Favorite',
      avatar: null,
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: '6',
    title: 'Exclusive Premium Content - Members Only',
    slug: 'exclusive-premium',
    creatorId: 'user1',
    categoryId: 'cat2',
    videoUrl: '/videos/sample6.mp4',
    thumbnailUrl: null,
    duration: 2789,
    viewCount: 98000,
    likeCount: 7800,
    favoriteCount: 3400,
    commentCount: 345,
    moderationStatus: 'APPROVED',
    visibility: 'PUBLIC',
    isExplicit: true,
    createdAt: new Date(Date.now() - 604800000),
    updatedAt: new Date(),
    creator: {
      id: 'user1',
      username: 'creator_one',
      email: 'creator1@example.com',
      role: 'CREATOR',
      displayName: 'Creator One',
      avatar: null,
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Amateur', slug: 'amateur', description: 'User-uploaded content', icon: '🎥', isFeatured: true, sortOrder: 1, isActive: true, _count: { videos: 1234 } },
  { id: 'cat2', name: 'Professional', slug: 'professional', description: 'Studio quality content', icon: '🎬', isFeatured: true, sortOrder: 2, isActive: true, _count: { videos: 856 } },
  { id: 'cat3', name: 'Solo', slug: 'solo', description: 'Solo performances', icon: '✨', isFeatured: true, sortOrder: 3, isActive: true, _count: { videos: 2341 } },
  { id: 'cat4', name: 'Couple', slug: 'couple', description: 'Couple content', icon: '💑', isFeatured: true, sortOrder: 4, isActive: true, _count: { videos: 987 } },
  { id: 'cat5', name: 'POV', slug: 'pov', description: 'Point of view content', icon: '📹', isFeatured: false, sortOrder: 5, isActive: true, _count: { videos: 654 } },
  { id: 'cat6', name: 'Roleplay', slug: 'roleplay', description: 'Fantasy scenarios', icon: '🎭', isFeatured: true, sortOrder: 6, isActive: true, _count: { videos: 432 } },
  { id: 'cat7', name: 'Vintage', slug: 'vintage', description: 'Classic content', icon: '📼', isFeatured: false, sortOrder: 7, isActive: true, _count: { videos: 321 } },
  { id: 'cat8', name: 'HD/4K', slug: 'hd-4k', description: 'High definition content', icon: '📺', isFeatured: true, sortOrder: 8, isActive: true, _count: { videos: 1543 } },
];

const MOCK_CREATORS: UserType[] = [
  { id: 'u1', username: 'creator_one', email: 'c1@ex.com', role: 'CREATOR', displayName: 'Creator One', emailVerified: true, isBanned: false, ageVerified: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 'u2', username: 'star_creator', email: 'c2@ex.com', role: 'CREATOR', displayName: 'Star Creator', emailVerified: true, isBanned: false, ageVerified: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 'u3', username: 'hot_studio', email: 'c3@ex.com', role: 'CREATOR', displayName: 'Hot Studio', emailVerified: true, isBanned: false, ageVerified: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 'u4', username: 'viral_queen', email: 'c4@ex.com', role: 'CREATOR', displayName: 'Viral Queen', emailVerified: true, isBanned: false, ageVerified: true, createdAt: new Date(), updatedAt: new Date() },
];

export default function HomePage() {
  const router = useRouter();
  const { isVerified } = useAgeVerificationStore();
  const { isAuthenticated } = useAuthStore();
  
  // Android Back navigation
  useBackNavigation({ pageKey: 'home' });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Featured videos (first 3)
  const featuredVideos = MOCK_VIDEOS.slice(0, 3);
  
  // Trending videos (sorted by views)
  const trendingVideos = [...MOCK_VIDEOS].sort((a, b) => b.viewCount - a.viewCount);
  
  // Recent uploads
  const recentVideos = [...MOCK_VIDEOS].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Age Gate Overlay */}
      {!isVerified && <AgeGate onVerified={() => {}} />}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-[#0f0f0f] to-pink-900/20" />
        
        <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/30 animate-pulse">
                <span className="text-white font-bold text-2xl sm:text-3xl">RL</span>
              </div>
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                RASHID LEAKS
              </span>
            </h1>
            
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-6">
              The premier adult video-sharing platform. Discover premium content from verified creators worldwide.
            </p>

            {/* 18+ Badge */}
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 px-4 py-1.5 text-sm mb-6">
              🔞 18+ Adult Content Only
            </Badge>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                size="lg"
                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-8 py-3 text-base font-semibold min-h-[48px]"
              >
                <Play className="w-5 h-5 mr-2" fill="white" />
                Start Watching
              </Button>
              
              {!isAuthenticated && (
                <Link href="/register">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-base font-semibold min-h-[48px]"
                  >
                    Create Free Account
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-10">
            <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xl sm:text-2xl font-bold text-white">50K+</p>
              <p className="text-xs text-gray-500">Videos</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xl sm:text-2xl font-bold text-white">10K+</p>
              <p className="text-xs text-gray-500">Creators</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xl sm:text-2xl font-bold text-white">1M+</p>
              <p className="text-xs text-gray-500">Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section id="featured" className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Featured Videos</h2>
            </div>
            <Link 
              href="/trending" 
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors touch-target min-h-[44px]"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured Video Grid - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
            <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 w-max sm:w-full">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-[300px] sm:w-auto">
                    <Skeleton className="aspect-video rounded-lg bg-white/10" />
                    <Skeleton className="h-4 w-3/4 mt-3 bg-white/10" />
                    <Skeleton className="h-4 w-1/2 mt-2 bg-white/10" />
                  </div>
                ))
              ) : (
                featuredVideos.map((video) => (
                  <div key={video.id} className="w-[300px] sm:w-auto">
                    <VideoCard video={video} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Categories</h2>
            </div>
            <Link 
              href="/categories" 
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors touch-target min-h-[44px]"
            >
              All Categories
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {MOCK_CATEGORIES.filter(c => c.isFeatured).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-4 sm:p-6 transition-all hover:border-red-500/30 hover:bg-white/[0.08] touch-target min-h-[100px]"
              >
                {/* Icon */}
                <span className="text-3xl sm:text-4xl block mb-2">{category.icon}</span>
                
                {/* Name */}
                <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors">
                  {category.name}
                </h3>
                
                {/* Count */}
                <p className="text-xs text-gray-500 mt-1">
                  {category._count?.videos?.toLocaleString()} videos
                </p>

                {/* Hover Arrow */}
                <ChevronRight className="absolute top-4 right-4 w-4 h-4 text-gray-600 group-hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Videos Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Trending Now</h2>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs hidden sm:inline-flex">
                🔥 Hot
              </Badge>
            </div>
            <Link 
              href="/search?sort=popular" 
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors touch-target min-h-[44px]"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Video Grid */}
          <VideoGrid 
            videos={trendingVideos} 
            columns={4}
            isLoading={isLoading}
            showCreator={true}
          />
        </div>
      </section>

      {/* Popular Creators Section */}
      <section className="py-8 sm:py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Popular Creators</h2>
            </div>
            <Link 
              href="/creators" 
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors touch-target min-h-[44px]"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Creators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {MOCK_CREATORS.map((creator) => (
              <Link
                key={creator.id}
                href={`/creator/${creator.username}`}
                className="group flex flex-col items-center p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.08] transition-all touch-target"
              >
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-3 ring-2 ring-transparent group-hover:ring-purple-500/50 transition-all">
                  <span className="text-white font-bold text-lg sm:text-xl">
                    {(creator.displayName || creator.username).slice(0, 2).toUpperCase()}
                  </span>
                </div>
                
                {/* Name */}
                <h3 className="font-semibold text-white text-center group-hover:text-purple-400 transition-colors truncate w-full">
                  {creator.displayName || creator.username}
                </h3>
                
                {/* Username */}
                <p className="text-xs text-gray-500 text-center">@{creator.username}</p>
                
                {/* Verified Badge */}
                <Badge variant="secondary" className="mt-2 bg-blue-500/20 text-blue-400 text-[10px]">
                  ✓ Verified
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Uploaded Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Recently Uploaded</h2>
            </div>
            <Link 
              href="/search?sort=newest" 
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors touch-target min-h-[44px]"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Video Grid */}
          <VideoGrid 
            videos={recentVideos} 
            columns={4}
            isLoading={isLoading}
            showCreator={true}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#0f0f0f] to-[#1a0a0a]">
        <div className="container mx-auto px-4 text-center">
          <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Share Your Content?
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Join thousands of creators earning money on RASHID LEAKS. Upload your content and start building your audience today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/upload">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-8 py-3 text-base font-semibold min-h-[48px]"
              >
                Start Uploading
              </Button>
            </Link>
            
            <Link href="/legal/guidelines">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-base font-semibold min-h-[48px]"
              >
                View Guidelines
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
