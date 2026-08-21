// RASHID LEAKS - Registration Page

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
import type { AuthFormData } from '@/components/auth/AuthForm';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      // Call registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error || 'Registration failed. Please try again.');
        return;
      }

      // Redirect to login with success message
      router.push('/login?registered=1');
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to home
        </Link>

        {/* Registration Notice */}
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-300">
            By creating an account, you confirm that you are at least 18 years old and agree 
            to our Terms of Service and Community Guidelines.
          </p>
        </div>

        <AuthForm 
          mode="register" 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={submitError}
        />
      </div>
    </div>
  );
}
