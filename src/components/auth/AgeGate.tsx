// RASHID LEAKS - Age Gate Overlay Component

'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAgeVerificationStore } from '@/lib/store';

interface AgeGateProps {
  /** If true, shows as full page instead of overlay */
  fullPage?: boolean;
  /** Callback when verification succeeds */
  onVerified?: () => void;
  /** Callback when user chooses to leave */
  onExit?: () => void;
}

export function AgeGate({ fullPage = false, onVerified, onExit }: AgeGateProps) {
  const { isVerified, verify, rememberChoice, reset } = useAgeVerificationStore();
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already verified (for full page mode)
  useEffect(() => {
    if (isVerified && fullPage) {
      onVerified?.();
    }
  }, [isVerified, fullPage, onVerified]);

  const handleVerify = async () => {
    setError(null);

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and confirm you are 18+');
      return;
    }

    try {
      // Call API to set server-side cookie
      const response = await fetch('/api/auth/verify-age', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remember: rememberMe }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      // Update local state
      verify(rememberMe);
      onVerified?.();
    } catch (err) {
      console.error('Age verification error:', err);
      setError('Failed to verify age. Please try again.');
    }
  };

  const handleExit = () => {
    setIsExiting(true);
    
    // Redirect to a safe site
    setTimeout(() => {
      // Try to navigate away
      if (onExit) {
        onExit();
      } else {
        // Default: go to Google
        window.location.href = 'https://www.google.com';
      }
    }, 500);
  };

  // Don't render if already verified and not in full page mode
  if (isVerified && !fullPage) {
    return null;
  }

  const containerClasses = fullPage
    ? 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f0f0f]'
    : 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';

  return (
    <div className={containerClasses}>
      {/* Close button for overlay mode */}
      {!fullPage && (
        <button
          onClick={handleExit}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close and exit"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      <Card className="w-full max-w-md bg-[#1a1a1a] border-red-500/30 shadow-2xl shadow-red-500/10">
        <CardHeader className="text-center pb-2">
          {/* Warning Icon */}
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30">
            {isExiting ? (
              <AlertTriangle className="h-10 w-10 text-green-400 animate-pulse" />
            ) : (
              <Shield className="h-10 w-10 text-yellow-500" />
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold text-white">
            {isExiting ? 'Goodbye!' : 'Age Verification Required'}
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm mt-2">
            {isExiting 
              ? 'Redirecting you to a safe website...'
              : 'This website contains adult content that is only suitable for individuals who are at least 18 years old (or the age of majority in your jurisdiction).'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {!isExiting ? (
            <>
              {/* Warning Box */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-200/80">
                    <p className="font-medium text-yellow-500 mb-1">Warning:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• You must be 18+ years of age</li>
                      <li>• All performers are verified adults</li>
                      <li>• Content is consensual and legal</li>
                      <li>• By entering, you accept our terms</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Age Confirmation */}
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-lg font-semibold text-white mb-1">
                  Are you at least 18 years old?
                </p>
                <p className="text-xs text-gray-500">
                  By clicking "Enter", you confirm that you are an adult
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox
                    id="terms-agree"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-0.5 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    I confirm that I am at least 18 years old (or the age of majority in my jurisdiction), 
                    and I agree to the{' '}
                    <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="mt-0.5 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Remember this device (don't ask again for 30 days)
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleExit}
                  className="flex-1 border-white/20 text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  Exit (Under 18)
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={!agreedToTerms}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Enter Site
                </Button>
              </div>

              {/* Legal Links */}
              <div className="pt-4 border-t border-white/10 text-center space-y-2">
                <p className="text-[11px] text-gray-500">
                  This site complies with 18 U.S.C. § 2257 Record-Keeping Requirements.
                </p>
                <div className="flex justify-center gap-4 text-[11px]">
                  <a href="/legal/privacy" className="text-gray-500 hover:text-red-400 transition-colors">
                    Privacy
                  </a>
                  <a href="/legal/terms" className="text-gray-500 hover:text-red-400 transition-colors">
                    Terms
                  </a>
                  <a href="/legal/dmca" className="text-gray-500 hover:text-red-400 transition-colors">
                    DMCA
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* Exiting State */
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-gray-300">
                Thank you for respecting our age restrictions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AgeGate;
