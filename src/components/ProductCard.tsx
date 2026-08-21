'use client';

import React from 'react';
import { Product, Size } from '@/types';
import { Eye, ShoppingCart, Star, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product, initialSize?: Size) => void;
  onDirectBuy: (product: Product, size: Size) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onDirectBuy,
}) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-[#E4D9CC] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F3ECE2] cursor-pointer" onClick={() => onSelectProduct(product, 'M')}>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-xs ${
                tag === 'Bestseller'
                  ? 'bg-[#7A1B38]'
                  : tag === 'Royal Edition' || tag === 'Royal Edit'
                  ? 'bg-[#B59757]'
                  : 'bg-[#5C7056]'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E4D9CC] text-xs font-bold text-[#7A1B38] shadow-xs">
          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
        </div>

        {/* Quick Preview Hover Overlay */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product, 'M');
            }}
            className="bg-white/95 text-[#2B2723] hover:bg-[#7A1B38] hover:text-white px-4 py-2.5 rounded-full font-semibold text-xs transition-colors shadow-md flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating & Fabric */}
          <div className="flex items-center justify-between text-xs text-[#8A8178] mb-1.5">
            <div className="flex items-center gap-1 text-[#B59757]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-[#2B2723]">{product.rating}</span>
              <span className="text-[#8A8178]">({product.reviewsCount})</span>
            </div>
            <span className="font-medium text-[#5C7056]">Pure Cotton Tunic</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product, 'M')}
            className="text-base font-serif font-semibold text-[#2B2723] group-hover:text-[#7A1B38] transition-colors cursor-pointer line-clamp-1"
          >
            {product.title}
          </h3>
          <p className="text-xs text-[#8A8178] line-clamp-1 mt-0.5">{product.subtitle}</p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-xl font-serif font-bold text-[#7A1B38]">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="text-xs text-[#8A8178] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            <span className="text-[11px] font-semibold text-[#5C7056] bg-[#5C7056]/10 px-2 py-0.5 rounded">Taxes Incl.</span>
          </div>
        </div>

        {/* Unstitched Suit Specification Badge */}
        <div className="pt-2 border-t border-[#F3ECE2]">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#7A1B38]/5 rounded-xl border border-[#7A1B38]/15 text-[#7A1B38] text-xs font-semibold">
            <Sparkles className="w-4 h-4 shrink-0 text-[#7A1B38]" />
            <span>100% Pure Cotton Unstitched Suit Set</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onDirectBuy(product, 'Free Size (Unstitched)')}
          className="w-full py-3 bg-[#2B2723] hover:bg-[#7A1B38] text-white font-medium rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-[#B59757]" />
          <span>Buy Now (Free Size Unstitched)</span>
        </button>

      </div>
    </div>
  );
};
