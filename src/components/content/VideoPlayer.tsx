'use client';

import React from 'react';

interface VideoPlayerProps {
  mediaUrl?: string | null;
  youtubeId?: string | null;
  title: string;
}

export function VideoPlayer({ mediaUrl, youtubeId, title }: VideoPlayerProps) {
  // Helper to extract YouTube video ID from various URL formats
  const extractYouTubeId = (url?: string | null): string | null => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = youtubeId || extractYouTubeId(mediaUrl);

  if (!videoId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-background-soft text-secondary text-sm">
        Video embed not available
      </div>
    );
  }

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
