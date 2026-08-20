import React from 'react';
import Image from 'next/image';
import { Camera, MapPin, Sliders, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface PhotoHeroProps {
  imageUrl: string;
  title: string;
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: string;
    location?: string;
  } | null;
}

export function PhotoHero({ imageUrl, title, metadata }: PhotoHeroProps) {
  return (
    <div className="space-y-4">
      {/* High-res Photo Container */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-background-soft/70 shadow-sm flex items-center justify-center">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full max-h-[75vh] p-2 sm:p-4">
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Metadata Pill Bar */}
      {metadata && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-secondary">
          {metadata.location && (
            <Badge size="md" variant="default" className="gap-1.5 py-1 px-3">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span>{metadata.location}</span>
            </Badge>
          )}

          {metadata.camera && (
            <Badge size="md" variant="default" className="gap-1.5 py-1 px-3">
              <Camera className="h-3.5 w-3.5 text-secondary" />
              <span>{metadata.camera}</span>
            </Badge>
          )}

          {metadata.lens && (
            <Badge size="md" variant="default" className="gap-1.5 py-1 px-3">
              <Eye className="h-3.5 w-3.5 text-secondary" />
              <span>{metadata.lens}</span>
            </Badge>
          )}

          {metadata.settings && (
            <Badge size="md" variant="default" className="gap-1.5 py-1 px-3">
              <Sliders className="h-3.5 w-3.5 text-secondary" />
              <span>{metadata.settings}</span>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
