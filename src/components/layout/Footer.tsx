// RASHID LEAKS - Footer Component

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Shield, AlertTriangle, FileText, Mail, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FooterProps {
  className?: string;
}

const footerLinks = {
  legal: [
    { href: '/legal/terms', label: 'Terms of Service' },
    { href: '/legal/privacy', label: 'Privacy Policy' },
    { href: '/legal/guidelines', label: 'Community Guidelines' },
    { href: '/legal/dmca', label: 'DMCA / Copyright' },
    { href: '/legal/18-plus-policy', label: '18+ Policy' },
    { href: '/legal/non-consensual-policy', label: 'Non-Consensual Policy' },
    { href: '/legal/child-safety', label: 'Child Safety' },
  ],
  support: [
    { href: '/legal/contact', label: 'Contact Us' },
    { href: '/reports', label: 'Report Content' },
    { href: '/legal/privacy#your-rights', label: 'Your Privacy Rights' },
  ],
  company: [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/upload', label: 'Become a Creator' },
  ],
};

export function Footer({ className }: FooterProps) {
  const pathname = usePathname();
  
  // Hide footer on certain pages
  const hideFooter = pathname?.startsWith('/video/') || pathname === '/age-gate';
  
  if (hideFooter) return null;

  return (
    <footer className={className}>
      {/* Main Footer */}
      <div className="bg-[#0a0a0a] border-t border-white/10">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/25">
                  <span className="text-white font-bold text-sm">RL</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                  RASHID LEAKS
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                The premier adult video-sharing platform. All content is user-uploaded and moderated 
                for compliance with our community guidelines and legal requirements.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 text-xs">
                  🔞 18+ Only
                </Badge>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-400" />
                Legal
              </h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                Support & Safety
              </h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* RTA Label */}
              <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  Restricted To Adults
                </p>
                <p className="text-xs text-gray-400">
                  This website is labeled with RTA for parental filtering.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-400" />
                Quick Links
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="mt-6 space-y-2">
                <a
                  href="mailto:support@rashidleaks.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  support@rashidleaks.com
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} RASHID LEAKS. All rights reserved. 
              All models are 18 years or older.
            </p>
            
            <div className="flex items-center gap-4">
              {/* Compliance Badges */}
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="px-2 py-1 bg-white/5 rounded border border-white/10">
                  2257 Compliant
                </span>
                <span className="px-2 py-1 bg-white/5 rounded border border-white/10">
                  RTA Labelled
                </span>
                <span className="px-2 py-1 bg-white/5 rounded border border-white/10">
                  USC 2257
                </span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-yellow-500">Disclaimer:</strong> This site contains adult content 
                and is intended for adults only (18+). By entering this site, you confirm that you are at 
                least 18 years old or the age of majority in your jurisdiction. All performers on this site 
                are over the age of 18, and consent has been documented and verified. We comply with all 
                requirements of 18 U.S.C. § 2257 Record-Keeping Requirements Compliance Statement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Safe Area Padding for Mobile */}
      <div className="h-safe-area-inset-bottom bg-[#0a0a0a]" />
    </footer>
  );
}

// Helper component for badges
function Badge({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string; variant?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

export default Footer;
