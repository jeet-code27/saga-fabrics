'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import {
  CATEGORIES,
  CategoryFilter,
  categoryFromSlug,
  slugForCategory,
  filterProductByCategory,
  sortProducts,
  SortKey,
  SORT_OPTIONS,
  PRICE_RANGES,
  AVAILABLE_SIZES,
  hasFreeGift,
  isUnstitched,
  isJewellery,
  maxSaleDiscount,
} from '@/lib/catalog';
import { SALE, isSaleLive } from '@/lib/sale';
import { trackSearch } from '@/lib/metaPixel';
import { trackGASearch } from '@/lib/gtag';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { SizeChartModal } from '@/components/SizeChartModal';
import { SaleCountdown } from '@/components/SaleCountdown';

interface Filters {
  prices: string[];
  sizes: string[];
  giftOnly: boolean;
}

const EMPTY_FILTERS: Filters = { prices: [], sizes: [], giftOnly: false };

const toggle = (list: string[], v: string) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

export function ShopClient() {
  const router = useRouter();
  const params = useSearchParams();
  const category = categoryFromSlug(params.get('category'));
  const sortParam = params.get('sort') as SortKey | null;
  const sort: SortKey = SORT_OPTIONS.some((o) => o.key === sortParam) ? (sortParam as SortKey) : 'featured';

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const saleLive = isSaleLive();

  const setUrl = (next: { category?: CategoryFilter; sort?: SortKey }) => {
    const cat = next.category ?? category;
    const srt = next.sort ?? sort;
    const qs = new URLSearchParams();
    if (cat !== 'All') qs.set('category', slugForCategory(cat));
    if (srt !== 'featured') qs.set('sort', srt);
    const s = qs.toString();
    router.replace(s ? `/shop?${s}` : '/shop', { scroll: false });
  };

  const selectCategory = (cat: CategoryFilter) => {
    if (cat !== 'All') {
      trackSearch(cat);
      trackGASearch(cat);
    }
    setUrl({ category: cat });
  };

  // Lock page scroll while the mobile filter sheet is open.
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  const q = query.trim().toLowerCase();
  const results = sortProducts(
    PRODUCTS.filter((p) => {
      if (!p.inStock) return false;
      if (!filterProductByCategory(p, category)) return false;
      if (q && !`${p.title} ${p.subtitle} ${p.color} ${p.fabric} ${p.craft}`.toLowerCase().includes(q)) return false;
      if (filters.giftOnly && !hasFreeGift(p)) return false;
      if (filters.prices.length) {
        const inRange = PRICE_RANGES.filter((r) => filters.prices.includes(r.key)).some(
          (r) => p.price >= r.min && p.price <= r.max
        );
        if (!inRange) return false;
      }
      if (filters.sizes.length) {
        // Unstitched suits and jewellery fit every size, so they always pass a size filter.
        if (!isUnstitched(p) && !isJewellery(p) && !filters.sizes.some((s) => p.sizes?.includes(s))) return false;
      }
      return true;
    }),
    sort
  );

  const activeCount = filters.prices.length + filters.sizes.length + (filters.giftOnly ? 1 : 0);
  const heading =
    category === 'All' ? 'Shop All' : CATEGORIES.find((c) => c.key === category)?.label || 'Shop';

  const filterPanel = (
    <div className="space-y-7">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-[#2B2723] mb-3">Price</legend>
        <div className="space-y-2.5">
          {PRICE_RANGES.map((r) => (
            <label key={r.key} className="flex items-center gap-2.5 text-sm text-[#4A433D] cursor-pointer">
              <input
                type="checkbox"
                checked={filters.prices.includes(r.key)}
                onChange={() => setFilters((f) => ({ ...f, prices: toggle(f.prices, r.key) }))}
                className="w-4 h-4 accent-[#7A1B38]"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      {AVAILABLE_SIZES.length > 0 && (
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-[#2B2723] mb-3">
            Size <span className="normal-case tracking-normal font-normal text-[#8A8178]">(ready to wear)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((s) => {
              const on = filters.sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, sizes: toggle(f.sizes, s) }))}
                  className={`min-w-11 px-3 py-1.5 rounded-md border text-sm cursor-pointer transition-colors ${
                    on
                      ? 'bg-[#2B2723] border-[#2B2723] text-white'
                      : 'bg-white border-[#DCD0C2] text-[#2B2723] hover:border-[#2B2723]'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="mt-3 text-xs text-[#7A1B38] underline underline-offset-2 cursor-pointer"
          >
            Size guide
          </button>
        </fieldset>
      )}

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-[#2B2723] mb-3">Offers</legend>
        <label className="flex items-center gap-2.5 text-sm text-[#4A433D] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.giftOnly}
            onChange={() => setFilters((f) => ({ ...f, giftOnly: !f.giftOnly }))}
            className="w-4 h-4 accent-[#7A1B38]"
          />
          Comes with free jhumkas / bangles
        </label>
      </fieldset>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723]">
      <Navbar onOpenSizeChart={() => setSizeGuideOpen(true)} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 pt-5 sm:pt-8 pb-12">
        {/* Heading */}
        <nav className="text-xs text-[#8A8178] mb-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#7A1B38]">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-[#2B2723]">{heading}</span>
        </nav>
        <div className="flex items-end justify-between gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2B2723]">{heading}</h1>
          <span className="text-xs text-[#8A8178] pb-1.5 shrink-0">{results.length} items</span>
        </div>

        {saleLive && (
          <Link
            href="/shop?category=sale"
            className="flex items-center justify-between gap-3 mb-4 px-4 py-3 rounded-xl bg-[#5C1329] text-[#F6E7C1] border border-[#D9B871]/30"
          >
            <span className="text-sm">
              <span className="font-serif text-base font-semibold">{SALE.name}</span>
              <span className="hidden sm:inline text-[#F6E7C1]/80"> · {SALE.tagline}</span>
            </span>
            {category === 'Sale' ? (
              <span className="text-xs shrink-0">
                Ends in <SaleCountdown className="font-semibold" />
              </span>
            ) : (
              <span className="text-xs shrink-0 font-semibold">Up to {maxSaleDiscount()}% off →</span>
            )}
          </Link>
        )}

        {/* Category chips: scroll sideways on phones */}
        <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[{ key: 'All' as CategoryFilter, label: 'All' }, ...CATEGORIES].map((c) => {
            const on = category === c.key;
            const isSale = c.key === 'Sale';
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => selectCategory(c.key)}
                className={`shrink-0 px-4 py-2 rounded-full text-[13px] border transition-colors cursor-pointer ${
                  on
                    ? 'bg-[#7A1B38] border-[#7A1B38] text-white'
                    : isSale
                    ? 'bg-[#FFF6E6] border-[#E6C98A] text-[#7A1B38] font-medium'
                    : 'bg-white border-[#E4D9CC] text-[#2B2723] hover:border-[#7A1B38]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="mt-3 mb-5 grid grid-cols-2 lg:grid-cols-[1fr_auto] gap-2">
          <label className="col-span-2 lg:col-span-1 relative">
            <Search className="w-4 h-4 text-[#8A8178] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colour, fabric, style…"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-sm placeholder:text-[#A79E95] focus:outline-none focus:border-[#7A1B38]"
            />
          </label>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters{activeCount > 0 && <span className="text-[#7A1B38] font-semibold">({activeCount})</span>}
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setUrl({ sort: e.target.value as SortKey })}
              aria-label="Sort products"
              className="appearance-none w-full lg:w-56 pl-3 pr-9 py-2.5 rounded-lg border border-[#E4D9CC] bg-white text-sm cursor-pointer focus:outline-none focus:border-[#7A1B38]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#8A8178] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              {filterPanel}
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="mt-6 text-xs text-[#7A1B38] underline underline-offset-2 cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Product grid */}
          <section id="collection" aria-label="Products">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                {results.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 4} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-[#DCD0C2] rounded-xl">
                <p className="font-serif text-xl">Nothing matches that yet</p>
                <p className="text-sm text-[#8A8178] mt-1">Try removing a filter or searching another colour.</p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(EMPTY_FILTERS);
                    setQuery('');
                    setUrl({ category: 'All' });
                  }}
                  className="mt-5 px-5 py-2.5 rounded-lg bg-[#7A1B38] text-white text-sm cursor-pointer"
                >
                  Show everything
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer onOpenSizeChart={() => setSizeGuideOpen(true)} />

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-black/40 animate-fadeIn"
          />
          <div className="relative bg-[#FAF6F1] rounded-t-2xl max-h-[85vh] flex flex-col animate-slideUp">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4D9CC]">
              <span className="font-serif text-xl">Filters</span>
              <button type="button" onClick={() => setSheetOpen(false)} aria-label="Close" className="p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5">{filterPanel}</div>
            <div className="grid grid-cols-2 gap-3 px-5 py-4 border-t border-[#E4D9CC] pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="py-3 rounded-lg border border-[#2B2723] text-sm font-medium cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="py-3 rounded-lg bg-[#7A1B38] text-white text-sm font-medium cursor-pointer"
              >
                Show {results.length} items
              </button>
            </div>
          </div>
        </div>
      )}

      <SizeChartModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
