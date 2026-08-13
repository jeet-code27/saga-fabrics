'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CraftCategoriesProps {
  onSelectCategory: (category: 'All' | 'Chikankari' | 'Handblock' | '3-Piece Set') => void;
}

export const CraftCategories: React.FC<CraftCategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'indigo-edits',
      filterKey: 'Chikankari' as const,
      title: 'Royal Indigo Short Kurtis',
      subtitle: 'Crisp white cotton tunics with vibrant royal blue Chikankari embroidery.',
      tag: 'Bestselling Style',
      image: '/images/products/1.jpeg',
      badgeBg: 'bg-[#7A1B38] text-white',
    },
    {
      id: 'yellow-edits',
      filterKey: 'Handblock' as const,
      title: 'Sunshine Yellow Edits',
      subtitle: 'Joyful marigold yellow hand threadwork on breathable pure cotton tunics.',
      tag: 'Artisanal Grace',
      image: '/images/products/4.png',
      badgeBg: 'bg-[#5C7056] text-white',
    },
    {
      id: 'pastel-edits',
      filterKey: '3-Piece Set' as const,
      title: 'Powder Blue Pastels',
      subtitle: 'Serene slate blue short kurti with delicate pure white Chikankari needlework.',
      tag: 'Pastel Luxury',
      image: '/images/products/7.png',
      badgeBg: 'bg-[#B59757] text-white',
    },
    {
      id: 'teal-edits',
      filterKey: 'All' as const,
      title: 'Ocean Teal Short Kurtis',
      subtitle: 'Striking ocean teal cotton short kurti featuring ornate white threadwork.',
      tag: 'Daily Luxe',
      image: '/images/products/8.png',
      badgeBg: 'bg-[#2B2723] text-white',
    },
  ];

  const handleCategoryClick = (filterKey: 'All' | 'Chikankari' | 'Handblock' | '3-Piece Set') => {
    onSelectCategory(filterKey);
    const collectionEl = document.getElementById('collection');
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF6F1] border-b border-[#E4D9CC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#7A1B38] bg-[#7A1B38]/10 px-4 py-1.5 rounded-full border border-[#7A1B38]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#B59757]" /> Handcrafted Heritage
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2B2723] tracking-tight">
            Explore By Craft & Signature Edits
          </h2>
          <p className="text-sm sm:text-base text-[#8A8178] leading-relaxed">
            Every garment carries the legacy of master Chikankari artisans. Choose your favorite silhouette or embroidery style below.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.filterKey)}
              className="group relative bg-white rounded-3xl overflow-hidden border border-[#E4D9CC] shadow-2xs hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-[#F3ECE2]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                {/* Floating Tag */}
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs ${cat.badgeBg}`}>
                    {cat.tag}
                  </span>
                </div>

                {/* Overlaid Title on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-serif font-medium leading-tight text-white group-hover:text-[#B59757] transition-colors">
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer Content */}
              <div className="p-5 space-y-3 bg-white flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#8A8178] leading-relaxed line-clamp-2">
                  {cat.subtitle}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-[#F3ECE2] text-xs font-semibold text-[#7A1B38] group-hover:text-[#5C1329]">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
