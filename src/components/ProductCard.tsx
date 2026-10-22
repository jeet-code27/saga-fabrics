'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Size } from '@/types';
import { Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { productKind, isSingleSize, defaultSize } from '@/lib/catalog';
import { SALE, isSaleLive, isSaleProduct, discountPercent } from '@/lib/sale';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product, initialSize?: Size) => void;
  onDirectBuy?: (product: Product, size: Size) => void;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart } = useCart();
  const href = `/products/${product.id}`;
  const off = discountPercent(product);
  const onSale = isSaleProduct(product) && isSaleLive();
  const quickAdd = isSingleSize(product);

  const gift = product.tags.includes('Free Jhumka')
    ? 'Free Jhumkas'
    : product.tags.includes('Free Bangles')
    ? 'Free Bangles'
    : null;

  // One badge per card keeps the grid calm: sale > free gift > bestseller.
  const badge = onSale
    ? { text: SALE.name, cls: 'bg-[#7A1B38] text-[#F6E7C1]' }
    : gift
    ? { text: gift, cls: 'bg-[#1B4D3E] text-white' }
    : product.tags.includes('Bestseller')
    ? { text: 'Bestseller', cls: 'bg-white text-[#2B2723]' }
    : null;

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#EDE4D8] hover:border-[#D8C8B4] hover:shadow-md transition-all duration-300">
      <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-[#F3ECE2]">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {badge && (
          <span
            className={`absolute top-2 left-2 text-[10px] sm:text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded ${badge.cls} shadow-sm`}
          >
            {badge.text}
          </span>
        )}
        {onSale && gift && (
          <span className="absolute bottom-2 left-2 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded bg-white/90 text-[#1B4D3E]">
            + {gift}
          </span>
        )}
        {off > 0 && (
          <span className="absolute top-2 right-2 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#FFF4E0] text-[#9A5B00]">
            -{off}%
          </span>
        )}
      </Link>

      <div className="flex-1 flex flex-col p-2.5 sm:p-4">
        <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] uppercase tracking-wider text-[#A08350] font-semibold">
          <span className="truncate">{productKind(product)}</span>
          <span className="hidden sm:flex items-center gap-0.5 normal-case tracking-normal text-[#2B2723] font-medium shrink-0">
            <Star className="w-3 h-3 fill-[#B59757] text-[#B59757]" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <Link
          href={href}
          className="mt-1 text-[13px] sm:text-[15px] leading-snug font-medium text-[#2B2723] hover:text-[#7A1B38] line-clamp-2 min-h-[2.5em]"
        >
          {product.title}
        </Link>

        <div className="mt-1.5 flex items-baseline flex-wrap gap-x-1.5">
          <span className="text-[15px] sm:text-lg font-semibold text-[#2B2723]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {off > 0 && (
            <span className="text-[11px] sm:text-xs text-[#9A9088] line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2.5">
          {quickAdd ? (
            <button
              type="button"
              onClick={() => addToCart(product, defaultSize(product))}
              className="w-full py-2 sm:py-2.5 rounded-lg bg-[#7A1B38] hover:bg-[#5C1329] text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Add to Bag
            </button>
          ) : (
            <Link
              href={href}
              className="block w-full py-2 sm:py-2.5 rounded-lg border border-[#7A1B38] text-[#7A1B38] hover:bg-[#7A1B38] hover:text-white text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Choose Size
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
