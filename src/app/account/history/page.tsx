// RASHID LEAKS - Watch History Page

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoGrid } from '@/components/video';
import { useAuthStore } from '@/lib/store';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import type { Video } from '@/types';

const MOCK_HISTORY: Video[] = [
  {
    id: 'h1', title: 'Recently Watched Video', slug: 'hist-1', creatorId: 'u1', categoryId: 'c1',
    videoUrl: '', thumbnailUrl: null, duration: 1500, viewCount: 100000, likeCount: 5000,
    favoriteCount: 2000, commentCount: 300, moderationStatus: 'APPROVED', visibility: 'PUBLIC',
    isExplicit: true, createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(),
    creator: { id: 'u1', username: 'creator', email: 'c@ex.com', role: 'CREATOR',
      displayName: 'Creator', emailVerified: true, isBanned: false, ageVerified: true,
      createdAt: new Date(), updatedAt: new Date() },
  },
];

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useBackNavigation({ pageKey: 'history' });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <div className="text-center">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to view history</h2>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-red-500 to-pink-600">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your watch history?')) {
      // Clear history
      console.log('History cleared');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-white touch-target min-h-[44px]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-cyan-500" />
                Watch History
              </h1>
              <p className="text-gray-400 mt-1">Videos you've recently watched</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleClearHistory}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 touch-target min-h-[44px]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Videos */}
        <VideoGrid 
          videos={MOCK_HISTORY} 
          columns={4} 
          emptyMessage="No watch history yet. Start watching some videos!"
        />
      </div>
    </div>
  );
}
