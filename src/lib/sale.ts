import { Product } from '@/types';

// Festive sale settings. Change the dates/text here and the whole site follows:
// announcement bar, hero, home banner, product badges, shop filter and bottom nav.
// Once `endsAt` passes, the sale styling switches off automatically.
export const SALE = {
  name: 'Diwali Sale',
  startsAt: '2026-10-15T00:00:00+05:30',
  endsAt: '2026-11-11T23:59:59+05:30',
  tagline: 'Festive prices on handcrafted suits, kurtis & jewellery',
};

export const isSaleLive = (now: Date = new Date()): boolean => {
  const t = now.getTime();
  return t >= new Date(SALE.startsAt).getTime() && t <= new Date(SALE.endsAt).getTime();
};

export const discountPercent = (p: Product): number =>
  p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

// Products that belong to the festive sale: clearance pieces plus the free-gift offers.
export const isSaleProduct = (p: Product): boolean =>
  p.tags.includes('End of Season Sale') ||
  p.tags.includes('Season End Sale') ||
  p.tags.includes('Special Offer');
