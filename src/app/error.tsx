// RASHID LEAKS - Error Boundary Page

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-3">
          Something Went Wrong
        </h2>
        <p className="text-gray-400 mb-2">
          An unexpected error has occurred.
        </p>
        <p className="text-sm text-gray-500 mb-8 font-mono">
          {error.message || 'Unknown error'}
          {error.digest && <span className="block mt-1">ID: {error.digest}</span>}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 min-h-[48px]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Link href="/">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 min-h-[48px]">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Help */}
        <p className="mt-8 text-sm text-gray-500">
          If this problem persists, please{' '}
          <Link href="/legal/contact" className="text-red-400 hover:text-red-300">
            contact support
          </Link>.
        </p>
      </div>
    </div>
  );
}
