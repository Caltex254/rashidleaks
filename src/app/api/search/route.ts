// RASHID LEAKS - Search API Route

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const creator = searchParams.get('creator');
    const sort = searchParams.get('sort') || 'relevance';
    const duration = searchParams.get('duration');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    if (!query && !category && !tag) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        page,
        totalPages: 0,
      });
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
    };

    if (query) {
      // Search in title and description
      Object.assign(where, {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
        ],
      });
    }

    if (category) {
      where.categoryId = category;
    }

    if (creator) {
      where.creatorId = creator;
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { slug: tag },
        },
      };
    }

    // Duration filter
    if (duration && duration !== 'all') {
      let minDuration = 0;
      let maxDuration = Infinity;
      
      switch (duration) {
        case 'short':
          maxDuration = 600; // < 10 minutes
          break;
        case 'medium':
          minDuration = 600;
          maxDuration = 1800; // 10-30 minutes
          break;
        case 'long':
          minDuration = 1800; // > 30 minutes
          break;
      }
      
      where.duration = {};
      if (minDuration > 0) (where.duration as Record<string, number>).gte = minDuration;
      if (maxDuration < Infinity) (where.duration as Record<string, number>).lte = maxDuration;
    }

    // Build order by
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
      case 'views':
        orderBy = { viewCount: 'desc' };
        break;
      case 'likes':
        orderBy = { likeCount: 'desc' };
        break;
      case 'duration':
        orderBy = { duration: 'desc' };
        break;
      default:
        // For relevance, we could use full-text search ranking
        orderBy = { viewCount: 'desc' };
    }

    // Execute query
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
            select: { id: true, name: true, slug: true },
          },
          tags: {
            include: { tag: true },
            take: 5,
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
      query,
      filters: { category, tag, creator, sort, duration },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
