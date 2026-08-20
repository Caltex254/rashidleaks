// RASHID LEAKS - Reports API Route

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

// POST /api/reports - Submit a report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, reason, description, evidence } = body;

    if (!videoId || !reason) {
      return NextResponse.json(
        { success: false, error: 'Video ID and reason are required' },
        { status: 400 }
      );
    }

    // Validate report reason
    const validReasons = [
      'NON_CONSENSUAL', 'COPYRIGHT', 'PRIVACY_VIOLATION',
      'ILLEGAL_CONTENT', 'AGE_CONCERN', 'VIOLENCE', 'SPAM', 'OTHER'
    ];

    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { success: false, error: 'Invalid report reason' },
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

    // Generate case ID
    const caseId = `CASE-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

    // Create report (optionally with reporter info)
    const reporterId = 'anonymous'; // Would get from session or allow anonymous

    const report = await db.report.create({
      data: {
        caseId,
        videoId,
        reporterId: reporterId !== 'anonymous' ? reporterId : null,
        reason,
        description,
        evidence,
        email: body.email || null, // For anonymous reporters who want updates
        status: 'PENDING',
      },
    });

    // Log the report creation
    await db.auditLog.create({
      data: {
        action: 'report.create',
        resourceType: 'Report',
        resourceId: report.id,
        details: JSON.stringify({ caseId, videoId, reason }),
        success: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: report.id,
        caseId: report.caseId,
      },
      message: 'Report submitted successfully. Case ID: ' + caseId,
    }, { status: 201 });
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

// GET /api/reports - List reports (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const status = searchParams.get('status');

    // In real app: verify admin/moderator role
    
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [reports, total] = await Promise.all([
      db.report.findMany({
        where,
        include: {
          reporter: {
            select: { id: true, username: true, displayName: true },
          },
          video: {
            select: { id: true, title: true, thumbnailUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.report.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
