'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  return (
    <article
      className={`prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-accent prose-blockquote:text-secondary prose-blockquote:italic prose-pre:bg-background-soft prose-pre:border prose-pre:border-border prose-pre:text-foreground prose-img:rounded-2xl ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-8 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mt-8 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground mt-6 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-base text-foreground/90 leading-relaxed mb-5" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 space-y-2 mb-5 text-foreground/90 leading-relaxed" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 space-y-2 mb-5 text-foreground/90 leading-relaxed" {...props} />
          ),
          li: ({ node, ...props }) => <li className="text-base" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-2 border-accent pl-4 my-6 italic text-secondary text-base bg-background-soft/50 py-2 rounded-r-lg"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="rounded-md bg-background-soft px-1.5 py-0.5 font-mono text-xs text-accent font-medium border border-border/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="overflow-x-auto rounded-xl border border-border bg-background-soft p-4 text-xs font-mono text-foreground leading-relaxed my-6">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
