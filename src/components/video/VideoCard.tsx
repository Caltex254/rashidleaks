// RASHID LEAKS - Video Card Component
// Mobile-first, touch-friendly video card with thumbnail and metadata

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Eye, Heart, Clock, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Video as VideoType } from '@/types';

interface VideoCardProps {
  video: VideoType;
  /** Show creator info below the thumbnail */
  showCreator?: boolean;
  /** Card layout variant */
  variant?: 'default' | 'compact' | 'horizontal';
  /** Additional CSS classes */
  className?: string;
  /** Custom click handler (overrides default navigation) */
  onClick?: (video: VideoType) => void;
}

export function VideoCard({ 
  video, 
  showCreator = true, 
  variant = 'default',
  className,
  onClick 
}: VideoCardProps) {
  const router = useRouter();

  // Format duration to MM:SS or H:MM:SS
  const formatDuration = (seconds?: number | null): string => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Format view count
  const formatViews = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Format date to relative time
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleClick = () => {
    if (onClick) {
      onClick(video);
    } else {
      router.push(`/video/${video.id}`);
    }
  };

  const isHorizontal = variant === 'horizontal';

  return (
    <Card 
      className={cn(
        "group bg-transparent border-0 shadow-none overflow-hidden video-card-hover cursor-pointer",
        isHorizontal ? "flex gap-3" : "",
        className
      )}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div className={cn(
        "relative overflow-hidden rounded-lg bg-[#1a1a1a]",
        isHorizontal ? "w-48 sm:w-64 shrink-0 aspect-video" : "w-full aspect-video"
      )}>
        {/* Thumbnail Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-pink-900/30">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            /* Placeholder gradient when no thumbnail */
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-12 h-12 text-white/20" />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="thumbnail-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Duration Badge */}
        {video.duration && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 font-medium z-10"
          >
            {formatDuration(video.duration)}
          </Badge>
        )}

        {/* HD Badge */}
        {(video.width && video.width >= 1920) && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 font-bold z-10"
          >
            HD
          </Badge>
        )}

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="w-14 h-14 rounded-full bg-red-500/90 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-6 h-6 text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Progress Bar (for watch history - optional) */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full bg-red-500 w-1/3" />
        </div> */}
      </div>

      {/* Content Section */}
      <div className={cn(
        "flex gap-3 py-1",
        isHorizontal ? "flex-1 min-w-0" : ""
      )}>
        {/* Creator Avatar */}
        {showCreator && video.creator && (
          <Link 
            href={`/creator/${video.creator.username}`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "shrink-0",
              isHorizontal ? "hidden" : ""
            )}
          >
            <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border border-white/10">
              <AvatarImage src={video.creator.avatar} alt={video.creator.username} />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs">
                {video.creator.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={cn(
            "font-semibold text-white line-clamp-2 group-hover:text-red-400 transition-colors",
            isHorizontal ? "text-sm sm:text-base" : "text-sm sm:text-base"
          )}>
            {video.title}
          </h3>

          {/* Creator Name & Metadata */}
          {showCreator && video.creator && (
            <div className={cn(
              "flex items-center gap-1 mt-1",
              isHorizontal ? "text-xs" : "text-sm"
            )}>
              <Link 
                href={`/creator/${video.creator.username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 hover:text-white transition-colors truncate"
              >
                {video.creator.displayName || video.creator.username}
              </Link>
              
              {video.creator.role === 'VERIFIED' && (
                <span className="text-blue-400 shrink-0">✓</span>
              )}
            </div>
          )}

          {/* Stats Row */}
          <div className={cn(
            "flex items-center gap-2 mt-1 text-gray-500",
            isHorizontal ? "text-xs" : "text-xs"
          )}>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViews(video.viewCount)}
            </span>
            
            <span>•</span>
            
            <span>{formatTimeAgo(video.createdAt)}</span>
            
            {video.likeCount > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {formatViews(video.likeCount)}
                </span>
              </>
            )}
          </div>

          {/* Tags (optional, shown on hover for desktop) */}
          {video.tags && video.tags.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {video.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/search?tag=${tag.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] text-gray-500 hover:text-red-400 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* More Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button 
              className="shrink-0 p-1 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 w-48">
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
              className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch now
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer"
            >
              <Clock className="w-4 h-4 mr-2" />
              Save to watch later
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer"
            >
              <Heart className="w-4 h-4 mr-2" />
              Add to favorites
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-gray-300 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
            >
              Report this video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

export default VideoCard;
