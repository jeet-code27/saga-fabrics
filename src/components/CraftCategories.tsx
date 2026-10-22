'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES, shopHref } from '@/lib/catalog';
import { isSaleLive } from '@/lib/sale';
import { trackSearch } from '@/lib/metaPixel';

// Circular "shop by category" row: swipeable on phones, one line on desktop.
export const CraftCategories: React.FC = () => {
  const saleLive = isSaleLive();
  const cats = saleLive ? CATEGORIES : CATEGORIES.filter((c) => c.key !== 'Sale');

  return (
    <section className="py-10 sm:py-16 bg-[#FAF6F1] border-b border-[#E4D9CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#A08350]">Find your fit</p>
          <h2 className="mt-1 text-3xl sm:text-4xl font-serif text-[#2B2723]">Shop by category</h2>
        </div>

        <div className="-mx-4 px-4 flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar sm:justify-center pb-2">
          {cats.map((cat) => {
            const isSale = cat.key === 'Sale';
            return (
              <Link
                key={cat.key}
                href={shopHref(cat.key)}
                onClick={() => trackSearch(cat.key)}
                className="group shrink-0 w-[84px] sm:w-32 flex flex-col items-center text-center"
              >
                <span
                  className={`relative w-[84px] h-[84px] sm:w-32 sm:h-32 rounded-full p-1 border-2 transition-colors ${
                    isSale ? 'border-[#B8862E]' : 'border-[#E4D9CC] group-hover:border-[#7A1B38]'
                  }`}
                >
                  <span className="relative block w-full h-full rounded-full overflow-hidden bg-[#F3ECE2]">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="128px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                  </span>
                  {isSale && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#5C1329] text-[#F6E7C1] whitespace-nowrap">
                      Sale
                    </span>
                  )}
                </span>
                <span
                  className={`mt-2.5 text-xs sm:text-sm leading-tight ${
                    isSale ? 'text-[#7A1B38] font-semibold' : 'text-[#2B2723] group-hover:text-[#7A1B38]'
                  }`}
                >
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
