// RASHID LEAKS - Community Guidelines Page

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white touch-target min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-white">Community Guidelines</CardTitle>
            <p className="text-gray-400 text-sm">Rules for a safe and respectful community</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h3 className="text-red-400 font-semibold mb-2">⚠️ Important: Zero Tolerance Policy</h3>
              <p className="text-sm">
                RASHID LEAKS has a zero-tolerance policy for content involving minors or non-consensual material. 
                Violations will result in immediate account termination and reporting to authorities.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Consent Requirements</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All participants in uploaded content must be consenting adults (18+)</li>
                <li>Verifiable proof of age and consent must be available upon request</li>
                <li>Content must not depict any form of coercion or non-consensual activity</li>
                <li>All participants must be fully aware they are being recorded</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Prohibited Content</h2>
              <p className="mb-3">The following content is strictly prohibited:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Non-consensual intimate imagery</strong> (revenge porn, deepfakes)</li>
                <li><strong>Content involving minors</strong> (any form, including simulated)</li>
                <li><strong>Violent or extreme content</strong> causing serious harm</li>
                <li><strong>Bestiality</strong></li>
                <li><strong>Incest-themed content</strong> with actual family members</li>
                <li><strong>Human waste/scat</strong></li>
                <li><strong>Blood/gore</strong> beyond minor incidental amounts</li>
                <li><strong>Illegal activities</strong> (drugs, weapons, etc.)</li>
                <li><strong>Copyright infringement</strong></li>
                <li><strong>Doxing or personal information</strong></li>
                <li><strong>Hate speech</strong> targeting protected groups</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Title & Description Standards</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>No misleading titles or thumbnails (clickbait)</li>
                <li>Accurate representation of content</li>
                <li>Appropriate tags that describe the content</li>
                <li>No excessive capitalization or special characters</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Community Behavior</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Treat all community members with respect</li>
                <li>No harassment, threats, or bullying</li>
                <li>No spam or self-promotion</li>
                <li>No impersonation of others</li>
                <li>Respect copyright and intellectual property</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Enforcement</h2>
              <p className="leading-relaxed">
                Violations may result in:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-3 ml-4">
                <li>Warning or content removal</li>
                <li>Temporary suspension</li>
                <li>Permanent account ban</li>
                <li>Reporting to law enforcement when appropriate</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Reporting Violations</h2>
              <p className="leading-relaxed">
                If you see content that violates these guidelines, please use the Report button on the video or 
                visit our{' '}
                <Link href="/reports" className="text-red-400 hover:text-red-300 underline">Reports page</Link>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
