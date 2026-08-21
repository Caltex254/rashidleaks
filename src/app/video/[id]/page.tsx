// RASHID LEAKS - Video Player Page
// Full video viewing experience with comments, related videos, and Android Back support

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Share2, 
  Flag, 
  Heart,
  MessageCircle,
  Eye,
  ThumbsUp,
  Clock,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { VideoCard } from '@/components/video/VideoCard';
import { VideoActions } from '@/components/video/VideoActions';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import { useAuthStore } from '@/lib/store';
import type { Video, Comment as CommentType } from '@/types';

// Mock video data (will be fetched from API)
const MOCK_VIDEO: Video = {
  id: '1',
  title: 'Premium Content Collection Vol. 1 - Full HD Quality',
  description: 'This is an exclusive premium content collection featuring high-quality production values. Watch as our featured creator delivers an unforgettable performance. This video showcases professional lighting, camera work, and editing that sets a new standard for adult entertainment.\n\nFeatures:\n• 4K Ultra HD quality\n• Professional audio\n• Multiple camera angles\n• Behind-the-scenes bonus footage\n\nDuration: 20+ minutes of premium content.',
  slug: 'premium-content-1',
  creatorId: 'user1',
  categoryId: 'cat1',
  category: {
    id: 'cat1',
    name: 'Amateur',
    slug: 'amateur',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
  },
  tags: [
    { id: 't1', name: 'premium', slug: 'premium' },
    { id: 't2', name: 'hd', slug: 'hd' },
    { id: 't3', name: 'exclusive', slug: 'exclusive' },
  ],
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  thumbnailUrl: null,
  duration: 1245,
  width: 1920,
  height: 1080,
  viewCount: 125000,
  likeCount: 8900,
  favoriteCount: 3200,
  commentCount: 456,
  moderationStatus: 'APPROVED',
  visibility: 'PUBLIC',
  publishedAt: new Date(Date.now() - 86400000),
  contentWarnings: JSON.stringify(['explicit']),
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
    bio: 'Premium content creator. New videos every week!',
    emailVerified: true,
    isBanned: false,
    ageVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// Mock related videos
const MOCK_RELATED_VIDEOS: Video[] = [
  {
    id: '2',
    title: 'Similar Content You Might Like',
    slug: 'similar-1',
    creatorId: 'user2',
    categoryId: 'cat1',
    videoUrl: '',
    thumbnailUrl: null,
    duration: 1800,
    viewCount: 98000,
    likeCount: 6500,
    favoriteCount: 2800,
    commentCount: 234,
    moderationStatus: 'APPROVED',
    visibility: 'PUBLIC',
    isExplicit: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    creator: {
      id: 'user2',
      username: 'creator_two',
      email: 'c2@ex.com',
      role: 'CREATOR',
      displayName: 'Creator Two',
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: '3',
    title: 'More From This Category',
    slug: 'category-1',
    creatorId: 'user3',
    categoryId: 'cat1',
    videoUrl: '',
    thumbnailUrl: null,
    duration: 2100,
    viewCount: 76000,
    likeCount: 5200,
    favoriteCount: 1900,
    commentCount: 178,
    moderationStatus: 'APPROVED',
    visibility: 'PUBLIC',
    isExplicit: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    creator: {
      id: 'user3',
      username: 'creator_three',
      email: 'c3@ex.com',
      role: 'CREATOR',
      displayName: 'Creator Three',
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

// Mock comments
const MOCK_COMMENTS: CommentType[] = [
  {
    id: 'c1',
    content: 'Amazing quality! One of the best I\'ve seen on this platform.',
    userId: 'u1',
    user: {
      id: 'u1',
      username: 'fan123',
      email: 'fan@ex.com',
      role: 'USER',
      displayName: 'Super Fan',
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    videoId: '1',
    likeCount: 45,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(),
  },
  {
    id: 'c2',
    content: 'The production value here is incredible. Keep up the great work! 🔥',
    userId: 'u2',
    user: {
      id: 'u2',
      username: 'viewer99',
      email: 'v99@ex.com',
      role: 'USER',
      displayName: 'Viewer 99',
      emailVerified: true,
      isBanned: false,
      ageVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    videoId: '1',
    likeCount: 23,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(),
  },
];

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');

  // CRITICAL: Android Back button handling for fullscreen exit
  const { goBack, closeOverlay, openOverlay } = useBackNavigation({
    pageKey: `video-${params.id}`,
    // Custom handler to close fullscreen before navigating away
    onBack: () => {
      // This will be called when back is pressed
      // Return false to allow default behavior (go back in history)
      return false;
    },
  });

  // Fetch video data
  useEffect(() => {
    // Simulate API call
    const fetchVideo = async () => {
      setIsLoading(true);
      
      // In real app: const response = await fetch(`/api/videos/${params.id}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setVideo(MOCK_VIDEO);
      setComments(MOCK_COMMENTS);
      setIsLoading(false);
    };

    fetchVideo();
  }, [params.id]);

  // Format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !newComment.trim()) {
      // Would show login prompt
      return;
    }

    // Optimistic update
    const tempComment: CommentType = {
      id: `temp-${Date.now()}`,
      content: newComment,
      userId: user?.id || '',
      user: user || undefined,
      videoId: params.id as string,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setComments(prev => [tempComment, ...prev]);
    setNewComment('');

    // In real app: await fetch('/api/comments', { method: 'POST', body: {...} });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <Skeleton className="h-10 w-24 mb-4" />
          
          {/* Video Player */}
          <Skeleton className="w-full aspect-video rounded-lg mb-6" />
          
          {/* Title & Info */}
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-4">Video not found</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={goBack}
          className="mb-4 text-gray-400 hover:text-white touch-target min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnailUrl || undefined}
              title={video.title}
              autoPlay={false}
              onFullscreenChange={(isFullscreen) => {
                if (isFullscreen) {
                  openOverlay('fullscreen', 'video-player');
                }
              }}
            />

            {/* Video Info */}
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {video.title}
              </h1>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatNumber(video.viewCount)} views
                </span>
                <span>•</span>
                <span>{formatNumber(video.likeCount)} likes</span>
                <span>•</span>
                <span>{formatNumber(video.favoriteCount)} favorites</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.floor((video.duration || 0) / 60)} minutes
                </span>
                <span>•</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag) => (
                    <Link key={tag.id} href={`/search?tag=${tag.slug}`}>
                      <Badge 
                        variant="secondary" 
                        className="bg-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-400 cursor-pointer transition-colors"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              <Separator className="bg-white/10" />

              {/* Actions */}
              <VideoActions
                video={video}
                currentUser={user || undefined}
                onLikeToggle={() => {}}
                onFavoriteToggle={() => {}}
                onReport={(reason) => console.log('Reported:', reason)}
              />

              {/* Description */}
              {video.description && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Description</h3>
                  <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                    {video.description}
                  </p>
                </div>
              )}

              <Separator className="bg-white/10" />

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Comments ({comments.length})
                  </h3>
                </div>

                {/* Comment Form */}
                {isAuthenticated ? (
                  <form onSubmit={handleCommentSubmit} className="flex gap-3">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-600 text-xs">
                        {user?.username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-500 focus:border-red-500/50 focus:ring-red-500/20 outline-none"
                    />
                    <Button 
                      type="submit"
                      disabled={!newComment.trim()}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shrink-0"
                    >
                      Post
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-gray-400 text-sm mb-2">
                      Login to join the conversation
                    </p>
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="border-white/20">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-3 bg-white/5 rounded-lg">
                      <Avatar className="w-10 h-10 shrink-0">
                        <AvatarImage src={comment.user?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-xs">
                          {comment.user?.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">
                            {comment.user?.displayName || comment.user?.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-300">{comment.content}</p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            {comment.likeCount}
                          </button>
                          <button className="text-xs text-gray-500 hover:text-white transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <h3 className="font-semibold text-white sticky top-0 bg-[#0f0f0f] py-2 z-10">
                Related Videos
              </h3>
              
              <div className="space-y-3">
                {MOCK_RELATED_VIDEOS.map((relatedVideo) => (
                  <VideoCard
                    key={relatedVideo.id}
                    video={relatedVideo}
                    variant="horizontal"
                    showCreator={false}
                  />
                ))}
                
                {/* More related placeholders */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`placeholder-${i}`} className="animate-pulse">
                    <div className="flex gap-3">
                      <Skeleton className="w-40 aspect-video rounded-lg bg-white/10" />
                      <div className="flex-1 space-y-2 py-1">
                        <Skeleton className="h-4 w-full bg-white/10" />
                        <Skeleton className="h-4 w-3/4 bg-white/10" />
                        <Skeleton className="h-3 w-1/2 bg-white/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
