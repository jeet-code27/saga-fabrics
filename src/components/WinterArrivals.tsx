'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductsContext';
import { discountPercent } from '@/lib/sale';
import { Snowfall } from '@/components/WinterDecor';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

// Home page block for the winter collection: velvet suit sets.
export const WinterArrivals: React.FC = () => {
  const velvet = useProducts().filter((p) => p.tags.includes('Velvet Suit'));
  if (velvet.length === 0) return null;

  const picks = velvet.slice(0, 4);
  const from = Math.min(...velvet.map((p) => p.price));
  const bestOff = Math.max(...velvet.map(discountPercent));

  return (
    <section className="relative overflow-hidden bg-[#2E0B1C] text-[#F3E6D6]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,#5A1733_0%,transparent_60%)]" />
      <Snowfall />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center">
        <div>
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D9B871]">New winter arrivals</p>
          <h2 className="mt-2 text-4xl sm:text-5xl font-serif leading-[1.05] text-[#FBEFD3]">Velvet suit sets</h2>
          <p className="mt-4 text-sm sm:text-base text-[#F3E6D6]/80 max-w-md">
            Warm, soft velvet with stone work on the yoke and borders. Kurta, pants and dupatta, ready to wear, in{' '}
            {velvet.length} colours for weddings, evening functions and family dinners this winter.
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-3 max-w-sm">
            {[
              [inr(from), bestOff > 0 ? `${bestOff}% off` : 'per set'],
              [String(velvet.length), 'colours'],
              ['L · XL', 'ready to wear'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-[#D9B871]/30 bg-black/15 px-3 py-2.5 text-center">
                <dt className="font-serif text-xl text-[#FBEFD3] leading-none">{value}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-wider text-[#F3E6D6]/60">{label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop?category=velvet-suits"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#D9B871] hover:bg-[#E6C98A] text-[#2E0B1C] text-sm font-semibold transition-colors"
            >
              Shop velvet suits <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-[#F3E6D6]/35 hover:bg-white/10 text-sm transition-colors"
            >
              Browse everything
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {picks.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-[#4A1530] ring-1 ring-[#D9B871]/25"
            >
              <Image
                src={p.images[0]}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 15vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2.5 pt-8 pb-2 text-white">
                <span className="block text-[11px] sm:text-xs leading-tight line-clamp-1">{p.color}</span>
                <span className="block text-xs sm:text-sm font-semibold">{inr(p.price)}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
