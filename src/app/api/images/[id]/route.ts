import { readImage } from '@/lib/imageStore';

// Public: serves product photos uploaded from the admin panel.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const img = await readImage(id);
    if (!img) return new Response('Not found', { status: 404 });
    return new Response(new Uint8Array(img.data), {
      headers: {
        'Content-Type': img.contentType,
        // Each upload gets a new id, so the file never changes.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('[images] read failed:', err);
    return new Response('Error', { status: 500 });
  }
}
