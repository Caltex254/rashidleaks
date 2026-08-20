// RASHID LEAKS - DMCA / Copyright Page

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DMCAPage() {
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
            <CardTitle className="text-2xl sm:text-3xl text-white">DMCA & Copyright Policy</CardTitle>
            <p className="text-gray-400 text-sm">Digital Millennium Copyright Act compliance</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Copyright Infringement Notice</h2>
              <p className="leading-relaxed">
                RASHID LEAKS respects the intellectual property rights of others and expects its users to do the same. 
                If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement 
                and is accessible on this Platform, please notify us immediately.
              </p>
            </section>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-blue-400 font-semibold mb-2">DMCA Notice Requirements</h3>
              <p className="text-sm leading-relaxed">
                Your notice must include:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm ml-4">
                <li>Your physical or electronic signature</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Your contact information (address, phone number, email)</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                <li>A statement that the information in the notification is accurate, under penalty of perjury</li>
              </ul>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Submitting a Takedown Request</h2>
              <p className="leading-relaxed mb-4">
                To submit a DMCA takedown request, please visit our{' '}
                <Link href="/reports" className="text-red-400 hover:text-red-300 underline">Reports page</Link>{' '}
                or send your complete notice to our designated agent.
              </p>
              <p className="leading-relaxed">
                We will respond to all valid DMCA notices within 24-48 hours.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Counter-Notice</h2>
              <p className="leading-relaxed">
                If you believe that content you posted was removed or disabled by mistake or misidentification, 
                you may file a counter-notification. Your counter-notice must include similar information as above, 
                plus a statement consenting to federal court jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Repeat Infringer Policy</h2>
              <p className="leading-relaxed">
                We will terminate the accounts of users who are repeat copyright infringers in appropriate circumstances.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
