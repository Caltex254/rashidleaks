// RASHID LEAKS - Comments API Route

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/comments - Get comments for a video
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Fetch top-level comments with replies
    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where: {
          videoId,
          parentId: null, // Only top-level
          isDeleted: false,
        },
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatar: true },
          },
          replies: {
            where: { isDeleted: false },
            include: {
              user: {
                select: { id: true, username: true, displayName: true, avatar: true },
              },
            },
            orderBy: { createdAt: 'asc' },
            take: 5,
          },
        },
        orderBy: { likeCount: 'desc' },
        skip,
        take: limit,
      }),
      db.comment.count({
        where: { videoId, parentId: null, isDeleted: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, content, parentId } = body;

    if (!videoId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Video ID and content are required' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Comment must be under 1000 characters' },
        { status: 400 }
      );
    }

    // Check if video exists
    const video = await db.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    const userId = 'current-user-id'; // Would get from session

    // If replying, check parent exists
    if (parentId) {
      const parentComment = await db.comment.findUnique({ where: { id: parentId } });
      if (!parentComment || parentComment.isDeleted) {
        return NextResponse.json(
          { success: false, error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Create comment
    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        userId,
        videoId,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    // Update video comment count
    await db.video.update({
      where: { id: videoId },
      data: { commentCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments - Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const userId = 'current-user-id';

    // Soft delete the comment
    const comment = await db.comment.updateMany({
      where: {
        id: commentId,
        userId, // Only allow deleting own comments (or admin)
      },
      data: {
        isDeleted: true,
        content: '[deleted]',
        deletedAt: new Date(),
      },
    });

    if (comment.count === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment not found or no permission' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
