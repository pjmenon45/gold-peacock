import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { getContentBySlug, getRelatedContent, getContentItems } from '@/lib/content';
import { VideoPlayer } from '@/components/content/VideoPlayer';
import { MarkdownViewer } from '@/components/content/MarkdownViewer';
import { ContentCard } from '@/components/content/ContentCard';
import { Badge } from '@/components/ui/Badge';

interface VideoDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: VideoDetailPageProps): Promise<Metadata> {
  const item = await getContentBySlug(params.slug, 'video');
  if (!item) {
    return { title: 'Video Not Found' };
  }
  return {
    title: item.title,
    description: item.body.slice(0, 160).replace(/[#*`]/g, ''),
    openGraph: {
      title: item.title,
      images: item.thumbnail_url ? [item.thumbnail_url] : [],
    },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const item = await getContentBySlug(params.slug, 'video');

  if (!item) {
    notFound();
  }

  const related = await getRelatedContent(item.slug, 'video', 3);

  const formattedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const duration = item.metadata?.duration;

  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-secondary">
        <Link
          href="/videos"
          className="hover:text-accent transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Videos</span>
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <span className="text-foreground truncate max-w-[300px] sm:max-w-md">
          {item.title}
        </span>
      </nav>

      {/* Header Info */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
          {item.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-secondary pt-1">
          {formattedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}

          {duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{duration}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width Responsive Video Embed */}
      <div className="pt-2">
        <VideoPlayer
          mediaUrl={item.media_url}
          youtubeId={item.metadata?.youtubeId}
          thumbnailUrl={item.thumbnail_url}
          title={item.title}
        />
      </div>

      {/* Show Notes / Description */}
      <div className="border-t border-border pt-8 mt-8">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-4">
          Show Notes & Overview
        </h2>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <MarkdownViewer content={item.body} />
        </div>
      </div>

      {/* Related Videos Section */}
      {related.length > 0 && (
        <div className="border-t border-border pt-12 mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              More Videos
            </h2>
            <Link
              href="/videos"
              className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              View all videos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((v) => (
              <ContentCard key={v.id} item={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
