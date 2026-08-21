'use client';

import React from 'react';

interface VideoPlayerProps {
  mediaUrl?: string | null;
  youtubeId?: string | null;
  thumbnailUrl?: string | null;
  title: string;
}

export function VideoPlayer({ mediaUrl, youtubeId, thumbnailUrl, title }: VideoPlayerProps) {
  // Helper to extract YouTube video ID from various URL formats
  const extractYouTubeId = (url?: string | null): string | null => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = youtubeId || extractYouTubeId(mediaUrl);

  // If YouTube video ID is available, render embedded YouTube player
  if (videoId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  // If direct video stream or drive video file is present, render responsive HTML5 player
  if (mediaUrl) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-lg flex items-center justify-center">
        <video
          src={mediaUrl}
          controls
          poster={thumbnailUrl || undefined}
          playsInline
          className="h-full w-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-background-soft text-secondary text-sm">
      Video stream not available
    </div>
  );
}
