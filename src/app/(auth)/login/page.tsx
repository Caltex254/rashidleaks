// RASHID LEAKS - Login Page

'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthStore } from '@/lib/store';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const { setUser } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(
    error ? 'Invalid credentials. Please try again.' : null
  );

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      console.log('Attempting sign in with:', data.email);
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log('Sign in result:', result);

      // Check for errors first
      if (result?.error) {
        console.log('Sign in error:', result.error);
        setSubmitError('Invalid email or password. Please try again.');
        return;
      }

      // Check if result is ok and we have a user
      if (result?.ok && result?.user) {
        console.log('Sign in successful, user:', result.user);
        
        // Small delay to ensure session is stored
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update store with user info regardless of role
        setUser({
          id: result.user.id || '',
          email: result.user.email || '',
          username: result.user.username || '',
          displayName: result.user.name || '',
          role: result.user.role || 'USER',
          avatar: result.user.image || null,
          isAuthenticated: true,
        });
        
        // Redirect based on role
        if (result.user.role === 'ADMIN' || result.user.role === 'MODERATOR') {
          console.log('Redirecting to admin panel...');
          router.push('/admin');
        } else {
          const callbackUrl = searchParams.get('callbackUrl') || '/';
          console.log('Redirecting to:', callbackUrl);
          router.push(callbackUrl);
        }
        
        // Refresh server components
        router.refresh();
      } else {
        // Handle case where result is not ok but no specific error
        console.log('Sign in failed - no error but not ok:', result);
        setSubmitError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login exception:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to home
        </Link>

        <AuthForm 
          mode="login" 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={submitError}
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
