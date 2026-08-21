// RASHID LEAKS - Login Page

'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthStore } from '@/lib/store';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const { setUser } = useAuthStore();
  const { data: session } = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(
    error ? 'Invalid credentials. Please try again.' : null
  );

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setSubmitError(result.error === 'Account has been banned' 
          ? 'This account has been banned.' 
          : 'Invalid email or password. Please try again.'
        );
        return;
      }

      if (result?.ok) {
        // Small delay to ensure session is available
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if user is admin and redirect to admin panel
        if (result.user?.role === 'ADMIN' || result.user?.role === 'MODERATOR') {
          // Update store with user info
          setUser({
            id: result.user.id,
            email: result.user.email,
            username: result.user.username,
            displayName: result.user.name,
            role: result.user.role,
            avatar: result.user.image,
            isAuthenticated: true,
          });
          router.push('/admin');
        } else {
          // Normal user redirect to home
          const callbackUrl = searchParams.get('callbackUrl') || '/';
          router.push(callbackUrl);
        }
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
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
