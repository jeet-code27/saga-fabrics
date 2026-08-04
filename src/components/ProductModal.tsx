'use client';

import React, { useState } from 'react';
import { Product, Size } from '@/types';
import { X, Star, Shield, RefreshCw, Truck, Ruler } from 'lucide-react';

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
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<Size>(initialSize);
  const [showSizeChart, setShowSizeChart] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#FAF6F1] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#DCD3C7] my-8 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md text-[#2B2723] hover:bg-[#65897D] hover:text-white transition-colors shadow-sm"
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
                <span className="text-[#8A8178] block font-medium">Fabric</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.fabric}</span>
              </div>
              <div className="p-2.5 bg-[#FAF6F1] rounded-xl border border-[#DCD3C7]">
                <span className="text-[#8A8178] block font-medium">Craft & Work</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.craft}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2B2723]">Select Size (Standard India):</span>
                <button
                  type="button"
                  onClick={() => setShowSizeChart(true)}
                  className="text-xs text-[#65897D] font-semibold flex items-center gap-1 hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Chart
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedSize === size
                        ? 'bg-[#7FA79A] text-white border-[#7FA79A] shadow-xs'
                        : 'bg-[#FAF6F1] text-[#2B2723] border-[#DCD3C7] hover:border-[#7FA79A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-[#8A8178]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#65897D]" /> Free Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-[#65897D]" /> 7-Day Exchange
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#65897D]" /> Razorpay Safe
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#DCD3C7]">
            <button
              onClick={() => onProceedToBuy(product, selectedSize)}
              className="w-full py-4 bg-[#2B2723] hover:bg-[#65897D] text-white font-medium rounded-2xl transition-colors text-sm shadow-md"
            >
              Direct Buy with Razorpay ({selectedSize})
            </button>
          </div>
        </div>
      </div>

      {/* Size Chart Modal Overlay */}
      {showSizeChart && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#DCD3C7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCD3C7] pb-3">
              <h3 className="text-base font-serif font-bold text-[#2B2723]">Kurti Size Measurement (Inches)</h3>
              <button onClick={() => setShowSizeChart(false)} className="text-[#8A8178] hover:text-[#2B2723]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#2B2723]">
              <div className="flex justify-between font-bold bg-[#FAF6F1] p-2 rounded-lg border border-[#DCD3C7]">
                <span>Size</span>
                <span>Bust</span>
                <span>Waist</span>
                <span>Hips</span>
              </div>
              <div className="flex justify-between p-2 border-b border-[#EDE6DC]">
                <span className="font-bold text-[#65897D]">S</span>
                <span>36"</span>
                <span>32"</span>
                <span>38"</span>
              </div>
              <div className="flex justify-between p-2 border-b border-[#EDE6DC]">
                <span className="font-bold text-[#65897D]">M</span>
                <span>38"</span>
                <span>34"</span>
                <span>40"</span>
              </div>
              <div className="flex justify-between p-2 border-b border-[#EDE6DC]">
                <span className="font-bold text-[#65897D]">L</span>
                <span>40"</span>
                <span>36"</span>
                <span>42"</span>
              </div>
              <div className="flex justify-between p-2 border-b border-[#EDE6DC]">
                <span className="font-bold text-[#65897D]">XL</span>
                <span>42"</span>
                <span>38"</span>
                <span>44"</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="font-bold text-[#65897D]">XXL</span>
                <span>44"</span>
                <span>40"</span>
                <span>46"</span>
              </div>
            </div>
            <button
              onClick={() => setShowSizeChart(false)}
              className="w-full py-2.5 bg-[#7FA79A] text-white text-xs font-bold rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
