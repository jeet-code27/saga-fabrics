'use client';

import React from 'react';
import { Product, Size } from '@/types';
import { X, Star, Shield, RefreshCw, Truck, Sparkles } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  initialSize?: Size;
  onClose: () => void;
  onProceedToBuy: (product: Product, size: Size) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  initialSize = 'M',
  onClose,
  onProceedToBuy,
}) => {
  const [selectedSize, setSelectedSize] = React.useState<Size>(initialSize);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (product && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: product.title,
        content_category: 'Unstitched Suit Sets',
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'INR',
      });
    }
  }, [product]);

  if (!product) return null;

  const currentImage = product.images[selectedImageIndex] || product.images[0];

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
        <div className="md:w-1/2 bg-[#EDE6DC] relative p-4 flex flex-col items-center justify-center gap-3">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xs border border-[#DCD3C7]">
            <img
              src={currentImage}
              alt={product.title}
              className="w-full h-full object-cover object-top transition-all duration-300"
            />
            <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#65897D] text-xs font-bold px-3 py-1 rounded-full border border-[#DCD3C7]">
              Handcrafted Chikankari
            </span>
          </div>

          {/* Image Thumbnails (if product has multiple images) */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#7A1B38] scale-105 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
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

            {/* Free Size Specification Box */}
            <div className="p-3 bg-[#FAF6F1] border border-[#EDE7E1] rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7D8F85] tracking-wider block">Size & Fitting Specification</span>
                <span className="text-xs font-serif font-bold text-[#9E6962] block mt-0.5">Free Size • 100% Unstitched Fabric Set</span>
              </div>
              <span className="px-2.5 py-1 bg-[#9E6962] text-white text-[10px] font-bold rounded-lg shrink-0">
                Customizable to All Sizes
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

            {/* Unstitched Suit Specification Box */}
            <div className="p-3.5 bg-[#7A1B38]/5 rounded-2xl border border-[#7A1B38]/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#7A1B38] shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-[#7A1B38] block">Handcrafted Chikankari Unstitched Suit Set</span>
                <p className="text-[#8A8178] text-[11px] leading-relaxed">
                  Crafted in 100% breathable pure cotton with delicate Lucknowi thread embroidery. Free size unstitched fabric length ready for custom tailoring to any fit & style.
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
              onClick={() => onProceedToBuy(product, 'Free Size (Unstitched)')}
              className="w-full py-4 bg-[#2B2723] hover:bg-[#65897D] text-white font-medium rounded-2xl transition-colors text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Direct Buy (Free Size - Unstitched) with Razorpay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
