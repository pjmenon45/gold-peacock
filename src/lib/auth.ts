import { NextRequest } from 'next/server';

/**
 * Validates whether the incoming NextRequest contains the authorized ADMIN_API_KEY.
 * Accepts 'Authorization: Bearer <token>' or 'x-api-key: <token>'.
 */
export function validateAdminAuth(request: NextRequest): { authorized: boolean; error?: string } {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    return {
      authorized: false,
      error: 'ADMIN_API_KEY environment variable is not configured on the server.',
    };
  }

  // 1. Check Authorization header (Bearer <token>)
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      if (parts[1] === adminApiKey) {
        return { authorized: true };
      }
    }
  }

  // 2. Check x-api-key header
  const xApiKey = request.headers.get('x-api-key');
  if (xApiKey && xApiKey === adminApiKey) {
    return { authorized: true };
  }

  // 3. Optional query parameter for browser testing / automation
  const { searchParams } = new URL(request.url);
  const queryApiKey = searchParams.get('apiKey');
  if (queryApiKey && queryApiKey === adminApiKey) {
    return { authorized: true };
  }

  return {
    authorized: false,
    error: 'Unauthorized: Invalid or missing Admin API key.',
  };
}
