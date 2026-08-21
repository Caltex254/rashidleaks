// RASHID LEAKS - Terms of Service Page

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white touch-target min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-white">Terms of Service</CardTitle>
            <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing or using RASHID LEAKS (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, you may not access or use the Platform. The Platform is intended for users who are at least 18 years of age.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Age Requirements</h2>
              <p className="leading-relaxed">
                You must be at least 18 years old (or the age of majority in your jurisdiction) to use this Platform. By using the Platform, 
                you represent and warrant that you meet this age requirement. All content on this Platform is intended for adult audiences only.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
              <p className="leading-relaxed mb-3">
                To access certain features of the Platform, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Providing accurate and complete information when creating your account</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Acceptable Use Policy</h2>
              <p className="leading-relaxed mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Upload content that is illegal, harmful, or violates any laws</li>
                <li>Upload non-consensual intimate imagery or content involving minors</li>
                <li>Impersonate another person or misrepresent your affiliation</li>
                <li>Use automated systems or bots to access the Platform</li>
                <li>Attempt to interfere with or disrupt the Platform's functionality</li>
                <li>Share or distribute content without proper authorization</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Content Guidelines</h2>
              <p className="leading-relaxed">
                All content uploaded to the Platform must comply with our Community Guidelines. This includes:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-3 ml-4">
                <li>All participants must be consenting adults (18+)</li>
                <li>All performers must provide proof of age and consent</li>
                <li>No non-consensual content of any kind</li>
                <li>No content depicting violence, coercion, or illegal acts</li>
                <li>Proper attribution and rights clearance for all content</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Intellectual Property</h2>
              <p className="leading-relaxed">
                You retain ownership of content you upload to the Platform. By uploading content, you grant us a license to host, display, 
                and distribute that content as necessary to operate the Platform. You represent that you have all necessary rights to upload such content.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Privacy</h2>
              <p className="leading-relaxed">
                Your privacy is important to us. Please review our{' '}
                <Link href="/legal/privacy" className="text-red-400 hover:text-red-300 underline">Privacy Policy</Link>{' '}
                to understand how we collect, use, and protect your personal information.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Disclaimer of Warranties</h2>
              <p className="leading-relaxed">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
                WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED OR ERROR-FREE.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Limitation of Liability</h2>
              <p className="leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
                OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes through the Platform. 
                Your continued use of the Platform after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Contact Information</h2>
              <p className="leading-relaxed">
                If you have questions about these Terms, please contact us at{' '}
                <Link href="/legal/contact" className="text-red-400 hover:text-red-300 underline">our contact page</Link>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
