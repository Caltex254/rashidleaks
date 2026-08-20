// RASHID LEAKS - Shared Authentication Form Component

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Calendar, Globe, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AuthFormData {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  country?: string;
  agreeToTerms?: boolean;
  agreeToPrivacy?: boolean;
  confirm18Plus?: boolean;
}

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Spain', 'Italy', 'Brazil',
  'Japan', 'Mexico', 'India', 'Other'
];

export function AuthForm({ mode, onSubmit, isLoading = false, error }: AuthFormProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    ...(mode === 'register' && {
      username: '',
      confirmPassword: '',
      dateOfBirth: '',
      country: '',
      agreeToTerms: false,
      agreeToPrivacy: false,
      confirm18Plus: false,
    }),
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Register-specific validations
    if (mode === 'register') {
      if (!formData.username || formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
      } else {
        const dob = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (age < 18 || (age === 18 && monthDiff < 0)) {
          errors.dateOfBirth = 'You must be at least 18 years old';
        }
      }

      if (!formData.confirm18Plus) {
        errors.confirm18Plus = 'You must confirm you are 18+';
      }

      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to Terms of Service';
      }

      if (!formData.agreeToPrivacy) {
        errors.agreeToPrivacy = 'You must agree to Privacy Policy';
      }
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrors({});

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const updateField = (field: keyof AuthFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (localErrors[field]) {
      setLocalErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const isLogin = mode === 'login';

  return (
    <Card className="w-full max-w-md bg-[#1a1a1a] border-white/10 shadow-xl">
      <CardHeader className="text-center space-y-2 pb-4">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center justify-center mx-auto mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
            <span className="text-white font-bold text-lg">RL</span>
          </div>
        </Link>
        
        <CardTitle className="text-2xl font-bold text-white">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        
        <CardDescription className="text-gray-400">
          {isLogin 
            ? 'Sign in to your RASHID LEAKS account'
            : 'Join RASHID LEAKS to access premium content'
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Error Display */}
        {(error || Object.keys(localErrors).length > 0) && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-red-400">
                {error || 'Please fix the errors below'}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field (Register Only) */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  className={cn(
                    "pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50",
                    localErrors.username && "border-red-500"
                  )}
                  autoComplete="username"
                />
              </div>
              {localErrors.username && (
                <p className="text-xs text-red-400">{localErrors.username}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={cn(
                  "pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50",
                  localErrors.email && "border-red-500"
                )}
                autoComplete="email"
              />
            </div>
            {localErrors.email && (
              <p className="text-xs text-red-400">{localErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className={cn(
                  "pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50",
                  localErrors.password && "border-red-500"
                )}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {localErrors.password && (
              <p className="text-xs text-red-400">{localErrors.password}</p>
            )}
          </div>

          {/* Confirm Password (Register Only) */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className={cn(
                    "pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50",
                    localErrors.confirmPassword && "border-red-500"
                  )}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {localErrors.confirmPassword && (
                <p className="text-xs text-red-400">{localErrors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Date of Birth (Register Only) */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-300">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className={cn(
                    "pl-10 bg-white/5 border-white/10 text-white focus:border-red-500/50",
                    localErrors.dateOfBirth && "border-red-500"
                  )}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
              </div>
              {localErrors.dateOfBirth && (
                <p className="text-xs text-red-400">{localErrors.dateOfBirth}</p>
              )}
            </div>
          )}

          {/* Country (Register Only) */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-300">Country</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full pl-10 pr-8 py-2 rounded-md bg-white/5 border border-white/10 text-white appearance-none cursor-pointer focus:border-red-500/50 focus:ring-red-500/20"
                >
                  <option value="" disabled>Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country} className="bg-[#1a1a1a]">
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Remember Me / Forgot Password (Login Only) */}
          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox id="remember" className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-red-400 hover:text-red-300 transition-colors">
                Forgot password?
              </Link>
            </div>
          )}

          {/* 18+ Confirmation (Register Only) */}
          {!isLogin && (
            <>
              <Separator className="bg-white/10" />
              
              <label className="flex items-start gap-3 cursor-pointer group p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <Checkbox
                  id="confirm18Plus"
                  checked={formData.confirm18Plus}
                  onCheckedChange={(checked) => updateField('confirm18Plus', checked === true)}
                  className="mt-0.5 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  I confirm that I am at least 18 years old (or the age of majority in my jurisdiction)
                </span>
              </label>
              {localErrors.confirm18Plus && (
                <p className="text-xs text-red-400 ml-6">{localErrors.confirm18Plus}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateField('agreeToTerms', checked === true)}
                  className="mt-0.5 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  I agree to the{' '}
                  <Link href="/legal/terms" target="_blank" className="text-red-400 hover:text-red-300 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/legal/guidelines" target="_blank" className="text-red-400 hover:text-red-300 underline">
                    Community Guidelines
                  </Link>
                </span>
              </label>
              {localErrors.agreeToTerms && (
                <p className="text-xs text-red-400 ml-6">{localErrors.agreeToTerms}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  id="agreeToPrivacy"
                  checked={formData.agreeToPrivacy}
                  onCheckedChange={(checked) => updateField('agreeToPrivacy', checked === true)}
                  className="mt-0.5 data-[state=checked]:bg-red-red-500 data-[state=checked]:border-red-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  I agree to the{' '}
                  <Link href="/legal/privacy" target="_blank" className="text-red-400 hover:text-red-300 underline">
                    Privacy Policy
                  </Link>{' '}
                  and consent to the processing of my personal data
                </span>
              </label>
              {localErrors.agreeToPrivacy && (
                <p className="text-xs text-red-400 ml-6">{localErrors.agreeToPrivacy}</p>
              )}
            </>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 py-3 text-base font-semibold disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col space-y-4 pt-4">
        <Separator className="w-full bg-white/10" />
        
        <p className="text-sm text-gray-400 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Link 
            href={isLogin ? '/register' : '/login'} 
            className="text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </Link>
        </p>

        {/* Age Gate Notice */}
        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
          🔞 This platform contains adult content for users 18+ only.
        </p>
      </CardFooter>
    </Card>
  );
}

export default AuthForm;
