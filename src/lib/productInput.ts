import { Product } from '@/types';

// Shared between the admin form and the API so both agree on what a valid product is.

export type ProductType = 'Stitched' | 'Unstitched' | 'Jewellery';

export const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];

export const CATEGORY_TAGS = ['Short Kurti', 'Long Kurti', 'Silk Kurti', 'Cotton Kurti', 'Stitched Suit', '3-Piece Set', 'Chikankari'];

export const OFFER_TAGS: { tag: string; label: string }[] = [
  { tag: 'Special Offer', label: 'In Diwali Sale' },
  { tag: 'Free Jhumka', label: 'Free jhumkas' },
  { tag: 'Free Bangles', label: 'Free bangles' },
  { tag: 'Bestseller', label: 'Bestseller' },
  { tag: 'New Arrival', label: 'New arrival' },
];

const TYPE_TAGS = ['Stitched', 'Unstitched', 'Jewellery', 'Anti Tarnish Jewellery', 'Artificial Jewellery', 'Ready to Wear'];

export function productTypeOf(p: Pick<Product, 'tags' | 'sizes'>): ProductType {
  if (p.tags.some((t) => t === 'Jewellery' || t === 'Anti Tarnish Jewellery' || t === 'Artificial Jewellery')) return 'Jewellery';
  if (p.tags.includes('Unstitched') || p.sizes?.includes('Unstitched')) return 'Unstitched';
  return 'Stitched';
}

/** Rebuilds tags and sizes from the form's type / category / offer choices, keeping any other tags. */
export function buildTagsAndSizes(
  type: ProductType,
  sizes: string[],
  categories: string[],
  offers: string[],
  previousTags: string[] = []
): { tags: string[]; sizes: string[] } {
  // Old clearance tags are folded into the single "In Diwali Sale" switch.
  const managed = new Set([...TYPE_TAGS, ...CATEGORY_TAGS, ...OFFER_TAGS.map((o) => o.tag), 'End of Season Sale', 'Season End Sale']);
  const kept = previousTags.filter((t) => !managed.has(t));
  const typeTags = type === 'Jewellery' ? ['Jewellery', 'Anti Tarnish Jewellery'] : type === 'Unstitched' ? ['Unstitched'] : ['Stitched'];
  const tags = Array.from(new Set([...typeTags, ...categories, ...offers, ...kept]));
  const cleanSizes =
    type === 'Stitched'
      ? ALL_SIZES.filter((s) => sizes.includes(s)).concat(sizes.filter((s) => !ALL_SIZES.includes(s) && s !== 'Unstitched'))
      : type === 'Unstitched'
      ? ['Unstitched']
      : [];
  return { tags, sizes: cleanSizes };
}

const str = (v: unknown, max = 4000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v: unknown) => (typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN);
const strList = (v: unknown, max = 40) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').map((x) => x.trim()).filter(Boolean).slice(0, max) : [];

/** Validates a full product body from the admin. Returns an error message or the clean product (without id). */
export function parseProductInput(body: Record<string, unknown>): { error: string } | { product: Omit<Product, 'id'> } {
  const title = str(body.title, 200);
  const price = Math.round(num(body.price));
  let originalPrice = Math.round(num(body.originalPrice));
  const images = strList(body.images, 12).filter((u) => u.startsWith('/'));
  const tags = strList(body.tags, 40);
  const sizes = strList(body.sizes, 20);

  if (!title) return { error: 'Product name is required' };
  if (!Number.isFinite(price) || price <= 0) return { error: 'Enter a valid selling price' };
  if (!Number.isFinite(originalPrice) || originalPrice < price) originalPrice = price;
  if (images.length === 0) return { error: 'Add at least one photo' };
  const type = productTypeOf({ tags, sizes });
  if (type === 'Stitched' && sizes.length === 0) return { error: 'Pick at least one available size' };

  const rating = num(body.rating);
  const reviewsCount = Math.round(num(body.reviewsCount));

  return {
    product: {
      title,
      subtitle: str(body.subtitle, 300),
      price,
      originalPrice,
      description: str(body.description),
      fabric: str(body.fabric, 200),
      craft: str(body.craft, 200),
      care: str(body.care, 200),
      color: str(body.color, 100),
      colorHex: /^#[0-9a-fA-F]{6}$/.test(str(body.colorHex)) ? str(body.colorHex) : '#7A1B38',
      images,
      sizes,
      tags,
      inStock: body.inStock !== false,
      rating: Number.isFinite(rating) && rating >= 0 && rating <= 5 ? Math.round(rating * 10) / 10 : 5,
      reviewsCount: Number.isFinite(reviewsCount) && reviewsCount >= 0 ? reviewsCount : 0,
    },
  };
}
