// RASHID LEAKS - Video Actions Component
// Like, Favorite, Share, Report buttons

'use client';

import React, { useState } from 'react';
import { Heart, Share2, Flag, Download, MoreHorizontal, Check, Link as LinkIcon, Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Video, User } from '@/types';

interface VideoActionsProps {
  video: Video;
  currentUser?: User | null;
  /** Initial like state */
  isLiked?: boolean;
  /** Initial favorite state */
  isFavorited?: boolean;
  /** Callback when like toggled */
  onLikeToggle?: () => void;
  /** Callback when favorite toggled */
  onFavoriteToggle?: () => void;
  /** Callback when reported */
  onReport?: (reason: string) => void;
}

const REPORT_REASONS = [
  { value: 'NON_CONSENSUAL', label: 'Non-consensual intimate content' },
  { value: 'COPYRIGHT', label: 'Copyright infringement' },
  { value: 'PRIVACY_VIOLATION', label: 'Privacy violation' },
  { value: 'ILLEGAL_CONTENT', label: 'Illegal content' },
  { value: 'AGE_CONCERN', label: 'Age/consent concern' },
  { value: 'VIOLENCE', label: 'Violent content' },
  { value: 'SPAM', label: 'Spam or misleading' },
  { value: 'OTHER', label: 'Other reason' },
];

export function VideoActions({
  video,
  currentUser,
  isLiked = false,
  isFavorited = false,
  onLikeToggle,
  onFavoriteToggle,
  onReport,
}: VideoActionsProps) {
  const [liked, setLiked] = useState(isLiked);
  const [favorited, setFavorited] = useState(isFavorited);
  const [likeCount, setLikeCount] = useState(video.likeCount);
  const [favoriteCount, setFavoriteCount] = useState(video.favoriteCount);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  // Format counts
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  // Handle like toggle
  const handleLike = async () => {
    if (!currentUser) return; // Would trigger login prompt
    
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    
    try {
      // Call API
      await fetch('/api/likes', {
        method: newLiked ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id }),
      });
      
      onLikeToggle?.();
    } catch (error) {
      // Revert on error
      setLiked(!newLiked);
      setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
    }
  };

  // Handle favorite toggle
  const handleFavorite = async () => {
    if (!currentUser) return;
    
    const newFavorited = !favorited;
    setFavorited(newFavorited);
    setFavoriteCount(prev => newFavorited ? prev + 1 : prev - 1);
    
    try {
      await fetch('/api/favorites', {
        method: newFavorited ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id }),
      });
      
      onFavoriteToggle?.();
    } catch (error) {
      setFavorited(!newFavorited);
      setFavoriteCount(prev => newFavorited ? prev - 1 : prev + 1);
    }
  };

  // Handle share/copy link
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/video/${video.id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Handle report
  const handleReportSubmit = async (reason: string) => {
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id, reason }),
      });
      
      setShowReportDialog(false);
      onReport?.(reason);
    } catch (error) {
      console.error('Failed to submit report:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Like Button */}
        <Button
          variant={liked ? "default" : "outline"}
          size="sm"
          onClick={handleLike}
          className={cn(
            "gap-2 touch-target min-h-[44px]",
            liked 
              ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
              : "border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
          )}
          disabled={!currentUser}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          <span>{formatCount(likeCount)}</span>
        </Button>

        {/* Favorite Button */}
        <Button
          variant={favorited ? "default" : "outline"}
          size="sm"
          onClick={handleFavorite}
          className={cn(
            "gap-2 touch-target min-h-[44px]",
            favorited 
              ? "bg-pink-500 hover:bg-pink-600 text-white border-pink-500" 
              : "border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
          )}
          disabled={!currentUser}
        >
          {favorited ? (
            <Check className="h-4 w-4" />
          ) : (
            <Heart className="h-4 w-4" />
          )}
          <span>{formatCount(favoriteCount)} Saved</span>
        </Button>

        {/* Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className={cn(
            "gap-2 touch-target min-h-[44px] border-white/20 text-gray-300 hover:text-white hover:bg-white/10",
            copiedLink && "border-green-500 text-green-400"
          )}
        >
          {copiedLink ? (
            <>
              <CheckCheck className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Share
            </>
          )}
        </Button>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/10 touch-target"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 w-56">
            <DropdownMenuItem 
              onClick={handleCopyLink}
              className="cursor-pointer"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy link
            </DropdownMenuItem>
            
            {/* PiP option if supported */}
            <DropdownMenuItem className="cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              Download (coming soon)
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuItem 
              onClick={() => setShowReportDialog(true)}
              className="text-red-400 focus:text-red-300 cursor-pointer"
            >
              <Flag className="h-4 w-4 mr-2" />
              Report video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Creator Info Card */}
      {video.creator && (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <Avatar className="w-12 h-12 border border-white/10">
            <AvatarImage src={video.creator.avatar} alt={video.creator.username} />
            <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-600 text-white">
              {video.creator.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">
              {video.creator.displayName || video.creator.username}
            </p>
            <p className="text-sm text-gray-400">@{video.creator.username}</p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 border-white/20 text-white hover:bg-white/10 touch-target"
          >
            Follow
          </Button>
        </div>
      )}

      {/* Stats Row */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="text-white font-medium">{formatCount(video.viewCount)}</span> views
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-white font-medium">{formatCount(video.likeCount)}</span> likes
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-white font-medium">{formatCount(video.favoriteCount)}</span> favorites
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-white font-medium">{video.commentCount || 0}</span> comments
        </span>
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Report Video</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please select a reason for reporting this content. Our team will review it promptly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 mt-4">
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason.value}
                onClick={() => handleReportSubmit(reason.value)}
                className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-sm"
              >
                {reason.label}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VideoActions;
