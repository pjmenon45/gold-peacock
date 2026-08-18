'use client';

import React, { useState, useMemo } from 'react';
import { ContentItem } from '@/types';
import { ContentCard } from '@/components/content/ContentCard';
import { FilterPills } from '@/components/content/FilterPills';
import { Video } from 'lucide-react';

interface VideosListingClientProps {
  initialVideos: ContentItem[];
  allTags: string[];
}

export function VideosListingClient({
  initialVideos,
  allTags,
}: VideosListingClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredVideos = useMemo(() => {
    if (!selectedTag) return initialVideos;
    return initialVideos.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
    );
  }, [initialVideos, selectedTag]);

  return (
    <div className="space-y-8">
      {/* Filter and Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <FilterPills
          tags={allTags}
          activeTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
        <div className="text-xs text-secondary font-medium">
          Showing {filteredVideos.length}{' '}
          {filteredVideos.length === 1 ? 'video' : 'videos'}
        </div>
      </div>

      {/* Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, idx) => (
            <ContentCard key={video.id} item={video} priority={idx < 3} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border bg-background-soft/50">
          <Video className="h-10 w-10 text-secondary/40 mb-3" />
          <p className="text-sm font-medium text-foreground">No videos found</p>
          <p className="text-xs text-secondary mt-1">
            Try clearing your tag filter to see all videos.
          </p>
        </div>
      )}
    </div>
  );
}
