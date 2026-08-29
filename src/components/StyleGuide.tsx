'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import { Product, Size } from '@/types';

interface StyleGuideProps {
  onSelectProduct: (product: Product, size?: Size) => void;
}

export const StyleGuide: React.FC<StyleGuideProps> = ({ onSelectProduct }) => {
  const [activeOccasion, setActiveOccasion] = useState<number>(0);

  const occasions = [
    {
      id: 'festive',
      title: 'Festive & Weddings',
      subtitle: 'Regal Elegance for Puja & Celebrations',
      productId: 'saga-003', // Rani Pink
      stylingTips: [
        'Pair with traditional silver Jhumkas & statement Bangles',
        'Drape the breathable pure cotton dupatta over one shoulder',
        'Complete with statement earrings or traditional Mojris',
      ],
      tag: 'Festive Glamour',
      accentColor: 'text-[#E88DAE]',
      bgAccent: 'bg-[#E88DAE]/15 border-[#E88DAE]/30',
    },
    {
      id: 'work',
      title: 'Office & Daily Chic',
      subtitle: 'Effortless Breathable Comfort All Day Long',
      productId: 'saga-001', // Royal Indigo White — ideal for office & daily chic
      stylingTips: [
        'Match with crisp white tapered pants or cigarette trousers',
        'Add classic leather slip-ons and a sleek tan tote bag',
        'Keep accessories minimal with pearl stud earrings',
      ],
      tag: 'Workplace Grace',
      accentColor: 'text-[#65897D]',
      bgAccent: 'bg-[#7FA79A]/15 border-[#7FA79A]/30',
    },
    {
      id: 'brunch',
      title: 'Summer Garden Brunch',
      subtitle: 'Soft Pastels & Cool Cotton Airiness',
      productId: 'saga-001', // Powder Blue
      stylingTips: [
        'Stylize with pastel tote or handcrafted jute bag',
        'Pair with delicate silver anklets and open-toe strappy sandals',
        'Opt for a breezy loose-hair look with fresh floral perfume',
      ],
      tag: 'Daytime Charm',
      accentColor: 'text-[#65897D]',
      bgAccent: 'bg-[#7FA79A]/15 border-[#7FA79A]/30',
    },
    {
      id: 'evening',
      title: 'Casual Soirée & Dinners',
      subtitle: 'Striking jewel tones with intricate accents',
      productId: 'saga-002', // Emerald Teal
      stylingTips: [
        'Layer with an oxidized silver choker necklace',
        'Pair with dark Kohl eyeliner and subtle nude lip gloss',
        'Finish with a chic clutch and stacked metallic bangles',
      ],
      tag: 'Evening Luxe',
      accentColor: 'text-[#65897D]',
      bgAccent: 'bg-[#7FA79A]/15 border-[#7FA79A]/30',
    },
  ];

  const currentOccasion = occasions[activeOccasion];
  const matchedProduct = PRODUCTS.find((p) => p.id === currentOccasion.productId) || PRODUCTS[0];

  return (
    <section className="py-16 md:py-24 bg-[#FAF6F1] border-b border-[#DCD3C7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#65897D] bg-[#7FA79A]/15 px-4 py-1.5 rounded-full border border-[#7FA79A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#E88DAE]" /> Lookbook & Styling Guide
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2B2723] tracking-tight">
            How to Style Saga Fabrics for Every Occasion
          </h2>
          <p className="text-sm sm:text-base text-[#8A8178]">
            From morning office meetings to evening celebrations, find the perfect Chikankari ensemble and accessories.
          </p>
        </div>

        {/* Occasion Tabs */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {occasions.map((occ, idx) => (
            <button
              key={occ.id}
              onClick={() => setActiveOccasion(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
                activeOccasion === idx
                  ? 'bg-[#7FA79A] text-white shadow-md border-[#7FA79A]'
                  : 'bg-white text-[#2B2723] border-[#DCD3C7] hover:border-[#7FA79A]'
              }`}
            >
              {occ.title}
            </button>
          ))}
        </div>

        {/* Style Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#DCD3C7] shadow-xl overflow-hidden max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Product Image */}
          <div className="lg:col-span-5 relative h-80 lg:h-auto bg-[#EDE6DC]">
            <Image
              src={matchedProduct.images[0]}
              alt={matchedProduct.title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 z-10">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border bg-white/95 backdrop-blur-md ${currentOccasion.accentColor}`}>
                {currentOccasion.tag}
              </span>
            </div>
          </div>

          {/* Right Styling Tips */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-[#8A8178]">STYLING GUIDE FOR</p>
                <h3 className="text-2xl sm:text-4xl font-serif font-medium text-[#2B2723] mt-1">
                  {currentOccasion.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#65897D] font-medium italic mt-0.5">
                  {currentOccasion.subtitle}
                </p>
              </div>

              {/* Product Info Box */}
              <div className="p-4 rounded-2xl bg-[#FAF6F1] border border-[#DCD3C7] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#2B2723] line-clamp-1">{matchedProduct.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-[#8A8178] mt-0.5">
                    <span className="font-bold text-[#65897D]">₹{matchedProduct.price.toLocaleString('en-IN')}</span>
                    <span className="line-through text-[#8A8178]">₹{matchedProduct.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="flex items-center gap-1 text-[#E88DAE]">
                      <Star className="w-3 h-3 fill-current" /> {matchedProduct.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Styling Tips List */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2B2723]">Curated Styling Tips:</p>
                {currentOccasion.stylingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 text-xs sm:text-sm text-[#8A8178]">
                    <div className="w-5 h-5 rounded-full bg-[#7FA79A]/15 text-[#65897D] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      {index + 1}
                    </div>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-[#EDE6DC] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#8A8178]">
                Material: <span className="font-bold text-[#7A1B38]">100% Breathable Cotton Short Kurti</span>
              </div>
              <button
                onClick={() => onSelectProduct(matchedProduct, 'M')}
                className="w-full sm:w-auto px-6 py-3 bg-[#7FA79A] hover:bg-[#65897D] text-white text-xs font-medium rounded-full shadow-md transition-all flex items-center justify-center gap-2 group tracking-wide cursor-pointer"
              >
                <span>Quick Buy Short Kurti</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
