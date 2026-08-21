// RASHID LEAKS - Custom Video Player Component
// Full-featured HTML5 video player with Android Back button support

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  PictureInPicture2,
  SkipBack,
  SkipForward,
  Loader2
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useBackNavigation } from '@/hooks/useBackNavigation';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  /** Auto-play on mount */
  autoPlay?: boolean;
  /** Show controls */
  showControls?: boolean;
  /** Callback when fullscreen state changes */
  onFullscreenChange?: (isFullscreen: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

interface QualityOption {
  label: string;
  src?: string;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
const QUALITY_OPTIONS: QualityOption[] = [
  { label: 'Auto' },
  { label: '1080p' },
  { label: '720p' },
  { label: '480p' },
  { label: '360p' },
];

export function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  showControls = true,
  onFullscreenChange,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [hasError, setHasError] = useState(false);

  // UI hide timeout
  const uiTimeoutRef = useRef<NodeJS.Timeout>();

  // Android Back navigation for fullscreen
  const { openOverlay, closeOverlay } = useBackNavigation({
    pageKey: `video-${src}`,
    isFullscreen,
  });

  // Format time to MM:SS or H:MM:SS
  const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return '0:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Reset UI visibility timeout
  const resetUITimeout = useCallback(() => {
    setShowUI(true);
    
    if (uiTimeoutRef.current) {
      clearTimeout(uiTimeoutRef.current);
    }
    
    if (isPlaying) {
      uiTimeoutRef.current = setTimeout(() => {
        setShowUI(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Handle video click/tap to toggle play
  const handleVideoClick = useCallback(() => {
    togglePlay();
    resetUITimeout();
  }, [togglePlay, resetUITimeout]);

  // Seek handler
  const handleSeek = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    const time = value[0];
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Volume change handler
  const handleVolumeChange = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0];
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 1;
      setIsMuted(false);
      setVolume(volume || 1);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        openOverlay('fullscreen', 'video-player');
        onFullscreenChange?.(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        closeOverlay();
        onFullscreenChange?.(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [openOverlay, closeOverlay, onFullscreenChange]);

  // Picture in Picture
  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('PiP error:', error);
    }
  }, []);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleError = () => setHasError(true);
    const handleFullscreenChange = () => {
      const fsState = !!document.fullscreenElement;
      setIsFullscreen(fsState);
      if (!fsState) {
        closeOverlay();
        onFullscreenChange?.(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [closeOverlay, onFullscreenChange]);

  // Auto-play on mount
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [autoPlay]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          videoRef.current.currentTime -= 10;
          break;
        case 'arrowright':
          e.preventDefault();
          videoRef.current.currentTime += 10;
          break;
        case 'arrowup':
          e.preventDefault();
          videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, toggleMute]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (uiTimeoutRef.current) {
        clearTimeout(uiTimeoutRef.current);
      }
    };
  }, []);

  // Error state
  if (hasError) {
    return (
      <div className={cn("video-container flex items-center justify-center bg-black", className)}>
        <div className="text-center p-4">
          <p className="text-red-400 text-lg font-medium">Failed to load video</p>
          <p className="text-gray-400 text-sm mt-2">Please try again later</p>
          <Button 
            variant="outline" 
            className="mt-4 border-white/20"
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "video-container relative group bg-black overflow-hidden",
        className
      )}
      onMouseMove={resetUITimeout}
      onTouchStart={resetUITimeout}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
        onClick={handleVideoClick}
        preload="metadata"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Play/Pause Overlay Button */}
      {!isPlaying && !isBuffering && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center group/play"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform group-hover/play:scale-110">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="white" />
          </div>
        </button>
      )}

      {/* Controls */}
      {showControls && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-3 sm:p-4 transition-opacity duration-300",
            showUI ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Progress Bar */}
          <div className="mb-3 group/progress">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="cursor-pointer [&_[role=slider]]:h-1 [&_[role=slider]]:bg-white/30 [&_[role=slider]]:data-[state=hover]:bg-red-500 [&_[role=slider]>span]:bg-red-500"
            />
            {/* Buffered progress indicator could go here */}
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Left Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="h-9 w-9 sm:h-10 sm:w-10 text-white hover:bg-white/20 touch-target"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" fill="white" />}
              </Button>

              {/* Skip buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { if (videoRef.current) videoRef.current.currentTime -= 10; }}
                className="hidden sm:flex h-9 w-9 text-white hover:bg-white/20"
                aria-label="Rewind 10s"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10; }}
                className="hidden sm:flex h-9 w-9 text-white hover:bg-white/20"
                aria-label="Forward 10s"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              {/* Volume */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-9 w-9 sm:h-10 sm:w-10 text-white hover:bg-white/20 touch-target"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.05}
                  onValueChange={handleVolumeChange}
                  className="hidden sm:flex w-20 [&_[role=slider]]:h-1 [&_[role=slider]]:bg-white/30 [&_[role=slider]>span]:bg-white"
                />
              </div>

              {/* Time Display */}
              <span className="text-xs sm:text-sm text-white font-mono tabular-nums hidden xs:inline">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1">
              {/* Playback Speed */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex h-8 px-2 text-xs text-white hover:bg-white/20 gap-1"
                  >
                    {playbackRate}x
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 min-w-[120px]">
                  {PLAYBACK_RATES.map((rate) => (
                    <DropdownMenuItem
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        if (videoRef.current) videoRef.current.playbackRate = rate;
                      }}
                      className={cn(
                        "cursor-pointer",
                        playbackRate === rate && "text-red-400"
                      )}
                    >
                      {rate}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Quality Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex h-8 px-2 text-xs text-white hover:bg-white/20 gap-1"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    {quality}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 min-w-[120px]">
                  {QUALITY_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.label}
                      onClick={() => setQuality(opt.label)}
                      className={cn(
                        "cursor-pointer",
                        quality === opt.label && "text-red-400"
                      )}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* PiP */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePiP}
                className="hidden md:flex h-9 w-9 text-white hover:bg-white/20"
                aria-label="Picture in Picture"
              >
                <PictureInPicture2 className="h-4 w-4" />
              </Button>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="h-9 w-9 sm:h-10 sm:w-10 text-white hover:bg-white/20 touch-target"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Title overlay at top */}
      {title && showUI && (
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <h3 className="text-white text-sm sm:text-base font-medium drop-shadow-lg line-clamp-2">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
