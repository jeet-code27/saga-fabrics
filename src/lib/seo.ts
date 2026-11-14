import { Product } from '@/types';
import { discountPercent } from '@/lib/sale';

// Search-result title and description for a product page, built from the product's own
// data so every page gets unique text and new products added from /admin are covered too.

const BRAND = ' | Saga Fabrics';
const TITLE_MAX = 65;
const DESC_MAX = 160;

const clip = (s: string, max: number) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,.;:–-]+$/, '');
};

// Each step trims a little more, and only runs while the title is still too long.
const TITLE_STEPS: ((t: string) => string)[] = [
  (t) => t.replace(/^(Hand Embroidered|Handcrafted)\s+/i, ''),
  (t) => t.replace(/\s*\(Size 42 \/ XL\)/, ', Size 42/XL'),
  (t) => t.replace(/\s+(Hand Embroidered|Hand-Done)\s+/gi, ' '),
  (t) => t.replace(/\s+with Stone Work$/i, ''),
  (t) => t.replace(/\s+3-Piece\s+/i, ' '),
  (t) => t.replace(/\s+Set$/i, ''),
];

export function productSeoTitle(p: Product): string {
  let t = p.title.trim();
  for (const step of TITLE_STEPS) {
    if ((t + BRAND).length <= TITLE_MAX) break;
    t = step(t);
  }
  return clip(t, TITLE_MAX - BRAND.length) + BRAND;
}

export function productMetaDescription(p: Product): string {
  const off = discountPercent(p);
  const price = `₹${p.price.toLocaleString('en-IN')}${off > 0 ? ` (${off}% off)` : ''}`;
  const head = `${p.title.trim().replace(/[.\s]+$/, '')}.`;
  const tail = ` ${price}. Free shipping across India.`;
  // Add whole subtitle parts ("Size L", "Free earrings included", …) while they fit, never half a phrase.
  const room = DESC_MAX - head.length - tail.length - 2;
  const parts: string[] = [];
  const candidates = [...p.subtitle.split('•'), p.fabric, p.craft]
    .map((s) => (s || '').trim().replace(/[.\s]+$/, ''))
    .filter(Boolean);
  for (const part of candidates) {
    if (parts.join(', ').length >= 60) break;
    if ([...parts, part].join(', ').length <= room) parts.push(part);
  }
  const middle = parts.length ? ` ${parts.join(', ')}.` : '';
  return clip(`${head}${middle}${tail}`, DESC_MAX);
}
