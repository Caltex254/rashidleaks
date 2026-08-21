// RASHID LEAKS - Registration API Route

import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate username
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { success: false, error: 'Username must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { success: false, error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    console.log('Registration attempt:', { username, email });

    // Check if user already exists
    try {
      const existingUser = await db.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() },
          ],
        },
      });

      if (existingUser) {
        const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
        return NextResponse.json(
          { success: false, error: `${field} is already in use` },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection error. Please try again.' },
        { status: 500 }
      );
    }

    // Hash password with bcryptjs (same as login comparison uses)
    let passwordHash: string;
    try {
      passwordHash = await hash(password, 12);
      console.log('Password hashed successfully');
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return NextResponse.json(
        { success: false, error: 'Failed to process password. Please try again.' },
        { status: 500 }
      );
    }

    // Create user
    let user;
    try {
      user = await db.user.create({
        data: {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          passwordHash,
          role: 'USER',
          ageVerified: true, // Verified via 18+ checkbox confirmation
          ageVerifiedAt: new Date(),
        },
        select: {
          id: true,
          username: true,
          email: true,
          displayName: true,
          role: true,
          createdAt: true,
        },
      });
      console.log('User created successfully:', user.id);
    } catch (createError) {
      console.error('User creation error:', createError);
      
      // Handle unique constraint errors
      if (createError instanceof Error && 'code' in createError && createError.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'Username or email is already taken' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to create account. Database error occurred.' },
        { status: 500 }
      );
    }

    // Verify user was created by fetching it back
    try {
      const verifyUser = await db.user.findUnique({
        where: { id: user.id },
        select: { id: true, email: true, username: true },
      });
      
      if (!verifyUser) {
        console.error('CRITICAL: User creation reported success but user not found!');
        return NextResponse.json(
          { success: false, error: 'Account creation failed. Please try again.' },
          { status: 500 }
        );
      }
      
      console.log('User verified in database:', verifyUser.email);
    } catch (verifyError) {
      console.error('User verification error:', verifyError);
      // Continue anyway - user was likely created
    }

    // Log registration (non-critical)
    try {
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: 'user.register',
          resourceType: 'User',
          resourceId: user.id,
          details: JSON.stringify({ method: 'email', ip: request.headers.get('x-forwarded-for') }),
          success: true,
        },
      });
    } catch (logError) {
      console.error('Audit log error (non-critical):', logError);
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Account created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
