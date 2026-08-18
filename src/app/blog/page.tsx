import React from 'react';
import { Metadata } from 'next';
import { getContentItems } from '@/lib/content';
import { BlogListingClient } from './BlogListingClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Essays on autonomous AI systems, software craftsmanship, architecture, and design.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getContentItems({ type: 'blog', status: 'published' });

  // Collect unique tags
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  const allTags = Array.from(tagSet);

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Blog
        </h1>
        <p className="text-base text-secondary leading-relaxed">
          Essays on agentic architectures, minimalist interface design, and modern software engineering.
        </p>
      </div>

      {/* Interactive Listing */}
      <BlogListingClient initialPosts={posts} allTags={allTags} />
    </div>
  );
}
