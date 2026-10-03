'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PRODUCTS } from '@/lib/products';
import { Product, Size } from '@/types';
import { Navbar, CategoryFilter } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { BrandTrust } from '@/components/BrandTrust';
import { CraftCategories } from '@/components/CraftCategories';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';
import { CraftStory } from '@/components/CraftStory';
import { StyleGuide } from '@/components/StyleGuide';
import { CustomerReviews } from '@/components/CustomerReviews';
import { FaqSection } from '@/components/FaqSection';
import { AtelierLocation } from '@/components/AtelierLocation';
import { Footer } from '@/components/Footer';
import { SizeChartModal } from '@/components/SizeChartModal';
import { Sparkles } from 'lucide-react';
import { trackSearch } from '@/lib/metaPixel';
import { trackGASearch } from '@/lib/gtag';

// Category filter product matching logic
export const filterProductByCategory = (p: Product, filter: CategoryFilter): boolean => {
  if (filter === 'All') return true;

  if (filter === 'End of Season Sale') {
    return (
      p.tags.includes('End of Season Sale') ||
      p.tags.includes('Season End Sale') ||
      p.price === 650 ||
      p.price === 999
    );
  }

  if (filter === 'Short Kurti') {
    return (
      p.tags.includes('Short Kurti') ||
      p.title.toLowerCase().includes('short kurti') ||
      p.subtitle.toLowerCase().includes('short kurti') ||
      (p.title.toLowerCase().includes('short') && p.title.toLowerCase().includes('kurti'))
    );
  }

  if (filter === 'Unstitched') {
    return (
      p.tags.includes('Unstitched') ||
      Boolean(p.sizes && p.sizes.includes('Unstitched')) ||
      p.title.toLowerCase().includes('unstitched') ||
      p.subtitle.toLowerCase().includes('unstitched')
    );
  }

  if (filter === '3-Piece Set') {
    return (
      p.tags.includes('3-Piece Set') ||
      p.title.toLowerCase().includes('3-piece') ||
      p.subtitle.toLowerCase().includes('3-piece') ||
      p.fabric.toLowerCase().includes('3-piece') ||
      (p.subtitle.toLowerCase().includes('dupatta') &&
        (p.subtitle.toLowerCase().includes('pant') || p.subtitle.toLowerCase().includes('trouser')))
    );
  }

  if (filter === 'Stitched') {
    const isUnstitched =
      p.tags.includes('Unstitched') ||
      Boolean(p.sizes && p.sizes.length === 1 && p.sizes[0] === 'Unstitched') ||
      p.title.toLowerCase().includes('unstitched') ||
      p.subtitle.toLowerCase().includes('unstitched');
    return !isUnstitched;
  }

  return true;
};

const FILTER_TABS: { key: CategoryFilter; label: string; isSale?: boolean }[] = [
  { key: 'All', label: 'All Collection' },
  { key: 'End of Season Sale', label: 'End of Season Sale', isSale: true },
  { key: 'Unstitched', label: 'Unstitched Suits' },
  { key: 'Stitched', label: 'Stitched Suits' },
  { key: 'Short Kurti', label: 'Short Kurtis' },
  { key: '3-Piece Set', label: '3-Piece Sets' },
];

// Handles syncing ?category=... from URL query to state
function CategoryUrlSync({
  onSelectCategory,
}: {
  onSelectCategory: (cat: CategoryFilter) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (!catParam) return;

    const lower = catParam.toLowerCase().trim();
    let matched: CategoryFilter | null = null;

    if (lower === 'sale' || lower === 'end-of-season-sale' || lower === 'deals') {
      matched = 'End of Season Sale';
    } else if (lower === 'unstitched' || lower === 'unstitched-suit' || lower === 'cut-fabric') {
      matched = 'Unstitched';
    } else if (lower === 'stitched' || lower === 'ready-to-wear' || lower === 'stitched-suits') {
      matched = 'Stitched';
    } else if (lower === 'short-kurti' || lower === 'short-kurtis' || lower === 'kurti' || lower === 'kurtis') {
      matched = 'Short Kurti';
    } else if (lower === '3-piece-set' || lower === '3-piece' || lower === 'sets' || lower === 'complete-set') {
      matched = '3-Piece Set';
    } else if (lower === 'all') {
      matched = 'All';
    }

    if (matched) {
      onSelectCategory(matched);
      // Smooth scroll to product collection
      const timer = setTimeout(() => {
        const el = document.getElementById('collection');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [searchParams, onSelectCategory]);

  return null;
}

export default function HomePage() {
  const router = useRouter();
  const { setDirectBuy } = useCart();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

  // Handle Direct Buy trigger
  const handleDirectBuy = (product: Product, size?: Size) => {
    const isStitched =
      product.tags.includes('Stitched Suit') ||
      product.tags.includes('Short Kurti') ||
      product.tags.includes('Long Kurti') ||
      product.tags.includes('Cotton Kurti') ||
      (product.sizes && !product.sizes.includes('Unstitched'));

    const effectiveSize: Size = isStitched
      ? (size && size !== 'Unstitched' ? size : (product.sizes?.[0] || 'M'))
      : 'Unstitched';

    setDirectBuy(product, effectiveSize, 1);
    router.push('/checkout');
  };

  const handleFilterChange = useCallback((filter: CategoryFilter) => {
    setActiveFilter(filter);
    if (filter !== 'All') {
      trackSearch(filter);
      trackGASearch(filter);
    }
  }, []);

  // Filter products based on active tab
  const filteredProducts = PRODUCTS.filter((p) => filterProductByCategory(p, activeFilter));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723] selection:bg-[#7A1B38] selection:text-white">
      {/* URL category synchronization wrapped in Suspense */}
      <Suspense fallback={null}>
        <CategoryUrlSync onSelectCategory={handleFilterChange} />
      </Suspense>

      {/* Responsive Header Navbar with Dropdown & Active Filter Sync */}
      <Navbar
        activeCategory={activeFilter}
        onSelectCategory={handleFilterChange}
        onOpenSizeChart={() => setIsSizeGuideOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Brand Guarantee Trust Bar */}
        <BrandTrust />

        {/* 3. Craft & Signature Collection Categories Grid */}
        <div id="categories">
          <CraftCategories
            activeCategory={activeFilter}
            onSelectCategory={(cat) => handleFilterChange(cat)}
          />
        </div>

        {/* 4. Curated Products Collection Section */}
        <section id="collection" className="py-16 md:py-24 px-6 lg:px-12 max-w-7xl mx-auto border-b border-[#E4D9CC]">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#7A1B38] bg-[#7A1B38]/10 px-4 py-1.5 rounded-full border border-[#7A1B38]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#B59757]" /> Signature Artisanal Edit
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2B2723] tracking-tight">
              Curated Suits & Kurtis Collection
            </h2>
            <p className="text-sm sm:text-base text-[#8A8178]">
              Handcrafted Premium Suits, Kurtis & Unstitched Sets • Pure breathable cotton & instant Razorpay checkout.
            </p>

            {/* Interactive Filter Tabs */}
            <div className="flex items-center justify-center gap-2.5 pt-6 flex-wrap">
              {FILTER_TABS.map(({ key, label, isSale }) => {
                const count = PRODUCTS.filter((p) => filterProductByCategory(p, key)).length;

                return (
                  <button
                    key={key}
                    onClick={() => handleFilterChange(key)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                      activeFilter === key
                        ? isSale
                          ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-lg border-[#E11D48] ring-2 ring-[#E11D48]/30'
                          : 'bg-[#7A1B38] text-white shadow-md border-[#7A1B38]'
                        : isSale
                        ? 'bg-rose-50 text-[#E11D48] border-[#E11D48]/40 hover:bg-rose-100/70 shadow-2xs'
                        : 'bg-white text-[#2B2723] border-[#E4D9CC] hover:border-[#7A1B38] shadow-2xs'
                    }`}
                  >
                    {isSale && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
                      </span>
                    )}
                    <span>{label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      activeFilter === key
                        ? 'bg-white/20 text-white'
                        : isSale
                        ? 'bg-[#E11D48]/15 text-[#E11D48]'
                        : 'bg-[#F3ECE2] text-[#7A1B38]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

        </section>

        {/* 5. Artisanal Heritage Craft Storytelling */}
        <CraftStory />

        {/* 6. Interactive Style & Occasion Guide */}
        <StyleGuide onSelectProduct={(prod, size) => handleDirectBuy(prod, size || 'M')} />

        {/* 7. Verified Customer Reviews */}
        <CustomerReviews />

        {/* 8. Jaipur Atelier Physical Presence & Google Maps */}
        <AtelierLocation />

        {/* 9. Frequently Asked Questions */}
        <FaqSection onOpenSizeChart={() => setIsSizeGuideOpen(true)} />

        {/* Brand Banner Quote in Royal Burgundy */}
        <section className="bg-[#7A1B38] text-[#FAF6F1] py-16 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-2xl sm:text-4xl font-serif italic leading-relaxed">
              "Every thread tells a story of rich artisanal heritage and timeless Indian craftsmanship."
            </h3>
            <p className="text-xs uppercase tracking-widest text-[#B59757] font-bold">
              Saga Fabrics • Handcrafted Suits & Kurtis
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenSizeChart={() => setIsSizeGuideOpen(true)} />

      {/* Global Women's Size Guide & Chart Modal */}
      <SizeChartModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
