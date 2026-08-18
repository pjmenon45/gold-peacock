import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'secondary' | 'outline';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'default',
  className = '',
  size = 'md',
}: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  const variantClasses = {
    default: 'bg-background-soft text-secondary border border-border/80',
    accent: 'bg-accent/10 text-accent border border-accent/20 font-medium',
    secondary: 'bg-border/60 text-secondary',
    outline: 'border border-border text-secondary',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-normal tracking-tight transition-colors ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
