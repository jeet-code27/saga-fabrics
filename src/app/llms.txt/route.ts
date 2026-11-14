import { buildLlmsTxt } from '@/lib/llms';

// Rebuilt at most once an hour, and right after any admin product change.
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
