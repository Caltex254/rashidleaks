// RASHID LEAKS - Favorites API Route

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/favorites - Add to favorites
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

    const userId = 'current-user-id'; // Would get from session

    // Check if video exists
    const video = await db.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await db.favorite.findUnique({
      where: {
        videoId_userId: {
          videoId,
          userId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'Already in favorites' },
        { status: 409 }
      );
    }

    // Create favorite
    await db.favorite.create({
      data: { videoId, userId },
    });

    // Update favorite count
    await db.video.update({
      where: { id: videoId },
      data: { favoriteCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, favorited: true });
  } catch (error) {
    console.error('Favorite error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Remove from favorites
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

    const userId = 'current-user-id';

    // Delete favorite
    await db.favorite.delete({
      where: {
        videoId_userId: { videoId, userId },
      },
    }).catch(() => {});

    // Update count
    await db.video.update({
      where: { id: videoId },
      data: { favoriteCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true, favorited: false });
  } catch (error) {
    console.error('Unfavorite error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}

// GET /api/favorites - Get user's favorites
export async function GET() {
  try {
    const userId = 'current-user-id';

    const favorites = await db.favorite.findMany({
      where: { userId },
      include: {
        video: {
          include: {
            creator: {
              select: { id: true, username: true, displayName: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: favorites.map(f => f.video),
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}
