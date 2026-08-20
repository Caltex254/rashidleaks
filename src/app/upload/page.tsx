// RASHID LEAKS - Upload Page
// For verified creators to upload new content

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload as UploadIcon, 
  X, 
  FileVideo,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  FolderOpen,
  Eye,
  Lock,
  Globe,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import { useAuthStore } from '@/lib/store';

const CATEGORIES = [
  'Amateur', 'Professional', 'Solo', 'Couple', 'POV', 'Roleplay',
  'Vintage', 'HD/4K', 'Other'
];

const VISIBILITY_OPTIONS = [
  { value: 'PUBLIC', label: 'Public', icon: Globe, description: 'Visible to everyone' },
  { value: 'UNLISTED', label: 'Unlisted', icon: LinkIcon, description: 'Only accessible via link' },
  { value: 'PRIVATE', label: 'Private', icon: Lock, description: 'Only you can see' },
  { value: 'DRAFT', label: 'Draft', icon: Clock, description: 'Save as draft' },
];

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [contentWarnings, setContentWarnings] = useState<string[]>([]);
  
  // Consent checkboxes
  const [consentAdult, setConsentAdult] = useState(false);
  const [consentOwnership, setConsentOwnership] = useState(false);
  const [consentParticipants, setConsentParticipants] = useState(false);
  const [consentRecording, setConsentRecording] = useState(false);
  const [consentDistribution, setConsentDistribution] = useState(false);
  
  // File upload state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  useBackNavigation({ pageKey: 'upload' });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/upload');
    }
  }, [isAuthenticated, router]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setErrors(prev => ({ ...prev, videoFile: 'Please select a valid video file' }));
        return;
      }
      
      // Validate file size (max 2GB)
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, videoFile: 'File size must be less than 2GB' }));
        return;
      }

      setVideoFile(file);
      setErrors(prev => ({ ...prev, videoFile: '' }));
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, thumbnailFile: 'Please select a valid image file' }));
        return;
      }
      setThumbnailFile(file);
      setErrors(prev => ({ ...prev, thumbnailFile: '' }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (title.length > 200) newErrors.title = 'Title must be under 200 characters';
    
    if (!category) newErrors.category = 'Please select a category';
    
    if (!videoFile) newErrors.videoFile = 'Please select a video file';
    
    // Consent validations
    if (!consentAdult) newErrors.consentAdult = 'Required';
    if (!consentOwnership) newErrors.consentOwnership = 'Required';
    if (!consentParticipants) newErrors.consentParticipants = 'Required';
    if (!consentRecording) newErrors.consentRecording = 'Required';
    if (!consentDistribution) newErrors.consentDistribution = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      // In real app: upload to API
      // const formData = new FormData();
      // formData.append('video', videoFile);
      // formData.append('thumbnail', thumbnailFile);
      // formData.append('data', JSON.stringify({...}));
      // await fetch('/api/upload', { method: 'POST', body: formData });

      setUploadComplete(true);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, submit: 'Upload failed. Please try again.' }));
    } finally {
      setIsUploading(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a] border-white/10">
          <CardHeader className="text-center">
            <UploadIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-white">Sign In to Upload</CardTitle>
            <CardDescription className="text-gray-400">
              You need to be logged in to upload content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => router.push('/login?callbackUrl=/upload')}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600"
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/register')}
              className="w-full border-white/20"
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1a1a1a] border-green-500/30 text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Upload Successful!</h2>
            <p className="text-gray-400 mb-6">
              Your video has been uploaded and is being processed. It will appear on your profile once approved.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push(`/creator/${user?.username}`)} className="w-full">
                View My Videos
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full border-white/20">
                Upload Another Video
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
          <p className="text-gray-400">Share your content with the RASHID LEAKS community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Video Upload Section */}
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileVideo className="w-5 h-5 text-red-400" />
                Video File
              </CardTitle>
              <CardDescription className="text-gray-400">
                MP4, WebM, or MOV. Max 2GB. Recommended: 1080p or higher.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!videoFile ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-red-500/50 hover:bg-white/5 transition-colors">
                  <UploadIcon className="w-10 h-10 text-gray-500 mb-3" />
                  <p className="text-sm text-gray-400 mb-1">
                    <span className="text-red-400 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">MP4, WebM, MOV up to 2GB</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <FileVideo className="w-8 h-8 text-red-400" />
                      <div>
                        <p className="font-medium text-white">{videoFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoFile(null)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Uploading...</span>
                        <span className="text-white">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
              
              {errors.videoFile && (
                <p className="text-sm text-red-400 mt-2">{errors.videoFile}</p>
              )}
            </CardContent>
          </Card>

          {/* Thumbnail Upload */}
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                Thumbnail (Optional)
              </CardTitle>
              <CardDescription className="text-gray-400">
                JPG or PNG. Recommended: 1280x720 or larger.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!thumbnailFile ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                  <p className="text-sm text-gray-400">
                    <span className="text-blue-400 font-medium">Upload thumbnail</span> or auto-generate
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-6 h-6 text-blue-400" />
                    <span className="text-sm text-white">{thumbnailFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setThumbnailFile(null)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Details */}
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your video"
                  maxLength={200}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50"
                />
                {errors.title && <p className="text-sm text-red-400">{errors.title}</p>}
                <p className="text-xs text-gray-500">{title.length}/200 characters</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your video content..."
                  rows={4}
                  maxLength={2000}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50 resize-none"
                />
                <p className="text-xs text-gray-500">{description.length}/2000 characters</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-400">{errors.category}</p>}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tags..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-red-500/50"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" className="border-white/20">
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/10 text-gray-300 gap-1">
                        #{tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)}>
                          <X className="w-3 h-3 hover:text-red-400" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label className="text-gray-300">Visibility</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setVisibility(opt.value)}
                      className={`p-3 rounded-lg border transition-colors ${
                        visibility === opt.value
                          ? 'border-red-500 bg-red-500/10 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <opt.icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium block">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Section - CRITICAL for adult content */}
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Required Consents & Declarations
              </CardTitle>
              <CardDescription className="text-gray-400">
                You must confirm all of the following before uploading. This is required by law.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Checkbox
                  checked={consentAdult}
                  onCheckedChange={(checked) => setConsentAdult(checked === true)}
                  className="mt-0.5 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  I confirm that all individuals appearing in this video are at least 18 years old (or the age of majority in their jurisdiction).
                </span>
              </label>
              {errors.consentAdult && <p className="text-sm text-red-400 ml-6">{errors.consentAdult}</p>}

              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Checkbox
                  checked={consentOwnership}
                  onCheckedChange={(checked) => setConsentOwnership(checked === true)}
                  className="mt-0.5 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  I confirm that I own or have the necessary rights and licenses to all content in this video, including music, images, and any other copyrighted material.
                </span>
              </label>
              {errors.consentOwnership && <p className="text-sm text-red-400 ml-6">{errors.consentOwnership}</p>}

              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Checkbox
                  checked={consentParticipants}
                  onCheckedChange={(checked) => setConsentParticipants(checked === true)}
                  className="mt-0.5 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  I confirm that all participants in this video have given their informed consent to be filmed and for the content to be distributed on this platform.
                </span>
              </label>
              {errors.consentParticipants && <p className="text-sm text-red-400 ml-6">{errors.consentParticipants}</p>}

              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Checkbox
                  checked={consentRecording}
                  onCheckedChange={(checked) => setConsentRecording(checked === true)}
                  className="mt-0.5 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  I confirm that this content was recorded legally and does not violate any privacy laws or regulations.
                </span>
              </label>
              {errors.consentRecording && <p className="text-sm text-red-400 ml-6">{errors.consentRecording}</p>}

              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Checkbox
                  checked={consentDistribution}
                  onCheckedChange={(checked) => setConsentDistribution(checked === true)}
                  className="mt-0.5 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  I understand that this content will be moderated and may be removed if it violates our Community Guidelines or Terms of Service.
                </span>
              </label>
              {errors.consentDistribution && <p className="text-sm text-red-400 ml-6">{errors.consentDistribution}</p>}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 py-4 text-base font-semibold min-h-[52px]"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Upload Video
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-white/20 text-white hover:bg-white/10 min-h-[52px]"
            >
              Cancel
            </Button>
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{errors.submit}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
