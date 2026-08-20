import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Clock, Camera, ArrowUpRight } from 'lucide-react';
import { ContentItem } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface ContentCardProps {
  item: ContentItem;
  variant?: 'default' | 'horizontal' | 'compact';
  priority?: boolean;
}

export function ContentCard({ item, variant = 'default', priority = false }: ContentCardProps) {
  // Determine URL path based on content type
  const detailHref = `/${item.type === 'video' ? 'videos' : item.type}/${item.slug}`;

  // Formatted date string
  const formattedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Extract metadata helpers
  const duration = item.metadata?.duration;
  const readTime = item.metadata?.readTime;
  const camera = item.metadata?.camera;
  const location = item.metadata?.location;

  // Render PWTW image-forward card
  if (item.type === 'pwtw') {
    return (
      <Link
        href={detailHref}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-accent/50 hover:shadow-md"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-background-soft/70 flex items-center justify-center p-2">
          {item.media_url || item.thumbnail_url ? (
            <Image
              src={item.media_url || item.thumbnail_url || ''}
              alt={item.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.02] p-1.5"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-background-soft text-secondary">
              <Camera className="h-8 w-8 opacity-40" />
            </div>
          )}

          {location && (
            <div className="absolute bottom-2.5 left-2.5 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-white">
              {location}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 text-xs text-secondary mb-2">
            <span>{formattedDate}</span>
            {camera && <span>{camera}</span>}
          </div>

          <h3 className="font-semibold text-foreground text-base tracking-tight group-hover:text-accent transition-colors line-clamp-2">
            {item.title}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} size="sm" variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  // Horizontal variant for featured list or compact layouts
  if (variant === 'horizontal') {
    return (
      <Link
        href={detailHref}
        className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-border bg-card transition-all duration-200 hover:border-accent/50 hover:shadow-sm"
      >
        <div className="relative aspect-video sm:w-56 shrink-0 overflow-hidden rounded-xl bg-background-soft">
          {item.thumbnail_url ? (
            <Image
              src={item.thumbnail_url}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, 224px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-secondary">
              <Clock className="h-6 w-6 opacity-40" />
            </div>
          )}

          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm group-hover:scale-110 transition-transform">
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 text-xs text-secondary mb-1.5">
              <Badge size="sm" variant="accent" className="capitalize">
                {item.type}
              </Badge>
              <span>•</span>
              <span>{formattedDate}</span>
              {duration && <span>• {duration}</span>}
              {readTime && <span>• {readTime}</span>}
            </div>

            <h3 className="font-semibold text-foreground text-base tracking-tight group-hover:text-accent transition-colors">
              {item.title}
            </h3>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  // Default standard grid card (Videos / Blog)
  return (
    <Link
      href={detailHref}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-accent/50 hover:shadow-md"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-background-soft">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-secondary">
            <Clock className="h-8 w-8 opacity-30" />
          </div>
        )}

        {/* Video play overlay badge */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md group-hover:scale-110 transition-transform">
              <Play className="h-4 w-4 fill-current ml-0.5 text-foreground" />
            </div>
            {duration && (
              <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                {duration}
              </span>
            )}
          </div>
        )}

        {/* Blog read time badge */}
        {item.type === 'blog' && readTime && (
          <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            {readTime}
          </span>
        )}
      </div>

      {/* Content body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-secondary mb-2">
          <span>{formattedDate}</span>
          <span className="capitalize text-[11px] font-medium tracking-wide text-secondary/80">
            {item.type}
          </span>
        </div>

        <h3 className="font-semibold text-foreground text-base tracking-tight leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {item.title}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/40 mt-auto">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
