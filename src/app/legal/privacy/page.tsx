// RASHID LEAKS - Privacy Policy Page

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPage() {
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
            <CardTitle className="text-2xl sm:text-3xl text-white">Privacy Policy</CardTitle>
            <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <p className="leading-relaxed mb-3">We collect information you provide directly:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Account information (username, email, password)</li>
                <li>Profile information (display name, bio, avatar)</li>
                <li>Content you upload (videos, comments, messages)</li>
                <li>Communications with us</li>
              </ul>
              <p className="leading-relaxed mt-3">We also automatically collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Device information (browser type, operating system)</li>
                <li>Usage data (pages visited, features used)</li>
                <li>IP address and location data</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p className="leading-relaxed">We use collected information to:</p>
              <ul className="list-disc list-inside space-y-1 mt-3 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent or illegal activities</li>
                <li>Personalize and improve your experience</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
              <p className="leading-relaxed">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-3 ml-4">
                <li>Service providers who assist in our operations</li>
                <li>Legal requirements when required by law</li>
                <li>To protect rights, property, or safety</li>
                <li>With your consent or at your direction</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate security measures to protect your personal information. However, no method of transmission 
                over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
              <p className="leading-relaxed">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-1 mt-3 ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Cookies</h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our Platform and hold certain information. 
                You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Children's Privacy</h2>
              <p className="leading-relaxed">
                The Platform is not intended for children under 18 years of age. We do not knowingly collect personal information 
                from children. If we learn that we have collected such information, we will delete it promptly.
              </p>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Contact Us</h2>
              <p className="leading-relaxed">
                For privacy-related inquiries, please contact us at{' '}
                <Link href="/legal/contact" className="text-red-400 hover:text-red-300 underline">our contact page</Link>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
