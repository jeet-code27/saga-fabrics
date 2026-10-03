'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { trackSearch } from '@/lib/metaPixel';

export type CraftFilter =
  | 'All'
  | 'End of Season Sale'
  | 'Unstitched'
  | 'Stitched'
  | 'Short Kurti'
  | '3-Piece Set';

interface CraftCategoriesProps {
  activeCategory?: CraftFilter;
  onSelectCategory: (category: CraftFilter) => void;
}

export const CraftCategories: React.FC<CraftCategoriesProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const categories = [
    {
      id: 'short-kurti-sale',
      filterKey: 'End of Season Sale' as const,
      title: 'End of Season Sale',
      subtitle: 'Special limited discounts on pure cotton suits & kurtis from ₹650',
      tag: 'Limited Sale',
      badgeBg: 'bg-[#E11D48] text-white',
      ringColor: 'group-hover:border-[#E11D48] group-hover:ring-[#E11D48]/20',
      activeRing: 'border-[#E11D48] ring-4 ring-[#E11D48]/20 bg-[#E11D48]/5',
      image: '/images/products/short-cotton-kurti-turquoise-white-1.png',
    },
    {
      id: 'unstitched-edits',
      filterKey: 'Unstitched' as const,
      title: 'Unstitched Suit Sets',
      subtitle: '100% pure cotton cut fabric sets for tailor-made fit (XS to 5XL)',
      tag: 'Cut Fabric',
      badgeBg: 'bg-[#7A1B38] text-white',
      ringColor: 'group-hover:border-[#7A1B38] group-hover:ring-[#7A1B38]/20',
      activeRing: 'border-[#7A1B38] ring-4 ring-[#7A1B38]/20 bg-[#7A1B38]/5',
      image: '/images/products/stitched-suit-navy-maroon.jpeg',
    },
    {
      id: 'stitched-suits',
      filterKey: 'Stitched' as const,
      title: 'Ready-to-Wear Stitched Suits',
      subtitle: 'Tailored stitched suits & ready-to-wear kurtis (S to XXL)',
      tag: 'Ready To Wear',
      badgeBg: 'bg-[#1B4D3E] text-white',
      ringColor: 'group-hover:border-[#1B4D3E] group-hover:ring-[#1B4D3E]/20',
      activeRing: 'border-[#1B4D3E] ring-4 ring-[#1B4D3E]/20 bg-[#1B4D3E]/5',
      image: '/images/products/stitched-suit-emerald-green.jpeg',
    },
    {
      id: 'short-kurtis',
      filterKey: 'Short Kurti' as const,
      title: 'Short Cotton Kurtis',
      subtitle: 'Chic everyday breathable cotton kurtis with artisanal threadwork',
      tag: 'Everyday Chic',
      badgeBg: 'bg-[#B59757] text-white',
      ringColor: 'group-hover:border-[#B59757] group-hover:ring-[#B59757]/20',
      activeRing: 'border-[#B59757] ring-4 ring-[#B59757]/20 bg-[#B59757]/5',
      image: '/images/products/short-cotton-kurti-slate-blue-2.png',
    },
    {
      id: 'three-piece-sets',
      filterKey: '3-Piece Set' as const,
      title: '3-Piece Complete Sets',
      subtitle: 'Complete 3-piece sets: Kurta + Trousers/Pants + Designer Dupatta',
      tag: 'Full 3-Piece',
      badgeBg: 'bg-[#7A1B38] text-white',
      ringColor: 'group-hover:border-[#7A1B38] group-hover:ring-[#7A1B38]/20',
      activeRing: 'border-[#7A1B38] ring-4 ring-[#7A1B38]/20 bg-[#7A1B38]/5',
      image: '/images/products/stitched-suit-rose-pink.jpeg',
    },
  ];

  const handleCategoryClick = (filterKey: CraftFilter) => {
    trackSearch(filterKey);
    onSelectCategory(filterKey);
    const collectionEl = document.getElementById('collection');
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-20 bg-[#FAF6F1] border-b border-[#E4D9CC] relative overflow-hidden">
      {/* Subtle background ambient styling */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-[#B59757]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#7A1B38] bg-[#7A1B38]/10 px-4 py-1.5 rounded-full border border-[#7A1B38]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#B59757]" /> Curated Categories
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-[#2B2723] tracking-tight">
            Explore By Collection & Style
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8178] leading-relaxed">
            Select a style below to quickly browse complete 3-piece sets, artisanal embroidery, or seasonal edits.
          </p>
        </div>

        {/* Circular / Story Capsule Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.filterKey;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.filterKey)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCategoryClick(cat.filterKey);
                  }
                }}
                className={`group cursor-pointer rounded-3xl p-4 sm:p-6 transition-all duration-300 text-center flex flex-col items-center justify-between border ${
                  isActive
                    ? `${cat.activeRing} shadow-md`
                    : 'bg-white/80 hover:bg-white border-[#E4D9CC] hover:border-[#B59757]/60 shadow-2xs hover:shadow-lg'
                }`}
              >
                {/* Circular Image Container with Dual Rings */}
                <div className="relative mb-4">
                  <div
                    className={`w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden p-1.5 transition-all duration-500 border-2 ${
                      isActive
                        ? 'border-[#7A1B38] ring-4 ring-[#7A1B38]/20 shadow-md scale-105'
                        : `border-[#E4D9CC] ${cat.ringColor} ring-2 ring-transparent group-hover:ring-4 group-hover:scale-105`
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F3ECE2]">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 180px"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Floating Tag Pill over Circle */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                    <span
                      className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-xs inline-flex items-center gap-1 ${cat.badgeBg}`}
                    >
                      {cat.filterKey === 'End of Season Sale' && (
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                      )}
                      {isActive && <Check className="w-2.5 h-2.5" />}
                      <span>{cat.tag}</span>
                    </span>
                  </div>
                </div>

                {/* Typography Block */}
                <div className="mt-3 space-y-1.5 flex-1 flex flex-col justify-between w-full">
                  <div>
                    <h3
                      className={`text-sm sm:text-base font-serif font-semibold leading-snug transition-colors line-clamp-2 ${
                        isActive
                          ? 'text-[#7A1B38]'
                          : 'text-[#2B2723] group-hover:text-[#7A1B38]'
                      }`}
                    >
                      {cat.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#8A8178] line-clamp-2 mt-1 leading-relaxed">
                      {cat.subtitle}
                    </p>
                  </div>

                  {/* Clean Nav Pill */}
                  <div className="pt-3 mt-2 border-t border-[#F3ECE2] flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#7A1B38] group-hover:text-[#5C1329]">
                    <span>{isActive ? 'Filtered Now' : 'Browse Edit'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

