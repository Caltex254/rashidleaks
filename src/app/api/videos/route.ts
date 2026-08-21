// RASHID LEAKS - Videos API Route

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/videos - List videos with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'newest';
    const creator = searchParams.get('creator');
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: Record<string, unknown> = {
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
    };
    
    if (category) where.categoryId = category;
    if (creator) where.creatorId = creator;

    // Build order by
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (sort) {
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
      case 'likes':
        orderBy = { likeCount: 'desc' };
        break;
      case 'views':
        orderBy = { viewCount: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Fetch videos with relations
    const [videos, total] = await Promise.all([
      db.video.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.video.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Videos GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST /api/videos - Create a new video (requires auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, categoryId, videoUrl, thumbnailUrl, duration, tags, visibility } = body;

    if (!title || !categoryId || !videoUrl) {
      return NextResponse.json(
        { success: false, error: 'Title, categoryId, and videoUrl are required' },
        { status: 400 }
      );
    }

    // In real app: verify user is authenticated and has permission to upload
    
    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now();

    const video = await db.video.create({
      data: {
        title,
        description,
        slug,
        categoryId,
        videoUrl,
        thumbnailUrl,
        duration,
        visibility: visibility || 'PUBLIC',
        moderationStatus: 'PENDING',
        creatorId: 'current-user-id', // Would get from session
        // Tags would be handled separately
      },
    });

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error) {
    console.error('Videos POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create video' },
      { status: 500 }
    );
  }
}
