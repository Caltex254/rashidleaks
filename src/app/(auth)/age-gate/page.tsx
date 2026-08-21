// RASHID LEAKS - Age Verification Page

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AgeGate } from '@/components/auth/AgeGate';
import { useAgeVerificationStore } from '@/lib/store';

export default function AgeGatePage() {
  const router = useRouter();
  const { isVerified } = useAgeVerificationStore();

  const handleVerified = () => {
    router.push('/');
  };

  const handleExit = () => {
    // Redirect to a safe site
    window.location.href = 'https://www.google.com';
  };

  // If already verified, redirect to home
  useEffect(() => {
    if (isVerified) {
      router.push('/');
    }
  }, [isVerified, router]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <AgeGate 
        fullPage 
        onVerified={handleVerified}
        onExit={handleExit}
      />
    </div>
  );
}
