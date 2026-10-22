import { Product } from '@/types';
import { PRODUCTS } from '@/lib/products';
import { isSaleProduct, discountPercent } from '@/lib/sale';

export type CategoryFilter =
  | 'All'
  | 'Sale'
  | 'Unstitched'
  | 'Stitched'
  | 'Short Kurti'
  | '3-Piece Set'
  | 'Jewellery';

export interface CategoryDef {
  key: CategoryFilter;
  slug: string;
  label: string;
  image: string;
}

// Order here is the order shown in menus, chips and the "shop by category" row.
export const CATEGORIES: CategoryDef[] = [
  { key: 'Sale', slug: 'sale', label: 'Diwali Sale', image: '/images/products/handcrafted-wine-maroon-short-kurti-free-jhumka.jpeg' },
  { key: 'Short Kurti', slug: 'short-kurti', label: 'Short Kurtis', image: '/images/products/short-cotton-kurti-slate-blue-2.png' },
  { key: 'Unstitched', slug: 'unstitched', label: 'Unstitched Suits', image: '/images/products/unstitched-cotton-three-piece-suit-yellow-chikankari-free-bangles.jpeg' },
  { key: 'Stitched', slug: 'stitched', label: 'Stitched Suits', image: '/images/products/stitched-suit-emerald-green.jpeg' },
  { key: '3-Piece Set', slug: '3-piece-set', label: '3-Piece Sets', image: '/images/products/stitched-suit-rose-pink.jpeg' },
  { key: 'Jewellery', slug: 'jewellery', label: 'Jewellery', image: '/images/products/royal-pearl-kundan-polki-choker-set.jpeg' },
];

const SLUG_ALIASES: Record<string, CategoryFilter> = {
  all: 'All',
  sale: 'Sale',
  'diwali-sale': 'Sale',
  diwali: 'Sale',
  'end-of-season-sale': 'Sale',
  deals: 'Sale',
  jewellery: 'Jewellery',
  jewelry: 'Jewellery',
  'anti-tarnish': 'Jewellery',
  'anti-tarnish-jewellery': 'Jewellery',
  choker: 'Jewellery',
  unstitched: 'Unstitched',
  'unstitched-suit': 'Unstitched',
  'cut-fabric': 'Unstitched',
  stitched: 'Stitched',
  'ready-to-wear': 'Stitched',
  'stitched-suits': 'Stitched',
  'short-kurti': 'Short Kurti',
  'short-kurtis': 'Short Kurti',
  kurti: 'Short Kurti',
  kurtis: 'Short Kurti',
  '3-piece-set': '3-Piece Set',
  '3-piece': '3-Piece Set',
  sets: '3-Piece Set',
  'complete-set': '3-Piece Set',
};

export const categoryFromSlug = (slug: string | null | undefined): CategoryFilter =>
  (slug && SLUG_ALIASES[slug.toLowerCase().trim()]) || 'All';

export const slugForCategory = (key: CategoryFilter): string =>
  CATEGORIES.find((c) => c.key === key)?.slug || 'all';

export const shopHref = (key: CategoryFilter): string =>
  key === 'All' ? '/shop' : `/shop?category=${slugForCategory(key)}`;

const text = (p: Product) => `${p.title} ${p.subtitle}`.toLowerCase();

export const isJewellery = (p: Product): boolean =>
  p.tags.includes('Jewellery') ||
  p.tags.includes('Artificial Jewellery') ||
  /jewellery|necklace|choker/.test(p.title.toLowerCase());

export const isUnstitched = (p: Product): boolean =>
  !isJewellery(p) &&
  (p.tags.includes('Unstitched') || Boolean(p.sizes?.includes('Unstitched')) || text(p).includes('unstitched'));

export const filterProductByCategory = (p: Product, filter: CategoryFilter): boolean => {
  switch (filter) {
    case 'All':
      return true;
    case 'Sale':
      return isSaleProduct(p);
    case 'Jewellery':
      return isJewellery(p);
    case 'Unstitched':
      return isUnstitched(p);
    case 'Stitched':
      return !isJewellery(p) && !isUnstitched(p);
    case 'Short Kurti':
      return p.tags.includes('Short Kurti') || text(p).includes('short kurti');
    case '3-Piece Set':
      return (
        p.tags.includes('3-Piece Set') ||
        text(p).includes('3-piece') ||
        p.fabric.toLowerCase().includes('3-piece')
      );
  }
};

// Short label shown above the product title on cards.
export const productKind = (p: Product): string => {
  if (isJewellery(p)) return 'Jewellery';
  if (isUnstitched(p)) return p.tags.includes('3-Piece Set') ? 'Unstitched 3-Piece' : 'Unstitched Suit';
  if (p.tags.includes('Silk Kurti')) return 'Silk Kurti';
  if (p.tags.includes('Short Kurti')) return 'Short Kurti';
  if (p.tags.includes('Long Kurti')) return 'Long Kurti';
  if (p.tags.includes('Stitched Suit')) return 'Stitched Suit';
  return 'Ready to Wear';
};

// True when a shopper doesn't need to pick a size, so the card can add straight to bag.
export const isSingleSize = (p: Product): boolean =>
  isJewellery(p) || isUnstitched(p) || (p.sizes?.length ?? 0) <= 1;

export const defaultSize = (p: Product): string =>
  isUnstitched(p) ? 'Unstitched' : isJewellery(p) ? 'Free Size' : p.sizes?.[0] || 'M';

export const hasFreeGift = (p: Product): boolean =>
  p.tags.includes('Free Jhumka') || p.tags.includes('Free Bangles');

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'discount', label: 'Biggest Discount' },
  { key: 'rating', label: 'Top Rated' },
];

export const sortProducts = (list: Product[], sort: SortKey): Product[] => {
  const copy = [...list];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'discount':
      return copy.sort((a, b) => discountPercent(b) - discountPercent(a));
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    default:
      return copy;
  }
};

export interface PriceRange {
  key: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { key: 'u1000', label: 'Under ₹1,000', min: 0, max: 999 },
  { key: '1000-2000', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { key: '2000-3000', label: '₹2,000 – ₹3,000', min: 2001, max: 3000 },
  { key: 'o3000', label: 'Above ₹3,000', min: 3001, max: Infinity },
];

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];

// Sizes that actually exist in the catalogue (ready-to-wear only).
export const AVAILABLE_SIZES: string[] = Array.from(
  new Set(PRODUCTS.flatMap((p) => (isUnstitched(p) || isJewellery(p) ? [] : p.sizes || [])))
)
  .filter((s) => s !== 'Unstitched')
  .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));

export const maxSaleDiscount = (): number =>
  PRODUCTS.filter(isSaleProduct).reduce((m, p) => Math.max(m, discountPercent(p)), 0);
