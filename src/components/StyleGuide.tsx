'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductsContext';
import { Product, Size } from '@/types';

interface StyleGuideProps {
  onSelectProduct?: (product: Product, size?: Size) => void;
}

// Three winter outfits, each built around one real product.
const LOOKS = [
  {
    occasion: 'Winter wedding',
    productId: 'saga-053',
    note: 'Emerald velvet with stone work and the dupatta pinned on one shoulder. Add a pair of gold earrings and you’re ready.',
  },
  {
    occasion: 'Evening function',
    productId: 'saga-044',
    note: 'Wine purple velvet keeps you warm through a long December evening and looks rich in photos.',
  },
  {
    occasion: 'Gift for her',
    productId: 'saga-034',
    note: 'A kundan set for your sister or bhabhi for the wedding season — anti-tarnish, so it keeps its shine.',
  },
];

export const StyleGuide: React.FC<StyleGuideProps> = () => {
  const PRODUCTS = useProducts();
  const looks = LOOKS.map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.productId) })).filter(
    (l): l is (typeof l & { product: Product }) => Boolean(l.product)
  );

  if (!looks.length) return null;

  return (
    <section className="py-14 md:py-24 bg-[#FAF6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#A08350]">Winter looks</p>
          <h2 className="mt-1 text-3xl sm:text-5xl font-serif text-[#2B2723]">What to wear this winter</h2>
        </div>

        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {looks.map(({ occasion, note, product }) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group snap-start shrink-0 w-[80%] md:w-auto relative rounded-2xl overflow-hidden bg-[#2B2723] text-white"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 80vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-serif italic text-2xl sm:text-3xl text-[#F6E7C1]">{occasion}</p>
                <p className="mt-2 text-sm text-white/85 leading-relaxed">{note}</p>
                <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-white/20">
                  <span className="text-sm">
                    ₹{product.price.toLocaleString('en-IN')}
                    <span className="ml-2 text-white/50 line-through text-xs">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#E6C98A]">
                    Shop the look <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
