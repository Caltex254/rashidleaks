// RASHID LEAKS - Likes API Route

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/likes - Like a video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // In real app: get userId from session
    const userId = 'current-user-id'; // Placeholder

    // Check if video exists
    const video = await db.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if already liked
    const existingLike = await db.like.findUnique({
      where: {
        videoId_userId: {
          videoId,
          userId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { success: false, error: 'Already liked' },
        { status: 409 }
      );
    }

    // Create like
    await db.like.create({
      data: {
        videoId,
        userId,
      },
    });

    // Update video like count
    await db.video.update({
      where: { id: videoId },
      data: { likeCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, liked: true });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to like video' },
      { status: 500 }
    );
  }
}

// DELETE /api/likes - Unlike a video
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const userId = 'current-user-id'; // Placeholder

    // Delete like
    await db.like.delete({
      where: {
        videoId_userId: {
          videoId,
          userId,
        },
      },
    }).catch(() => {
      // Ignore if doesn't exist
    });

    // Update video like count
    await db.video.update({
      where: { id: videoId },
      data: { likeCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true, liked: false });
  } catch (error) {
    console.error('Unlike error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unlike video' },
      { status: 500 }
    );
  }
}
