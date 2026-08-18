'use client';

import React from 'react';

interface FilterPillsProps {
  tags: string[];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  className?: string;
}

export function FilterPills({
  tags,
  activeTag,
  onSelectTag,
  className = '',
}: FilterPillsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button
        onClick={() => onSelectTag(null)}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
          activeTag === null
            ? 'bg-accent text-white shadow-sm'
            : 'bg-background-soft text-secondary hover:text-foreground border border-border'
        }`}
      >
        All
      </button>

      {tags.map((tag) => {
        const isActive = activeTag === tag;
        return (
          <button
            key={tag}
            onClick={() => onSelectTag(isActive ? null : tag)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isActive
                ? 'bg-accent text-white shadow-sm'
                : 'bg-background-soft text-secondary hover:text-foreground border border-border'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
