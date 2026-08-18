import React from 'react';
import { Metadata } from 'next';
import { Mail, MapPin, Sparkles } from 'lucide-react';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for software engineering, advisory, or visual collaborations.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 sm:px-8 py-12 sm:py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-soft px-3 py-1 text-xs text-secondary">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span>Get in touch</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Let’s start a conversation.
        </h1>

        <p className="text-base text-secondary leading-relaxed">
          Whether you have a question about agentic architectures, want to collaborate on open-source, or just want to say hi—I’d love to hear from you.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto">
        <ContactForm />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-6">
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background-soft/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-accent">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-secondary">Direct Inquiries</p>
            <p className="text-sm font-medium text-foreground">pjmenon45@gmail.com</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background-soft/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-accent">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-secondary">Location</p>
            <p className="text-sm font-medium text-foreground">San Francisco, CA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
