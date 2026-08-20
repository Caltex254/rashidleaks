// RASHID LEAKS - Creator Profile Page

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User as UserIcon,
  Calendar,
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  VideoGrid,
  Users,
  Heart,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoCard, VideoGrid } from '@/components/video';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import type { CreatorProfile, Video, User } from '@/types';

// Mock creator data
const MOCK_CREATOR: CreatorProfile & { user: User } = {
  id: 'cp1',
  userId: 'u1',
  user: {
    id: 'u1',
    username: 'creator_one',
    email: 'creator@example.com',
    role: 'CREATOR',
    displayName: 'Creator One',
    avatar: null,
    bio: 'Premium content creator specializing in high-quality productions. New videos every week! 💫',
    country: 'United States',
    emailVerified: true,
    isBanned: false,
    ageVerified: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
  },
  bannerImage: null,
  verifiedAt: new Date('2023-02-01'),
  verificationStatus: 'APPROVED',
  followerCount: 15420,
  videoCount: 89,
  totalViews: 2500000,
  totalLikes: 189000,
  consentAdultConfirmed: true,
  consentOwnershipConfirmed: true,
  consentAllParticipantsAdult: true,
  consentRecordingConfirmed: true,
  consentDistributionConfirmed: true,
  consentConfirmedAt: new Date('2023-01-20'),
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date(),
};

// Mock videos by this creator
const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1', title: 'Latest Upload - Premium Content', slug: 'latest', creatorId: 'u1', categoryId: 'c1',
    videoUrl: '', thumbnailUrl: null, duration: 1800, viewCount: 89000, likeCount: 5600,
    favoriteCount: 2300, commentCount: 189, moderationStatus: 'APPROVED', visibility: 'PUBLIC',
    isExplicit: true, createdAt: new Date(), updatedAt: new Date(),
    creator: MOCK_CREATOR.user,
  },
  // More mock videos...
];

export default function CreatorProfilePage() {
  const params = useParams();
  const router = useRouter();
  
  const [creator, setCreator] = useState<typeof MOCK_CREATOR | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useBackNavigation({ pageKey: `creator-${params.username}` });

  useEffect(() => {
    // Simulate API call
    const fetchCreator = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCreator(MOCK_CREATOR);
      setVideos(MOCK_VIDEOS);
      setIsLoading(false);
    };

    fetchCreator();
  }, [params.username]);

  const handleFollow = async () => {
    if (!isFollowing) {
      setIsFollowing(true);
      // API call would go here
    } else {
      setIsFollowing(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-10 w-24 mb-4" />
          <Skeleton className="w-full h-48 rounded-lg mb-6" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-4">Creator not found</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Banner */}
      <div className="relative h-32 sm:h-48 md:h-64 bg-gradient-to-br from-red-900/30 via-pink-900/20 to-purple-900/30 overflow-hidden">
        <div className="absolute inset-0 bg-[#0f0f0f]/50" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 text-white hover:bg-white/10 touch-target min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
          {/* Avatar */}
          <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-[#0f0f0f] rounded-full shadow-xl">
            <AvatarImage src={creator.user.avatar} alt={creator.user.displayName} />
            <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-600 text-2xl font-bold">
              {(creator.user.displayName || creator.user.username).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {creator.user.displayName || creator.user.username}
              </h1>
              
              {creator.verificationStatus === 'APPROVED' && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              
              {creator.user.role === 'ADMIN' && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">★ Admin</Badge>
              )}
            </div>

            <p className="text-gray-400 mt-1">@{creator.user.username}</p>

            {creator.user.bio && (
              <p className="text-gray-300 mt-3 max-w-2xl">{creator.user.bio}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
              {creator.user.country && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {creator.user.country}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {new Date(creator.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleFollow}
              variant={isFollowing ? "outline" : "default"}
              className={`flex-1 sm:flex-none touch-target min-h-[44px] ${
                isFollowing 
                  ? "border-white/20 text-white hover:bg-white/10" 
                  : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="border-white/20 text-white hover:bg-white/10 touch-target min-h-[44px] min-w-[44px]"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <VideoGrid className="w-5 h-5 mx-auto mb-1 text-red-400" />
              <p className="text-xl font-bold text-white">{formatNumber(creator.videoCount)}</p>
              <p className="text-xs text-gray-500">Videos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-xl font-bold text-white">{formatNumber(creator.followerCount)}</p>
              <p className="text-xs text-gray-500">Followers</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-xl font-bold text-white">{formatNumber(creator.totalViews)}</p>
              <p className="text-xs text-gray-500">Total Views</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Heart className="w-5 h-5 mx-auto mb-1 text-pink-400" />
              <p className="text-xl font-bold text-white">{formatNumber(creator.totalLikes)}</p>
              <p className="text-xs text-gray-500">Total Likes</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-white/10 mb-6" />

        {/* Videos Tabs */}
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="bg-white/5 border-white/10 w-full justify-start">
            <TabsTrigger value="videos" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Videos ({creator.videoCount})
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Popular
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-6">
            <VideoGrid videos={videos} columns={4} isLoading={isLoading} showCreator={false} />
          </TabsContent>

          <TabsContent value="popular" className="mt-6">
            <VideoGrid 
              videos={[...videos].sort((a, b) => b.viewCount - a.viewCount)} 
              columns={4} 
              showCreator={false} 
            />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card className="bg-white/5 border-white/10 max-w-2xl">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300">{creator.user.bio || 'No description provided.'}</p>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Username</p>
                    <p className="text-white">@{creator.user.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="text-white">{creator.user.country || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Member Since</p>
                    <p className="text-white">{new Date(creator.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Verification Status</p>
                    <p className="text-green-400 capitalize">{creator.verificationStatus.toLowerCase()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
