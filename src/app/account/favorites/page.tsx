// RASHID LEAKS - Favorites Page

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoGrid } from '@/components/video';
import { useAuthStore } from '@/lib/store';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import type { Video } from '@/types';

// Mock favorites data
const MOCK_FAVORITES: Video[] = [
  {
    id: 'f1', title: 'Favorite Video 1', slug: 'fav-1', creatorId: 'u1', categoryId: 'c1',
    videoUrl: '', thumbnailUrl: null, duration: 1200, viewCount: 50000, likeCount: 3000,
    favoriteCount: 1500, commentCount: 100, moderationStatus: 'APPROVED', visibility: 'PUBLIC',
    isExplicit: true, createdAt: new Date(), updatedAt: new Date(),
    creator: { id: 'u1', username: 'creator', email: 'c@ex.com', role: 'CREATOR',
      displayName: 'Creator', emailVerified: true, isBanned: false, ageVerified: true,
      createdAt: new Date(), updatedAt: new Date() },
  },
];

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useBackNavigation({ pageKey: 'favorites' });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to view favorites</h2>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-red-500 to-pink-600">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-white touch-target min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              My Favorites
            </h1>
            <p className="text-gray-400 mt-1">Videos you've saved for later</p>
          </div>
        </div>

        {/* Videos */}
        <VideoGrid 
          videos={MOCK_FAVORITES} 
          columns={4} 
          emptyMessage="No favorites yet. Start adding videos to your favorites!"
        />
      </div>
    </div>
  );
}
