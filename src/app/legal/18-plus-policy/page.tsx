// RASHID LEAKS - 18+ Policy Page

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Policy18PlusPage() {
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
            <CardTitle className="text-2xl sm:text-3xl text-white flex items-center gap-2">
              🔞 18+ Adult Content Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Age Verification Required
              </h3>
              <p className="text-sm">
                RASHID LEAKS is an adult content platform. Access is restricted to individuals who are at least 18 years of age 
                (or the age of majority in their jurisdiction). Strict age verification measures are in place.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Age Requirements</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Minimum age: 18 years (or local age of majority)</li>
                <li>Age verification required before accessing any content</li>
                <li>False representation of age is a violation of our Terms</li>
                <li>Verification may be requested again if fraud is suspected</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Content Classification</h2>
              <p>All content on this platform is classified as:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li><strong>Adult Content</strong> - Explicit sexual material</li>
                <li><strong>Nudity</strong> - Full or partial nudity</li>
                <li><strong>Mature Themes</strong> - Sexual situations and activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Parental Controls</h2>
              <p>
                Parents and guardians are responsible for restricting minors' access to adult content. 
                We recommend using:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Content filtering software</li>
                <li>Device-level parental controls</li>
                <li>ISP-level filtering options</li>
                <li>Browser safe search settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">RTA Labeling</h2>
              <p>
                This website is labeled with RTA (Restricted to Adults) to assist with parental filtering systems.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
