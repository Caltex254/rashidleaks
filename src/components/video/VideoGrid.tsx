// RASHID LEAKS - Video Grid Component
// Responsive grid layout for video cards

'use client';

import React from 'react';
import { VideoCard } from './VideoCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Video } from '@/types';

interface VideoGridProps {
  videos: Video[];
  /** Grid columns configuration */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Show loading skeleton */
  isLoading?: boolean;
  /** Number of skeletons to show when loading */
  skeletonCount?: number;
  /** Show creator info on cards */
  showCreator?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Card variant */
  variant?: 'default' | 'compact' | 'horizontal';
  /** Additional CSS classes */
  className?: string;
}

export function VideoGrid({
  videos,
  columns = 3,
  isLoading = false,
  skeletonCount = 12,
  showCreator = true,
  emptyMessage = 'No videos found',
  variant = 'default',
  className,
}: VideoGridProps) {
  // Responsive column classes based on prop and screen size
  const getGridClasses = () => {
    const baseClass = 'grid gap-3 sm:gap-4';
    
    switch (columns) {
      case 1:
        return `${baseClass} grid-cols-1`;
      case 2:
        return `${baseClass} grid-cols-1 sm:grid-cols-2`;
      case 3:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
      case 4:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
      case 5:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`;
      case 6:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`;
      default:
        return `${baseClass} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
    }
  };

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className={getGridClasses()}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <VideoCardSkeleton key={index} variant={variant} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!videos || videos.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className || ''}`}>
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-gray-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
        </div>
        <p className="text-gray-400 text-lg font-medium">{emptyMessage}</p>
        <p className="text-gray-500 text-sm mt-1">Check back later for new content</p>
      </div>
    );
  }

  // Normal state with videos
  return (
    <div className={`${getGridClasses()} ${className || ''}`}>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          showCreator={showCreator}
          variant={variant}
        />
      ))}
    </div>
  );
}

// Skeleton loader for video cards
function VideoCardSkeleton({ variant }: { variant?: 'default' | 'compact' | 'horizontal' }) {
  const isHorizontal = variant === 'horizontal';

  return (
    <div className={`group ${isHorizontal ? 'flex gap-3' : ''}`}>
      {/* Thumbnail Skeleton */}
      <Skeleton 
        className={`rounded-lg bg-white/10 ${
          isHorizontal ? 'w-48 sm:w-64 shrink-0 aspect-video' : 'w-full aspect-video'
        }`} 
      />
      
      {/* Content Skeleton */}
      <div className={`flex gap-3 py-1 ${isHorizontal ? 'flex-1 min-w-0' : ''}`}>
        {!isHorizontal && (
          <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 bg-white/10" />
        )}
        
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-full rounded bg-white/10" />
          <Skeleton className="h-4 w-3/4 rounded bg-white/10" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16 rounded bg-white/10" />
            <Skeleton className="h-3 w-20 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoGrid;
