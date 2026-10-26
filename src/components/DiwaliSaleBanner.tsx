'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductsContext';
import { SALE, isSaleLive, isSaleProduct } from '@/lib/sale';
import { maxSaleDiscount } from '@/lib/catalog';
import { SaleCountdown } from '@/components/SaleCountdown';

// Home page festive block: headline, countdown and a peek at real sale pieces.
export const DiwaliSaleBanner: React.FC = () => {
  const PRODUCTS = useProducts();
  if (!isSaleLive()) return null;

  const picks = PRODUCTS.filter(isSaleProduct).slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-[#4A0F22] text-[#F6E7C1]">
      {/* Thin gold borders echo a toran / saree border without leaning on clip-art */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-[repeating-linear-gradient(90deg,#D9B871_0_10px,transparent_10px_16px)] opacity-70" />
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[repeating-linear-gradient(90deg,#D9B871_0_10px,transparent_10px_16px)] opacity-70" />
      <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[#D9B871]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
        <div>
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D9B871]">Festive season at Saga</p>
          <h2 className="mt-2 text-4xl sm:text-6xl font-serif leading-[1.05] text-[#FBEFD3]">
            {SALE.name}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F6E7C1]/80 max-w-md">
            Up to {maxSaleDiscount(PRODUCTS)}% off, plus free jhumkas or bangles on selected pieces. {SALE.tagline}.
          </p>

          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-wider text-[#F6E7C1]/60 mb-2">Sale ends in</p>
            <SaleCountdown variant="blocks" />
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop?category=sale"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#D9B871] hover:bg-[#E6C98A] text-[#3A0B1A] text-sm font-semibold transition-colors"
            >
              Shop the sale <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-[#F6E7C1]/40 hover:bg-white/10 text-sm transition-colors"
            >
              Browse everything
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {picks.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-[#5C1329] ring-1 ring-[#D9B871]/30"
            >
              <Image
                src={p.images[0]}
                alt={p.title}
                fill
                sizes="(max-width: 1024px) 25vw, 20vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1.5 text-[10px] sm:text-xs text-white font-medium">
                ₹{p.price.toLocaleString('en-IN')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
