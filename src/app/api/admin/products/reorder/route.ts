import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { reorderProducts } from '@/lib/productStore';
import { refreshStore } from '@/lib/refreshStore';

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const { ids } = await request.json().catch(() => ({ ids: null }));
  if (!Array.isArray(ids) || !ids.every((x) => typeof x === 'string')) {
    return NextResponse.json({ error: 'ids must be a list' }, { status: 400 });
  }
  try {
    await reorderProducts(ids);
    refreshStore();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin products] reorder failed:', err);
    return NextResponse.json({ error: 'Could not save the new order' }, { status: 500 });
  }
}
