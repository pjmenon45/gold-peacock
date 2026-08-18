import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createContactSubmission } from '@/lib/content';

const ContactSubmissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().optional().nullable(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

/**
 * POST /api/contact
 * Handles contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = ContactSubmissionSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const submission = await createContactSubmission(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! I will get back to you soon.',
        data: submission,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to submit contact form. Please try again.',
      },
      { status: 500 }
    );
  }
}
