import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { getOrders } from '@/lib/db';

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
