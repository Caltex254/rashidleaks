// RASHID LEAKS - Debug API Endpoint
// For testing database connectivity and authentication flow
// REMOVE THIS IN PRODUCTION!

import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const userCount = await db.user.count();
    
    // Get recent users (without sensitive data)
    const recentUsers = await db.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        // Don't select passwordHash for security
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        userCount,
        recentUsers,
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
          hasNextAuthUrl: process.env.NEXTAUTH_URL,
          nodeEnv: process.env.NODE_ENV,
        }
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: process.env.NEXTAUTH_URL,
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, testPassword } = body;

    if (action === 'test-hash') {
      // Test password hashing and comparison
      if (!password) {
        return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 });
      }

      const hashed = await hash(password, 12);
      const isValid = await compare(password, hashed);

      return NextResponse.json({
        success: true,
        action: 'test-hash',
        data: {
          original: password,
          hashed, // Only for debugging - remove in production!
          isValid,
          hashLength: hashed.length,
          passwordLength: password.length
        }
      });
    }

    if (action === 'check-user') {
      // Check if user exists and test password
      if (!email) {
        return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
      }

      const user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          passwordHash: true, // Include for debugging only
          createdAt: true,
        },
      });

      if (!user) {
        return NextResponse.json({
          success: true,
          action: 'check-user',
          data: { exists: false, email }
        });
      }

      let passwordMatch = false;
      if (testPassword) {
        try {
          passwordMatch = await compare(testPassword, user.passwordHash);
        } catch (e) {
          console.error('Password compare error:', e);
        }
      }

      return NextResponse.json({
        success: true,
        action: 'check-user',
        data: {
          exists: true,
          userId: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          passwordHashLength: user.passwordHash?.length,
          passwordHashPrefix: user.passwordHash?.substring(0, 10) + '...', // Show prefix for debugging
          passwordTested: !!testPassword,
          passwordMatch,
          testPasswordProvided: !!testPassword
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use: test-hash or check-user'
    }, { status: 400 });

  } catch (error) {
    console.error('Debug POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
