import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { createProduct, getAllProductsFresh } from '@/lib/productStore';
import { parseProductInput } from '@/lib/productInput';
import { refreshStore } from '@/lib/refreshStore';

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    return NextResponse.json({ products: await getAllProductsFresh() });
  } catch (err) {
    console.error('[admin products] list failed:', err);
    return NextResponse.json({ error: 'Could not load products from the database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  const parsed = parseProductInput(await request.json().catch(() => ({})));
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const product = await createProduct(parsed.product);
    refreshStore();
    return NextResponse.json({ product });
  } catch (err) {
    console.error('[admin products] create failed:', err);
    return NextResponse.json({ error: 'Could not save the product' }, { status: 500 });
  }
}
