// RASHID LEAKS - Admin Panel Page

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  Video, 
  Flag,
  Shield,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/lib/store';
import { useBackNavigation } from '@/hooks/useBackNavigation';

// Mock admin data
const ADMIN_STATS = {
  totalUsers: 15420,
  totalVideos: 8940,
  pendingModeration: 45,
  openReports: 12,
  takedownRequests: 3,
  activeToday: 1234,
};

const PENDING_VIDEOS = [
  { id: '1', title: 'Pending Video 1', creator: 'user1', submittedAt: new Date(), status: 'PENDING' },
  { id: '2', title: 'Pending Video 2', creator: 'user2', submittedAt: new Date(), status: 'PENDING' },
];

const OPEN_REPORTS = [
  { id: 'r1', caseId: 'CASE-001', video: 'Reported Video', reason: 'COPYRIGHT', status: 'PENDING' },
  { id: 'r2', caseId: 'CASE-002', video: 'Another Report', reason: 'NON_CONSENSUAL', status: 'UNDER_REVIEW' },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('dashboard');

  useBackNavigation({ pageKey: 'admin' });

  // Check if user is admin/moderator
  const isAdmin = isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'MODERATOR');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a] border-white/10 text-center">
          <CardContent className="pt-8 pb-8">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-gray-400 mb-6">Sign in to access the admin panel</p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-red-500 to-pink-600">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a] border-red-500/20 text-center">
          <CardContent className="pt-8 pb-8">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-6">You don't have permission to access this area</p>
            <Button onClick={() => router.push('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-white touch-target min-h-[44px]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Shield className="w-7 h-7 text-yellow-500" />
              Admin Panel
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {user?.displayName || user?.username}
            </p>
          </div>

          <Badge 
            variant="secondary" 
            className={`ml-auto ${
              user?.role === 'ADMIN' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'
            }`}
          >
            {user?.role}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardContent className="p-4 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-lg font-bold text-white">{ADMIN_STATS.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardContent className="p-4 text-center">
              <Video className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-lg font-bold text-white">{ADMIN_STATS.totalVideos.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Videos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-yellow-500/20 border">
            <CardContent className="p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-lg font-bold text-white">{ADMIN_STATS.pendingModeration}</p>
              <p className="text-xs text-gray-500">Pending Review</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-red-500/20 border">
            <CardContent className="p-4 text-center">
              <Flag className="w-5 h-5 mx-auto mb-1 text-red-400" />
              <p className="text-lg font-bold text-white">{ADMIN_STATS.openReports}</p>
              <p className="text-xs text-gray-500">Open Reports</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-orange-500/20 border">
            <CardContent className="p-4 text-center">
              <FileText className="w-5 h-5 mx-auto mb-1 text-orange-400" />
              <p className="text-lg font-bold text-white">{ADMIN_STATS.takedownRequests}</p>
              <p className="text-xs text-gray-500">Takedowns</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardContent className="p-4 text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
              <p className="text-lg font-bold text-white">{ADMIN_STATS.activeToday.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Active Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#1a1a1a] border-white/10 w-full justify-start overflow-x-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-1" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="moderation" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-1" />
              Moderation Queue
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Flag className="w-4 h-4 mr-1" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-1" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Recent admin activity will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="mt-6">
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Pending Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Video</TableHead>
                      <TableHead className="text-gray-400">Creator</TableHead>
                      <TableHead className="text-gray-400">Submitted</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PENDING_VIDEOS.map((video) => (
                      <TableRow key={video.id} className="border-white/10">
                        <TableCell className="text-white font-medium">{video.title}</TableCell>
                        <TableCell className="text-gray-300">{video.creator}</TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(video.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Open Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Case ID</TableHead>
                      <TableHead className="text-gray-400">Video</TableHead>
                      <TableHead className="text-gray-400">Reason</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {OPEN_REPORTS.map((report) => (
                      <TableRow key={report.id} className="border-white/10">
                        <TableCell className="text-white font-mono text-sm">{report.caseId}</TableCell>
                        <TableCell className="text-white">{report.video}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                            {report.reason}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={
                            report.status === 'UNDER_REVIEW' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                          }>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="border-white/20 text-white">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card className="bg-[#1a1a1a] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">User management tools will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
