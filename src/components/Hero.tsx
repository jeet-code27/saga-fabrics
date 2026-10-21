'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CategoryFilter } from './Navbar';

interface HeroProps {
  onSelectCategory?: (category: CategoryFilter) => void;
}

interface Slide {
  id: string;
  badge: string;
  ratingText: string;
  headline: string;
  description: string;
  primaryCtaText: string;
  targetCategory: CategoryFilter;
  bgImage: string;
  previewImage: string;
  previewTag: string;
  previewTitle: string;
  previewPrice: string;
  previewOriginalPrice: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 'kurtis-suits',
    badge: 'Handcrafted Suits & Kurtis Collection 2026',
    ratingText: '4.9 (Top Rated)',
    headline: 'Handcrafted Artisanal Suits & Kurtis',
    description:
      'Discover Saga Fabrics’ signature collection of handcrafted suits, kurtis & unstitched fabric sets with pure dupattas. Tailored for timeless grace and everyday comfort.',
    primaryCtaText: 'Shop Suits & Kurtis',
    targetCategory: 'All',
    bgImage: '/images/products/short-kurti-1.jpg',
    previewImage: '/images/products/short-cotton-kurti-slate-blue-2.png',
    previewTag: 'New Artisanal Edit',
    previewTitle: 'Slate Blue Short Kurti',
    previewPrice: '₹650',
    previewOriginalPrice: '₹1,499',
  },
];

export const Hero: React.FC<HeroProps> = ({ onSelectCategory }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play slider interval (5.5 seconds)
  useEffect(() => {
    if (isPaused || HERO_SLIDES.length <= 1) return;

    slideTimerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isPaused]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) =>
      prev === 0 ? HERO_SLIDES.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleCtaClick = (category: CategoryFilter) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validIndex =
    currentSlideIndex < HERO_SLIDES.length ? currentSlideIndex : 0;
  const activeSlide = HERO_SLIDES[validIndex] || HERO_SLIDES[0];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[85vh] lg:min-h-[92vh] flex items-end justify-between overflow-hidden border-b border-[#E4D9CC] select-none"
    >
      {/* Background Slides with Cross-Fade */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center sm:bg-[center_top_20%] bg-no-repeat transition-opacity duration-1000 ease-in-out pointer-events-none ${
            index === validIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
          }`}
          style={{ backgroundImage: `url('${slide.bgImage}')` }}
        />
      ))}

      {/* Dark Luxury Gradient Overlay for crisp contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2B2723]/95 via-[#2B2723]/50 to-[#2B2723]/25 pointer-events-none" />

      {/* Navigation Arrows (Prev / Next) - Only shown if multiple slides exist */}
      {HERO_SLIDES.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/35 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/35 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Hero Content Overlay */}
      <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-16 lg:py-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Left Column: Headlines, Description & CTAs */}
        <div className="lg:col-span-8 text-left space-y-6 animate-fadeIn">
          {/* Tag Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#FAF6F1] text-xs font-semibold uppercase tracking-widest shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B59757]" />
              <span>{activeSlide.badge}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs text-white">
              <div className="flex text-[#B59757]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="font-bold">{activeSlide.ratingText}</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.1] tracking-tight font-medium drop-shadow-sm">
            {activeSlide.headline}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#FAF6F1]/90 max-w-xl leading-relaxed font-normal">
            {activeSlide.description}
          </p>

          {/* CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => handleCtaClick(activeSlide.targetCategory)}
                className="w-full sm:w-auto px-8 py-4 bg-[#7A1B38] hover:bg-[#5C1329] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group text-sm tracking-wide cursor-pointer"
              >
                <span>{activeSlide.primaryCtaText}</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </button>

              <a
                href="#categories"
                className="w-full sm:w-auto px-7 py-4 bg-white/15 hover:bg-white hover:text-[#2B2723] text-white border border-white/30 backdrop-blur-md font-medium rounded-full transition-all text-xs tracking-wider uppercase text-center cursor-pointer"
              >
                Explore Styles
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#FAF6F1]/80">
              <CheckCircle2 className="w-4 h-4 text-[#B59757] shrink-0" />
              <span>Instant Razorpay Checkout & Free Express Doorstep Shipping</span>
            </div>
          </div>

          {/* Slider Indicators (Dots & Slide Counter) - Only shown if multiple slides exist */}
          {HERO_SLIDES.length > 1 && (
            <div className="flex items-center gap-3 pt-4">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === validIndex
                        ? 'w-8 bg-[#B59757] shadow-sm'
                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono text-white/60 tracking-wider">
                0{validIndex + 1} / 0{HERO_SLIDES.length}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Floating Product Preview Badge tailored to active slide */}
        <div className="lg:col-span-4 hidden lg:flex flex-col items-end">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-white/50 shadow-2xl max-w-xs space-y-3 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-[#FAF6F1] border border-[#E4D9CC] shrink-0">
                <Image
                  src={activeSlide.previewImage}
                  alt={activeSlide.previewTitle}
                  fill
                  sizes="48px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B59757] block">
                  {activeSlide.previewTag}
                </span>
                <h4 className="text-sm font-serif font-bold text-[#2B2723] line-clamp-1">
                  {activeSlide.previewTitle}
                </h4>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#EDE6DC]">
              <div>
                <p className="text-xs text-[#7A1B38] font-bold text-base">
                  {activeSlide.previewPrice}{' '}
                  <span className="text-xs text-[#8A8178] line-through font-normal">
                    {activeSlide.previewOriginalPrice}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCtaClick(activeSlide.targetCategory)}
                className="px-3.5 py-1.5 bg-[#7A1B38] text-white text-xs font-bold rounded-full hover:bg-[#5C1329] transition-colors cursor-pointer shadow-xs"
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
