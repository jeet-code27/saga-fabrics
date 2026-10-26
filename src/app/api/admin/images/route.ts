import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { deleteImages, saveImage, UPLOADED_PREFIX } from '@/lib/imageStore';

const ALLOWED = ['image/webp', 'image/jpeg', 'image/png'];
const MAX_BYTES = 4 * 1024 * 1024;

// Upload one photo (the admin compresses it in the browser first).
export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received' }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Only JPG, PNG or WEBP photos' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Photo is too large (max 4 MB)' }, { status: 400 });
  try {
    const url = await saveImage(Buffer.from(await file.arrayBuffer()), file.type, file.name || 'photo');
    return NextResponse.json({ url });
  } catch (err) {
    console.error('[admin images] upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// Clean up photos uploaded in a form that was then cancelled.
export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const { urls } = await request.json().catch(() => ({ urls: [] }));
  if (Array.isArray(urls)) {
    await deleteImages(urls.filter((u): u is string => typeof u === 'string' && u.startsWith(UPLOADED_PREFIX)));
  }
  return NextResponse.json({ success: true });
}
