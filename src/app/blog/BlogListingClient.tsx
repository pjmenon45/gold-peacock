'use client';

import React, { useState, useMemo } from 'react';
import { ContentItem } from '@/types';
import { ContentCard } from '@/components/content/ContentCard';
import { FilterPills } from '@/components/content/FilterPills';
import { BookOpen } from 'lucide-react';

interface BlogListingClientProps {
  initialPosts: ContentItem[];
  allTags: string[];
}

export function BlogListingClient({
  initialPosts,
  allTags,
}: BlogListingClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return initialPosts;
    return initialPosts.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
    );
  }, [initialPosts, selectedTag]);

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
          Showing {filteredPosts.length}{' '}
          {filteredPosts.length === 1 ? 'essay' : 'essays'}
        </div>
      </div>

      {/* Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, idx) => (
            <ContentCard key={post.id} item={post} priority={idx < 3} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border bg-background-soft/50">
          <BookOpen className="h-10 w-10 text-secondary/40 mb-3" />
          <p className="text-sm font-medium text-foreground">No posts found</p>
          <p className="text-xs text-secondary mt-1">
            Try selecting a different tag filter to view articles.
          </p>
        </div>
      )}
    </div>
  );
}
