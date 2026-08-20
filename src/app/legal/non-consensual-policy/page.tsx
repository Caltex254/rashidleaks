// RASHID LEAKS - Non-Consensual Imagery Policy

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NonConsensualPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white touch-target min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-white">Non-Consensual Intimate Imagery Policy</CardTitle>
            <p className="text-gray-400 text-sm">Zero tolerance for non-consensual content</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h3 className="text-red-400 font-bold text-lg mb-2">⚠️ ZERO TOLERANCE POLICY</h3>
              <p className="leading-relaxed">
                RASHID LEAKS has a strict zero-tolerance policy for non-consensual intimate imagery. 
                Any user found uploading or distributing such content will be permanently banned and reported to law enforcement.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">What is Non-Consensual Intimate Imagery?</h2>
              <p className="mb-3">This includes but is not limited to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Revenge Porn</strong> - Private images/videos shared without consent</li>
                <li><strong>Deepfakes</strong> - AI-generated intimate content using someone's likeness without permission</li>
                <li><strong>Hidden Camera Recordings</strong> - Content recorded without knowledge or consent</li>
                <li><strong>Hacked/Stolen Content</strong> - Private content obtained through unauthorized access</li>
                <li><strong>Upskirting/Downblousing</strong> - Images taken without consent in private settings</li>
                <li><strong>Extortion/Blackmail Material</strong> - Content used for coercion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Our Commitment</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All reports of NCII are investigated within 24 hours</li>
                <li>Content is removed pending investigation</li>
                <li>Perpetrators are permanently banned</li>
                <li>Law enforcement cooperation when appropriate</li>
                <li>Support for victims including help with removal from other platforms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Reporting NCII</h2>
              <p className="mb-3">
                If you are a victim of non-consensual intimate imagery:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Report the content immediately using our report system</li>
                <li>Screenshot evidence before reporting</li>
                <li>Contact local law enforcement</li>
                <li>Seek support from victim advocacy organizations</li>
              </ol>
              <p className="mt-3">
                Report now:{' '}
                <Link href="/reports" className="text-red-400 hover:text-red-300 underline">Submit a Report</Link>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Resources for Victims</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><a href="https://www.stopncii.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">StopNCII.org</a> - Global NCII removal tool</li>
                <li><a href="https://www.rainn.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">RAINN</a> - Sexual assault support</li>
                <li><a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Crisis Text Line</a> - 24/7 support</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
