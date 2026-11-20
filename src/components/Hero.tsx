'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryFilter } from './Navbar';
import { Product } from '@/types';
import { useProducts } from '@/context/ProductsContext';
import { filterProductByCategory } from '@/lib/catalog';
import { Snowfall } from '@/components/WinterDecor';

interface HeroProps {
  onSelectCategory?: (category: CategoryFilter) => void;
}

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  titleEm: string;
  text: string;
  cta: string;
  href: string;
  priceNote: string;
  image: string;
  imageAlt: string;
}

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const minPriceIn = (products: Product[], pred: (p: Product) => boolean) => {
  const prices = products.filter(pred).map((p) => p.price);
  return prices.length ? Math.min(...prices) : 0;
};

const buildSlides = (products: Product[]): Slide[] => {
  const minPrice = (pred: (p: Product) => boolean) => minPriceIn(products, pred);
  return [
  {
    id: 'velvet-suits',
    eyebrow: 'New winter arrivals',
    title: 'Velvet suits for',
    titleEm: 'the cold months',
    text: 'Soft velvet kurta, pants and dupatta with stone work, in eleven rich colours. Ready to wear in sizes L and XL.',
    cta: 'Shop velvet suits',
    href: '/shop?category=velvet-suits',
    priceNote: `${inr(minPrice((p) => p.tags.includes('Velvet Suit')))} · stitched 3-piece`,
    image: '/images/products/velvet-suit-set-emerald-green.jpg',
    imageAlt: 'Emerald green velvet suit set with stone work',
  },
  {
    id: 'chikankari-cotton-suits',
    eyebrow: 'New in · cotton chikankari suits',
    title: 'Chikankari suit sets,',
    titleEm: `now ${inr(minPrice((p) => p.tags.includes('Chikankari') && p.tags.includes('Unstitched')))}`,
    text: 'Unstitched kurta, bottom and dupatta in soft cotton with chikankari work. Get it stitched to your size. Free shipping across India.',
    cta: 'Shop suit sets',
    href: '/shop?category=unstitched',
    priceNote: 'Kurta + bottom + dupatta',
    image: '/images/products/chikankari-cotton-suit-sea-green.webp',
    imageAlt: 'Sea green cotton chikankari suit set',
  },
  {
    id: 'silk-kurti',
    eyebrow: 'Silk short kurtis',
    title: 'Silk kurtis,',
    titleEm: 'ready to wear',
    text: 'Wine, peacock teal and midnight black silk kurtis in size 42.',
    cta: 'Shop kurtis',
    href: '/shop?category=short-kurti',
    priceNote: `From ${inr(minPrice((p) => p.tags.includes('Silk Kurti')))}`,
    image: '/images/products/wine-maroon-silk-short-kurti.webp',
    imageAlt: 'Wine maroon silk short kurti',
  },
  {
    id: 'chikankari-set',
    eyebrow: '3-piece chikankari sets',
    title: 'Chikankari suits,',
    titleEm: 'bangles included',
    text: 'Kurta, bottom and dupatta in soft cotton with hand-embroidered chikankari. Get it stitched to your size — and wear it with the bangles we send along.',
    cta: 'Shop suit sets',
    href: '/shop?category=unstitched',
    priceNote: `From ${inr(minPrice((p) => p.tags.includes('Free Bangles')))} + free bangles`,
    image: '/images/products/chikankari-three-piece-suit-midnight-black.webp',
    imageAlt: 'Black chikankari 3-piece suit set with bangles',
  },
  {
    id: 'gifting',
    eyebrow: 'Gifting',
    title: 'Jewellery that won’t tarnish,',
    titleEm: `under ${inr(1000)}`,
    text: 'Kundan, polki and crystal sets with matching earrings. An easy gift for your sister, bhabhi or best friend.',
    cta: 'Shop jewellery',
    href: '/shop?category=jewellery',
    priceNote: `Every set ${inr(minPrice((p) => filterProductByCategory(p, 'Jewellery')))}`,
    image: '/images/products/royal-pearl-kundan-polki-choker-set.jpeg',
    imageAlt: 'Kundan polki choker set',
  },
  ];
};

const AUTOPLAY_MS = 6000;

export const Hero: React.FC<HeroProps> = () => {
  const products = useProducts();
  const slides = buildSlides(products);
  const [index, setIndex] = useState(0);
  // Only load a slide's photo once it is showing or up next, so the first photo isn't
  // competing with three hidden ones when the page opens.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const t = setTimeout(
      () => setLoaded((prev) => (prev.has(index) && prev.has((index + 1) % slides.length) ? prev : new Set([...prev, index, (index + 1) % slides.length]))),
      index === 0 ? 2500 : 0
    );
    return () => clearTimeout(t);
  }, [index, slides.length]);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, go, index]);

  return (
    <section
      className="relative overflow-hidden bg-[#3A0B1A] text-[#F6E7C1] select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        if (touchX.current !== null) {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
        }
        touchX.current = null;
        setPaused(false);
      }}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/* Backdrop: deep plum glow, faint gold dot jaal and a light snowfall */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#6B1A3A_0%,#3E0E24_50%,#1F0712_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle,#D9B871_1px,transparent_1.5px)] [background-size:22px_22px]" />
      <Snowfall />
      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-[#D9B871]/50 to-transparent" />

      {/* Slides are stacked in one grid cell so the section keeps the height of the tallest */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 pt-8 sm:pt-12 pb-20 sm:pb-24 grid grid-cols-1">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.id}
              className={`col-start-1 row-start-1 min-w-0 grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-12 items-center transition-opacity duration-700 ${
                active ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={!active}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              {/* Arch (jharokha) image */}
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative w-[54%] max-w-[210px] sm:max-w-[300px] lg:max-w-[380px]">
                  <div className="absolute -inset-2.5 sm:-inset-3 rounded-t-full rounded-b-2xl border border-[#D9B871]/50" />
                  <div className="relative aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden ring-2 ring-[#D9B871] bg-[#5C1329] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
                    {(i === 0 || loaded.has(i)) && <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 1024px) 54vw, 380px"
                      className={`object-cover object-top transition-transform duration-[6000ms] ease-out ${
                        active ? 'scale-105' : 'scale-100'
                      }`}
                    />}
                  </div>
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#F6E7C1] text-[#4A0F22] text-[11px] sm:text-xs font-semibold shadow-lg">
                    {s.priceNote}
                  </span>
                </div>
              </div>

              {/* Copy */}
              <div
                key={active ? `on-${s.id}` : s.id}
                className={`order-2 lg:order-1 text-center lg:text-left min-w-0 ${active ? 'animate-riseIn' : ''}`}
              >
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D9B871]">{s.eyebrow}</p>
                {/* Only the first slide is the page's H1; the rest are H2s with the same look. */}
                {React.createElement(
                  i === 0 ? 'h1' : 'h2',
                  { className: 'mt-2 sm:mt-3 text-[2rem] leading-[1.08] sm:text-5xl lg:text-6xl font-serif text-[#FBEFD3]' },
                  <>
                    {s.title} <em className="text-[#E6C98A]">{s.titleEm}</em>
                  </>
                )}
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#F6E7C1]/80 max-w-md mx-auto lg:mx-0">{s.text}</p>
                <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href={s.href}
                    tabIndex={active ? 0 : -1}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#D9B871] hover:bg-[#E6C98A] text-[#3A0B1A] text-sm font-semibold transition-colors"
                  >
                    {s.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/shop"
                    tabIndex={active ? 0 : -1}
                    className="hidden sm:inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-[#F6E7C1]/35 hover:bg-white/10 text-sm transition-colors"
                  >
                    Browse everything
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="absolute z-20 bottom-12 sm:bottom-14 inset-x-0 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="hidden sm:flex w-9 h-9 rounded-full border border-[#D9B871]/40 items-center justify-center hover:bg-white/10 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === index ? 'w-8 bg-[#D9B871]' : 'w-1.5 bg-[#F6E7C1]/40 hover:bg-[#F6E7C1]/70'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="hidden sm:flex w-9 h-9 rounded-full border border-[#D9B871]/40 items-center justify-center hover:bg-white/10 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
