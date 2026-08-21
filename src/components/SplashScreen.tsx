// RASHID LEAKS - Splash Screen Component
// Cool 3-second loading screen with 18+ icon and branding

'use client';

import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Remove splash after 3 seconds (allows fade out animation)
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f0f0f] transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-600/10 to-pink-600/10 rounded-full blur-3xl animate-spin-slow" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container with Glow Effect */}
        <div className="relative mb-8">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 animate-pulse opacity-50 blur-xl scale-110" />
          
          {/* Main Logo Container */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/50 animate-bounce-gentle">
            {/* Inner Pattern */}
            <div className="absolute inset-2 bg-black/20 rounded-xl" />
            
            {/* 18+ Badge */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-white font-black text-4xl sm:text-5xl tracking-tight">18+</span>
              <div className="w-16 h-0.5 bg-white/60 mt-1 rounded-full" />
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/40 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/40 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-lg" />
          </div>
          
          {/* Rotating Ring */}
          <div className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-2 border-transparent border-t-red-400 border-r-pink-400 animate-spin-slow" style={{ animationDuration: '3s' }} />
        </div>

        {/* Website Name with Gradient Text */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-center mb-3">
          <span className="bg-gradient-to-r from-red-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-gradient-x">
            RASHID LEAKS
          </span>
        </h1>
        
        {/* Tagline */}
        <p className="text-gray-400 text-sm sm:text-base text-center max-w-xs mx-auto mb-6 opacity-80">
          Premium Adult Video Platform
        </p>

        {/* Loading Indicator */}
        <div className="flex items-center gap-2">
          {/* Animated Dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce-dot"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-2">Loading...</span>
        </div>

        {/* Warning Badge */}
        <div className="mt-8 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
          <p className="text-yellow-500 text-xs font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            ADULT CONTENT • 18+ ONLY
          </p>
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-bounce-dot {
          animation: bounce-dot 1.4s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;
