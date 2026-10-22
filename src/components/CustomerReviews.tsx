'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { GoogleIcon } from '@/components/GoogleIcon';

const GOOGLE_PROFILE = 'https://www.google.com/maps/search/?api=1&query=Saga+Fabrics+Jagatpura+Jaipur';

const REVIEWS = [
  {
    name: 'Ananya Sharma',
    city: 'New Delhi',
    product: 'Royal Indigo White Short Kurti',
    text: 'The pure cotton fabric is extraordinarily soft for Delhi heat, and the intricate blue Chikankari needlework looks very premium. Received order within 3 days directly from Jaipur. Fabric doesn’t shrink after wash!',
  },
  {
    name: 'Priya Ramachandran',
    city: 'Bengaluru',
    product: 'Ocean Teal Handcrafted Stitched Suit',
    text: 'Ordered on Tuesday and received in Bangalore by Friday! The 3-piece fitting is spot on and the contrasting dupatta is so graceful. Gaurav and Sonica’s personal touch & packaging really shows.',
  },
  {
    name: 'Meera Kulkarni',
    city: 'Mumbai',
    product: 'Sunshine Yellow Hand-Embroidered Kurti',
    text: 'Saga Fabrics has become my go-to ethnic wear store. The breathable cotton threadwork is airy and comfortable for all-day office wear. Wore it to work and received so many compliments!',
  },
  {
    name: 'Kavita Mathur',
    city: 'Lucknow',
    product: 'Slate Powder Blue Stitched Kurti Set',
    text: 'Living in Lucknow, I am very particular about needlework and thread tension. The finish on these suits is top-tier pure handcraft. The WhatsApp team even guided me on the right size beforehand!',
  },
];

const Stars = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <span className="flex text-[#E0A526]" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`${className} fill-current`} />
    ))}
  </span>
);

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-14 md:py-24 bg-[#F3ECE2] border-y border-[#E4D9CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#A08350]">Kind words</p>
            <h2 className="mt-1 text-3xl sm:text-5xl font-serif text-[#2B2723]">What customers tell us</h2>
          </div>
          <a
            href={GOOGLE_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto inline-flex items-center gap-3 bg-white px-4 py-2.5 rounded-full border border-[#E4D9CC] hover:border-[#2B2723] transition-colors"
          >
            <GoogleIcon className="w-5 h-5" size="20px" />
            <span className="font-semibold text-[#2B2723]">4.9</span>
            <Stars />
            <span className="text-xs text-[#6F665E] underline underline-offset-2">Read on Google</span>
          </a>
        </div>

        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="snap-start shrink-0 w-[82%] md:w-auto bg-white rounded-xl p-5 border border-[#E4D9CC] flex flex-col"
            >
              <span className="font-serif text-5xl leading-none text-[#D9B871] h-6" aria-hidden="true">
                “
              </span>
              <blockquote className="mt-2 text-[15px] text-[#4A433D] leading-relaxed flex-1">{r.text}</blockquote>
              <figcaption className="mt-5 pt-4 border-t border-[#F0E8DD] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#2B2723]">{r.name}</p>
                  <p className="text-xs text-[#8A8178] truncate">
                    {r.city} · {r.product}
                  </p>
                </div>
                <Stars className="w-3 h-3" />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
