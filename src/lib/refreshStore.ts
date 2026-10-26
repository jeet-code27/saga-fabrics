import { revalidatePath, revalidateTag } from 'next/cache';
import { PRODUCTS_TAG } from '@/lib/productStore';

// After any admin change: drop the cached product list and rebuild every page on next visit.
export function refreshStore(): void {
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
}
