'use client';

import React from 'react';
import { Sparkles, ArrowDown, CheckCircle2, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-end justify-between overflow-hidden border-b border-[#E4D9CC]">
      
      {/* Short Kurti Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center sm:bg-[center_top_20%] bg-no-repeat transition-transform duration-1000 scale-102"
        style={{ backgroundImage: "url('/images/products/short-kurti-1.jpg')" }}
      />

      {/* Dark Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2B2723]/95 via-[#2B2723]/40 to-[#2B2723]/15" />

      {/* Hero Content Overlay */}
      <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-16 lg:py-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        
        {/* Left Column: Short Headline, Subtitle & Buttons */}
        <div className="lg:col-span-8 text-left space-y-6">
          
          {/* Tag Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#FAF6F1] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#B59757]" />
              <span>Chikankari Unstitched Suit Collection 2026</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs text-white">
              <div className="flex text-[#B59757]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="font-bold">4.9</span>
              <span className="text-white/70 text-[11px]">(Top Rated)</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.1] tracking-tight font-medium">
            Handcrafted Chikankari Unstitched Suits
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#FAF6F1]/90 max-w-xl leading-relaxed font-normal">
            Discover <strong>Saga Fabrics’</strong> signature collection of Lucknowi Chikankari Unstitched Suit Sets with pure cotton dupattas. 100% breathable pure cotton material ready to tailor to your custom fit.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={scrollToProducts}
                className="w-full sm:w-auto px-8 py-4 bg-[#7A1B38] hover:bg-[#5C1329] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group text-sm tracking-wide"
              >
                <span>Shop Collection</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </button>
              
              <a
                href="#categories"
                className="w-full sm:w-auto px-7 py-4 bg-white/15 hover:bg-white hover:text-[#2B2723] text-white border border-white/30 backdrop-blur-md font-medium rounded-full transition-all text-xs tracking-wider uppercase text-center"
              >
                Explore Styles
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#FAF6F1]/80">
              <CheckCircle2 className="w-4 h-4 text-[#B59757] shrink-0" />
              <span>Instant Razorpay Checkout & Free Express Doorstep Shipping</span>
            </div>
          </div>

        </div>

        {/* Right Column: Floating Product Preview Badge for Royal Indigo Kurti */}
        <div className="lg:col-span-4 hidden lg:flex flex-col items-end">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-white/50 shadow-2xl max-w-xs space-y-3 transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3">
              <img
                src="/images/saga-fabrics-logo-new.png"
                alt="Saga Fabrics"
                className="w-12 h-12 object-contain rounded-xl bg-[#FAF6F1] p-1 border border-[#E4D9CC] shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#5C7056]">New Chikankari Edit</span>
                <h4 className="text-sm font-serif font-bold text-[#2B2723]">Royal Indigo Short Kurti</h4>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#EDE6DC]">
              <div>
                <p className="text-xs text-[#7A1B38] font-bold text-base">₹1,399 <span className="text-xs text-[#8A8178] line-through font-normal">₹1,999</span></p>
              </div>
              <button
                onClick={scrollToProducts}
                className="px-3.5 py-1.5 bg-[#7A1B38] text-white text-xs font-bold rounded-full hover:bg-[#5C1329] transition-colors"
              >
                View
              </button>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
