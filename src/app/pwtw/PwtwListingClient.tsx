'use client';

import React, { useState, useMemo } from 'react';
import { ContentItem } from '@/types';
import { ContentCard } from '@/components/content/ContentCard';
import { FilterPills } from '@/components/content/FilterPills';
import { Camera } from 'lucide-react';

interface PwtwListingClientProps {
  initialPhotos: ContentItem[];
  allTags: string[];
}

export function PwtwListingClient({
  initialPhotos,
  allTags,
}: PwtwListingClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPhotos = useMemo(() => {
    if (!selectedTag) return initialPhotos;
    return initialPhotos.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
    );
  }, [initialPhotos, selectedTag]);

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
          Showing {filteredPhotos.length}{' '}
          {filteredPhotos.length === 1 ? 'visual story' : 'visual stories'}
        </div>
      </div>

      {/* Image-First Gallery Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <ContentCard key={photo.id} item={photo} priority={idx < 3} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border bg-background-soft/50">
          <Camera className="h-10 w-10 text-secondary/40 mb-3" />
          <p className="text-sm font-medium text-foreground">No photos found</p>
          <p className="text-xs text-secondary mt-1">
            Try selecting a different tag to explore photography.
          </p>
        </div>
      )}
    </div>
  );
}
