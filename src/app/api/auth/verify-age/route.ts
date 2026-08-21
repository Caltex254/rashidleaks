// RASHID LEAKS - Age Verification API Route

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const AGE_VERIFICATION_COOKIE = 'rashid_leaks_age_verified';
const AGE_VERIFICATION_TOKEN = 'rashid_leaks_age_token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { remember = true } = body;

    // Get client IP for token generation
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Generate a simple verification token
    const timestamp = Date.now();
    const tokenData = `${ip}:${timestamp}:${process.env.AGE_SECRET || 'default-secret'}`;
    
    let hash = 0;
    for (let i = 0; i < tokenData.length; i++) {
      hash = ((hash << 5) - hash) + tokenData.charCodeAt(i);
      hash = hash & hash;
    }
    
    const token = `${timestamp}-${Math.abs(hash).toString(16)}`;

    // Set cookies
    const cookieStore = await cookies();
    const maxAge = remember ? 30 * 24 * 60 * 60 : undefined; // 30 days or session

    cookieStore.set(AGE_VERIFICATION_COOKIE, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    cookieStore.set(AGE_VERIFICATION_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Age verified successfully',
    });
  } catch (error) {
    console.error('Age verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify age' },
      { status: 500 }
    );
  }
}

// Check if user is age verified
export async function GET() {
  try {
    const cookieStore = await cookies();
    const verified = cookieStore.get(AGE_VERIFICATION_COOKIE);
    
    return NextResponse.json({
      verified: verified?.value === 'true',
    });
  } catch (error) {
    return NextResponse.json(
      { verified: false },
      { status: 500 }
    );
  }
}
