import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { deleteProduct, getAllProductsFresh, updateProduct } from '@/lib/productStore';
import { parseProductInput } from '@/lib/productInput';
import { deleteImages } from '@/lib/imageStore';
import { refreshStore } from '@/lib/refreshStore';

type Ctx = { params: Promise<{ id: string }> };

// Full edit from the form, or a quick change (e.g. { inStock: false }) from the list.
export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  try {
    const existing = (await getAllProductsFresh()).find((p) => p.id === id);
    if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const parsed = parseProductInput({ ...existing, ...body });
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const product = await updateProduct(id, parsed.product);
    // Photos removed in this edit are deleted from storage.
    const removed = existing.images.filter((url) => !parsed.product.images.includes(url));
    await deleteImages(removed);
    refreshStore();
    return NextResponse.json({ product });
  } catch (err) {
    console.error('[admin products] update failed:', err);
    return NextResponse.json({ error: 'Could not update the product' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  try {
    const removed = await deleteProduct(id);
    if (!removed) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    await deleteImages(removed.images);
    refreshStore();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin products] delete failed:', err);
    return NextResponse.json({ error: 'Could not delete the product' }, { status: 500 });
  }
}
