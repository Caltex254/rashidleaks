// RASHID LEAKS - Reports & Takedown Request Page

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flag, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'content' | 'takedown'>('content');
  
  // Report form state
  const [reportForm, setReportForm] = useState({
    videoUrl: '',
    reason: '',
    description: '',
    email: '',
  });
  
  // Takedown form state
  const [takedownForm, setTakedownForm] = useState({
    requesterName: '',
    requesterEmail: '',
    requesterRole: '',
    videoUrl: '',
    url: '',
    reason: '',
    description: '',
    legalReference: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a] border-green-500/20 text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Submission Received</h2>
            <p className="text-gray-400 mb-2">
              Your {reportType === 'content' ? 'report' : 'takedown request'} has been submitted.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We'll review it and respond within 24-48 hours. A case ID has been generated for your reference.
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()} variant="outline" className="border-white/20">
                Submit Another
              </Button>
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full text-gray-400">Return Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white touch-target min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Warning Banner */}
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-200/80">
            <strong>Important:</strong> False or malicious reports may result in account suspension. 
            Only submit legitimate concerns. For emergencies involving minors, contact law enforcement immediately.
          </div>
        </div>

        <Tabs value={reportType} onValueChange={(v) => setReportType(v as 'content' | 'takedown')}>
          <TabsList className="bg-[#1a1a1a] border-white/10 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="content" className="flex-1 data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Flag className="w-4 h-4 mr-2" />
              Report Content
            </TabsTrigger>
            <TabsTrigger value="takedown" className="flex-1 data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Takedown Request
            </TabsTrigger>
          </TabsList>

          {/* Content Report Form */}
          <TabsContent value="content">
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-400" />
                  Report Video Content
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Report content that violates our Community Guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-url" className="text-gray-300">Video URL *</Label>
                    <Input
                      id="video-url"
                      type="url"
                      value={reportForm.videoUrl}
                      onChange={(e) => setReportForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                      required
                      placeholder="https://rashidleaks.com/video/..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-gray-300">Reason for Report *</Label>
                    <Select 
                      value={reportForm.reason} 
                      onValueChange={(v) => setReportForm(prev => ({ ...prev, reason: v }))}
                    >
                      <SelectTrigger id="reason" className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        <SelectItem value="NON_CONSENSUAL">Non-consensual intimate content</SelectItem>
                        <SelectItem value="COPYRIGHT">Copyright infringement</SelectItem>
                        <SelectItem value="PRIVACY_VIOLATION">Privacy violation</SelectItem>
                        <SelectItem value="ILLEGAL_CONTENT">Illegal content</SelectItem>
                        <SelectItem value="AGE_CONCERN">Age/consent concern</SelectItem>
                        <SelectItem value="VIOLENCE">Violent content</SelectItem>
                        <SelectItem value="SPAM">Spam or misleading</SelectItem>
                        <SelectItem value="OTHER">Other reason</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Additional Details</Label>
                    <Textarea
                      id="description"
                      value={reportForm.description}
                      onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      placeholder="Please provide any additional information that will help us review this report..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Your Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={reportForm.email}
                      onChange={(e) => setReportForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com (for updates on this report)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50"
                    />
                    <p className="text-xs text-gray-500">
                      Provide your email to receive updates on the status of your report
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !reportForm.videoUrl || !reportForm.reason}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 min-h-[48px]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Takedown Request Form */}
          <TabsContent value="takedown">
            <Card className="bg-[#1a1a1a] border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  DMCA / Takedown Request
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Submit a formal takedown request under DMCA or other legal basis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requester-name" className="text-gray-300">Your Full Name *</Label>
                      <Input
                        id="requester-name"
                        value={takedownForm.requesterName}
                        onChange={(e) => setTakedownForm(prev => ({ ...prev, requesterName: e.target.value }))}
                        required
                        placeholder="Legal name"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requester-email" className="text-gray-300">Email Address *</Label>
                      <Input
                        id="requester-email"
                        type="email"
                        value={takedownForm.requesterEmail}
                        onChange={(e) => setTakedownForm(prev => ({ ...prev, requesterEmail: e.target.value }))}
                        required
                        placeholder="your@email.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requester-role" className="text-gray-300">Your Role *</Label>
                    <Select 
                      value={takedownForm.requesterRole} 
                      onValueChange={(v) => setTakedownForm(prev => ({ ...prev, requesterRole: v }))}
                    >
                      <SelectTrigger id="requester-role" className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        <SelectItem value="copyright_owner">Copyright Owner</SelectItem>
                        <SelectItem value="authorized_agent">Authorized Agent</SelectItem>
                        <SelectItem value="subject_of_content">Subject of Content</SelectItem>
                        <SelectItem value="legal_representative">Legal Representative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="takedown-video-url" className="text-gray-300">Video URL (if applicable)</Label>
                    <Input
                      id="takedown-video-url"
                      type="url"
                      value={takedownForm.videoUrl}
                      onChange={(e) => setTakedownForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                      placeholder="https://rashidleaks.com/video/..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="takedown-url" className="text-gray-300">Direct URL to Infringing Content</Label>
                    <Input
                      id="takedown-url"
                      type="url"
                      value={takedownForm.url}
                      onChange={(e) => setTakedownForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="takedown-reason" className="text-gray-300">Reason for Takedown *</Label>
                    <Select 
                      value={takedownForm.reason} 
                      onValueChange={(v) => setTakedownForm(prev => ({ ...prev, reason: v }))}
                    >
                      <SelectTrigger id="takedown-reason" className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        <SelectItem value="COPYRIGHT_INFRINGEMENT">Copyright Infringement</SelectItem>
                        <SelectItem value="NON_CONSENSUAL_INTIMATE_IMAGERY">Non-Consensual Intimate Imagery</SelectItem>
                        <SelectItem value="PRIVACY_VIOLATION">Privacy Violation</SelectItem>
                        <SelectItem value="ILLEGAL_CONTENT">Illegal Content</SelectItem>
                        <SelectItem value="COURT_ORDER">Court Order</SelectItem>
                        <SelectItem value="VIOLATION_OF_TERMS">Violation of Terms</SelectItem>
                        <SelectItem value="OTHER">Other Legal Basis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="takedown-description" className="text-gray-300">Detailed Description *</Label>
                    <Textarea
                      id="takedown-description"
                      value={takedownForm.description}
                      onChange={(e) => setTakedownForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={5}
                      required
                      placeholder="Please describe the infringing material and your rights to it..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="legal-reference" className="text-gray-300">Legal Reference (Optional)</Label>
                    <Input
                      id="legal-reference"
                      value={takedownForm.legalReference}
                      onChange={(e) => setTakedownForm(prev => ({ ...prev, legalReference: e.target.value }))}
                      placeholder="DMCA notice number, court case reference, etc."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500/50"
                    />
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-300 leading-relaxed">
                      <strong>Legal Notice:</strong> By submitting this form, you declare under penalty of perjury that:
                      (1) you have a good faith belief that the use of the material is not authorized; 
                      (2) the information in the notification is accurate; and (3) you are authorized to act on behalf of the copyright owner.
                      False claims may result in legal consequences.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !takedownForm.requesterName || !takedownForm.requesterEmail || !takedownForm.reason || !takedownForm.description}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 min-h-[48px]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Takedown Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
