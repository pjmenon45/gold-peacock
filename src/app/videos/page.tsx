import React from 'react';
import { Metadata } from 'next';
import { getContentItems } from '@/lib/content';
import { VideosListingClient } from './VideosListingClient';

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Technical breakdowns, system architecture deep dives, and video essays.',
};

export const revalidate = 60;

export default async function VideosPage() {
  const videos = await getContentItems({ type: 'video', status: 'published' });

  // Collect all unique tags
  const tagSet = new Set<string>();
  videos.forEach((v) => v.tags.forEach((t) => tagSet.add(t)));
  const allTags = Array.from(tagSet);

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Videos
        </h1>
        <p className="text-base text-secondary leading-relaxed">
          In-depth tutorials, system engineering breakdowns, and architectural walkthroughs.
        </p>
      </div>

      {/* Interactive Listing */}
      <VideosListingClient initialVideos={videos} allTags={allTags} />
    </div>
  );
}
