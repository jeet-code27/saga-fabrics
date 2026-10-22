'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PRODUCTS } from '@/lib/products';
import { Product, Size } from '@/types';
import { Navbar } from '@/components/Navbar';
import { DiwaliSaleBanner } from '@/components/DiwaliSaleBanner';
import {
  CATEGORIES,
  CategoryFilter,
  categoryFromSlug,
  filterProductByCategory,
  shopHref,
} from '@/lib/catalog';
import { isSaleLive } from '@/lib/sale';
import Link from 'next/link';
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
import { ArrowRight } from 'lucide-react';
import { trackSearch, trackContact } from '@/lib/metaPixel';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { DiyaRow } from '@/components/FestiveDecor';
import { trackGASearch } from '@/lib/gtag';

const HOME_TABS: CategoryFilter[] = ['All', 'Sale', 'Short Kurti', 'Unstitched', 'Stitched', 'Jewellery'];
const HOME_LIMIT = 8;

// Old links like /?category=sale now live on the shop page.
function LegacyCategoryRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) router.replace(shopHref(categoryFromSlug(cat)));
  }, [searchParams, router]);

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
  const tabs = HOME_TABS.filter((k) => k !== 'Sale' || isSaleLive());
  const tabLabel = (k: CategoryFilter) => (k === 'All' ? 'All' : CATEGORIES.find((c) => c.key === k)?.label || k);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723] selection:bg-[#7A1B38] selection:text-white">
      {/* URL category synchronization wrapped in Suspense */}
      <Suspense fallback={null}>
        <LegacyCategoryRedirect />
      </Suspense>

      {/* Responsive Header Navbar with Dropdown & Active Filter Sync */}
      <Navbar
        activeCategory={activeFilter}
        onSelectCategory={handleFilterChange}
        onOpenSizeChart={() => setIsSizeGuideOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* Diwali hero slider */}
        <Hero onSelectCategory={handleFilterChange} />

        {/* Trust strip */}
        <BrandTrust />

        {/* Shop by category */}
        <div id="categories">
          <CraftCategories />
        </div>

        {/* Diwali sale block (hidden automatically once the sale ends) */}
        <DiwaliSaleBanner />

        {/* Featured products: a short preview, the full range lives on /shop */}
        <section id="collection" className="py-10 sm:py-16 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="flex items-end justify-between gap-4 mb-4 px-1">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#A08350]">Handcrafted in Jaipur</p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-serif text-[#2B2723]">Our collection</h2>
            </div>
            <Link
              href={shopHref(activeFilter)}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#7A1B38] font-medium hover:underline underline-offset-4"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
            {tabs.map((key) => {
              const on = activeFilter === key;
              const isSale = key === 'Sale';
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleFilterChange(key)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13px] border transition-colors cursor-pointer ${
                    on
                      ? 'bg-[#7A1B38] border-[#7A1B38] text-white'
                      : isSale
                      ? 'bg-[#FFF6E6] border-[#E6C98A] text-[#7A1B38] font-medium'
                      : 'bg-white border-[#E4D9CC] text-[#2B2723] hover:border-[#7A1B38]'
                  }`}
                >
                  {tabLabel(key)}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.slice(0, HOME_LIMIT).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={shopHref(activeFilter)}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#2B2723] text-sm font-medium hover:bg-[#2B2723] hover:text-white transition-colors"
            >
              View all {filteredProducts.length} {activeFilter === 'All' ? 'products' : tabLabel(activeFilter).toLowerCase()}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Festive looks built around real products */}
        <StyleGuide onSelectProduct={(prod, size) => handleDirectBuy(prod, size || 'M')} />

        {/* Founders' story and how pieces are made */}
        <CraftStory />

        {/* Customer reviews */}
        <CustomerReviews />

        {/* Jaipur studio & map */}
        <AtelierLocation />

        {/* FAQs */}
        <FaqSection onOpenSizeChart={() => setIsSizeGuideOpen(true)} />

        {/* Personal help strip */}
        <section className="relative overflow-hidden bg-[#3A0B1A] text-[#F6E7C1] pt-12 pb-20 sm:pt-16 sm:pb-24 px-5">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h3 className="text-3xl sm:text-4xl font-serif text-[#FBEFD3]">Need help picking an outfit?</h3>
            <p className="mt-3 text-sm sm:text-base text-[#F6E7C1]/80">
              Tell us the occasion and your size on WhatsApp. We&apos;ll send you a few options with real photos.
            </p>
            <a
              href="https://wa.me/917023352132?text=Hi%20Saga%20Fabrics!%20Can%20you%20help%20me%20pick%20an%20outfit%3F"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact('WhatsApp Support', 'Home Help Strip')}
              className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BE5C] text-white text-sm font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" size="16px" />
              Chat on WhatsApp
            </a>
          </div>
          <DiyaRow className="absolute bottom-0 inset-x-0 px-2" count={9} />
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
