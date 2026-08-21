// RASHID LEAKS - Server-side Age Verification Logic

import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export const AGE_VERIFICATION_COOKIE = 'rashid_leaks_age_verified';
export const AGE_VERIFICATION_TOKEN = 'rashid_leaks_age_token';

interface AgeVerificationResult {
  verified: boolean;
  token?: string;
  error?: string;
}

/**
 * Verify age and set secure cookie
 * This should be called server-side when user confirms they are 18+
 */
export async function verifyAge(
  ipAddress: string,
  userAgent: string,
  remember: boolean = false
): Promise<AgeVerificationResult> {
  try {
    // Generate a verification token (in production, this would be cryptographically secure)
    const token = generateAgeToken(ipAddress);
    
    // Set HTTP-only cookie with age verification
    const cookieStore = await cookies();
    
    // Cookie expires in 30 days if "remember me" is checked, otherwise session-only
    const maxAge = remember ? 30 * 24 * 60 * 60 : undefined; // 30 days or session
    
    cookieStore.set(AGE_VERIFICATION_COOKIE, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    // Also set a secondary token for additional validation
    cookieStore.set(AGE_VERIFICATION_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return { verified: true, token };
  } catch (error) {
    console.error('Age verification error:', error);
    return { verified: false, error: 'Failed to verify age' };
  }
}

/**
 * Check if user has been age verified
 */
export async function isAgeVerified(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const verified = cookieStore.get(AGE_VERIFICATION_COOKIE);
    return verified?.value === 'true';
  } catch {
    return false;
  }
}

/**
 * Clear age verification (for logout or manual reset)
 */
export async function clearAgeVerification(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AGE_VERIFICATION_COOKIE);
  cookieStore.delete(AGE_VERIFICATION_TOKEN);
}

/**
 * Generate a simple age verification token based on IP + timestamp
 * In production, use proper cryptographic signing
 */
function generateAgeToken(ipAddress: string): string {
  const timestamp = Date.now();
  const data = `${ipAddress}:${timestamp}:${process.env.AGE_SECRET || 'default-secret'}`;
  
  // Simple hash for demo - use proper crypto in production
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `${timestamp}-${Math.abs(hash).toString(16)}`;
}

/**
 * Validate age verification token
 */
export async function validateAgeToken(token: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const storedToken = cookieStore.get(AGE_VERIFICATION_TOKEN);
    
    if (!storedToken || storedToken.value !== token) {
      return false;
    }

    // Check if token is not too old (max 30 days)
    const [timestamp] = storedToken.value.split('-');
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    return tokenAge < maxAge;
  } catch {
    return false;
  }
}
