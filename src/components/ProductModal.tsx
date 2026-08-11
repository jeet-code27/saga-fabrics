'use client';

import React from 'react';
import { Product, Size } from '@/types';
import { X, Star, Shield, RefreshCw, Truck, Scissors } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  initialSize?: Size;
  onClose: () => void;
  onProceedToBuy: (product: Product, size: Size) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onProceedToBuy,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#FAF6F1] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#DCD3C7] my-8 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md text-[#2B2723] hover:bg-[#65897D] hover:text-white transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Section */}
        <div className="md:w-1/2 bg-[#EDE6DC] relative p-4 flex items-center justify-center">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xs border border-[#DCD3C7]">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-top"
            />
            <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#65897D] text-xs font-bold px-3 py-1 rounded-full border border-[#DCD3C7]">
              Jaipur Handmade
            </span>
          </div>
        </div>

        {/* Right Details Section */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            
            {/* Tag & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#65897D] font-bold tracking-wider uppercase">
                {product.tags.join(' • ')}
              </span>
              <div className="flex items-center gap-1 text-[#E88DAE]">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-[#2B2723]">{product.rating}</span>
                <span className="text-[#8A8178]">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl font-serif font-medium text-[#2B2723] leading-snug">
              {product.title}
            </h2>
            <p className="text-xs text-[#8A8178] leading-relaxed">{product.subtitle}</p>

            {/* Price Banner */}
            <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#DCD3C7] flex items-center justify-between">
              <div>
                <span className="text-2xl font-serif font-bold text-[#65897D]">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-[#8A8178] line-through ml-2">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <span className="bg-[#E88DAE] text-white text-xs font-bold px-3 py-1 rounded-full">
                Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-[#8A8178] leading-relaxed">
              {product.description}
            </p>

            {/* Fabric Specifications */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-[#FAF6F1] rounded-xl border border-[#DCD3C7]">
                <span className="text-[#8A8178] block font-medium">Fabric Type</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.fabric}</span>
              </div>
              <div className="p-2.5 bg-[#FAF6F1] rounded-xl border border-[#DCD3C7]">
                <span className="text-[#8A8178] block font-medium">Craft & Work</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.craft}</span>
              </div>
            </div>

            {/* Unstitched Fabric Guarantee Box */}
            <div className="p-3.5 bg-[#7A1B38]/5 rounded-2xl border border-[#7A1B38]/20 flex items-start gap-3">
              <Scissors className="w-5 h-5 text-[#7A1B38] shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-[#7A1B38] block">100% Unstitched Fabric Suit Set</span>
                <p className="text-[#8A8178] text-[11px] leading-relaxed">
                  Contains full unstitched fabric material. Ready to be custom tailored into your preferred fitting (Kurtis, Salwar Suits, Shararas or Pants) by any tailor.
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-[#8A8178]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#65897D]" /> Free Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#65897D]" /> Quality Checked
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#65897D]" /> Razorpay Safe
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#DCD3C7]">
            <button
              onClick={() => onProceedToBuy(product, 'Unstitched')}
              className="w-full py-4 bg-[#2B2723] hover:bg-[#65897D] text-white font-medium rounded-2xl transition-colors text-sm shadow-md cursor-pointer"
            >
              Direct Buy with Razorpay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
