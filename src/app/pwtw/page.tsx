import React from 'react';
import { Metadata } from 'next';
import { getContentItems } from '@/lib/content';
import { PwtwListingClient } from './PwtwListingClient';

export const metadata: Metadata = {
  title: 'PWTW — Picture Worth Thousand Words',
  description: 'Visual photography essays and contemplative stories from around the world.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PwtwPage() {
  const photos = await getContentItems({ type: 'pwtw', status: 'published' });

  // Collect unique tags
  const tagSet = new Set<string>();
  photos.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  const allTags = Array.from(tagSet);

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
          <span>PWTW Gallery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Picture Worth Thousand Words
        </h1>
        <p className="text-base text-secondary leading-relaxed">
          High-resolution photography exploring architecture, landscapes, and contemplative moments.
        </p>
      </div>

      {/* Interactive Gallery */}
      <PwtwListingClient initialPhotos={photos} allTags={allTags} />
    </div>
  );
}
