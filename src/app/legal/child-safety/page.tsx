// RASHID LEAKS - Child Safety Policy Page

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChildSafetyPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white touch-target min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-[#1a1a1a] border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-white flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-yellow-500" />
              Child Safety Policy
            </CardTitle>
            <p className="text-gray-400 text-sm">Protecting children is our highest priority</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h3 className="text-red-400 font-bold mb-2">🚨 ZERO TOLERANCE FOR CSAM</h3>
              <p className="leading-relaxed text-sm">
                RASHID LEAKS has absolutely zero tolerance for any content involving minors. 
                Any such content discovered will result in immediate reporting to NCMEC (National Center for Missing & Exploited Children) 
                and law enforcement.
              </p>
              <p className="mt-2 text-sm font-mono bg-black/30 p-2 rounded">
                To report CSAM immediately: Call 1-800-THE-LOST (1-800-843-5678) or visit missingkids.org
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Our Commitment</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Strict age verification for all users (18+ only)</li>
                <li>Age verification for all performers in uploaded content</li>
                <li>Automated and manual content moderation</li>
                <li>Immediate reporting to authorities when CSAM is suspected</li>
                <li>Cooperation with law enforcement investigations</li>
                <li>Regular safety audits of our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Prohibited Content Involving Minors</h2>
              <p className="mb-3">The following are strictly prohibited:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Any sexual or suggestive content involving minors (under 18)</li>
                <li>Sexualized depictions of minors (real, animated, or simulated)</li>
                <li>Content that sexualizes minors through context or implication</li>
                <li>Minors in any state of undress</li>
                <li>Grooming behavior or communication with minors</li>
                <li>Trafficking or exploitation of minors</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Reporting Suspected CSAM</h2>
              <p className="mb-3">If you encounter content involving a minor:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>DO NOT download, share, or save the content</strong></li>
                <li>Report immediately using our report system</li>
                <li>Contact NCMEC at 1-800-843-5678</li>
                <li>Contact your local law enforcement</li>
              </ol>
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm">
                  Report to us:{' '}
                  <Link href="/reports" className="text-blue-400 hover:underline">Submit an Emergency Report</Link>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Parental Resources</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><a href="https://www.missingkids.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">NCMEC - National Center for Missing & Exploited Children</a></li>
                <li><a href="https://www.netsmartz.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">NetSmartz - Internet Safety for Kids</a></li>
                <li><a href="https://www.thinkuknow.co.uk" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ThinkUKnow - CEOP Safety Centre</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Verification Requirements</h2>
              <p>All creators must provide:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Government-issued photo ID proving age 18+</li>
                <li>Signed consent forms from all performers</li>
                <li>2257 compliance documentation (US-based creators)</li>
                <li>Ongoing age verification as required</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
