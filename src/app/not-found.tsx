// RASHID LEAKS - 404 Not Found Page

'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 404 Graphic */}
        <div className="mb-8 relative">
          <h1 className="text-[150px] sm:text-[200px] font-bold text-white/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/20">
              <span className="text-4xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          It might have been deleted, renamed, or never existed.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 min-h-[48px]">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Link href="/search">
            <Button variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 min-h-[48px]">
              <Search className="w-4 h-4 mr-2" />
              Search Videos
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto text-gray-400 hover:text-white min-h-[48px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/categories" className="text-sm text-red-400 hover:text-red-300 transition-colors">
              Categories
            </Link>
            <Link href="/trending" className="text-sm text-red-400 hover:text-red-300 transition-colors">
              Trending
            </Link>
            <Link href="/upload" className="text-sm text-red-400 hover:text-red-300 transition-colors">
              Upload
            </Link>
            <Link href="/legal/contact" className="text-sm text-red-400 hover:text-red-300 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
