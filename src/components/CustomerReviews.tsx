'use client';

import React from 'react';
import { Star, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { GoogleIcon } from '@/components/GoogleIcon';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Ananya Sharma',
      location: 'New Delhi',
      badge: 'Local Guide • 28 reviews',
      rating: 5,
      productName: 'Royal Indigo White Short Kurti',
      comment:
        'The pure cotton fabric is extraordinarily soft for Delhi heat, and the intricate blue Chikankari needlework looks very premium. Received order within 3 days directly from Jaipur. Fabric doesn’t shrink after wash!',
      date: '3 days ago',
      initials: 'AS',
      avatarBg: 'bg-[#4285F4] text-white',
    },
    {
      id: 2,
      name: 'Priya Ramachandran',
      location: 'Bengaluru',
      badge: 'Verified Google Buyer',
      rating: 5,
      productName: 'Ocean Teal Handcrafted Stitched Suit',
      comment:
        'Ordered on Tuesday and received in Bangalore by Friday! The 3-piece fitting is spot on and the contrasting dupatta is so graceful. Gaurav and Sonica’s personal touch & packaging really shows.',
      date: '1 week ago',
      initials: 'PR',
      avatarBg: 'bg-[#34A853] text-white',
    },
    {
      id: 3,
      name: 'Meera Kulkarni',
      location: 'Mumbai',
      badge: 'Local Guide • 16 reviews',
      rating: 5,
      productName: 'Sunshine Yellow Hand-Embroidered Kurti',
      comment:
        'Saga Fabrics has become my go-to ethnic wear store. The breathable cotton threadwork is airy and comfortable for all-day office wear. Wore it to work and received so many compliments!',
      date: '2 weeks ago',
      initials: 'MK',
      avatarBg: 'bg-[#FBBC04] text-[#2B2723]',
    },
    {
      id: 4,
      name: 'Kavita Mathur',
      location: 'Lucknow',
      badge: 'Verified Google Buyer',
      rating: 5,
      productName: 'Slate Powder Blue Stitched Kurti Set',
      comment:
        'Living in Lucknow, I am very particular about needlework and thread tension. The finish on these suits is top-tier pure handcraft. The WhatsApp team even guided me on the right size beforehand!',
      date: '3 weeks ago',
      initials: 'KM',
      avatarBg: 'bg-[#EA4335] text-white',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF6F1] relative overflow-hidden border-b border-[#E4D9CC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2B2723] bg-white px-4 py-1.5 rounded-full border border-[#E4D9CC] shadow-2xs">
            <GoogleIcon className="w-4 h-4 shrink-0" size="16px" />
            <span>Google Customer Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2B2723] tracking-tight">
            Verified Reviews by Real Customers
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8178] leading-relaxed">
            Read authentic feedback from women across India who wear and love Saga Fabrics handcrafted suits & kurtis.
          </p>

          {/* GMB Rating Summary Card */}
          <div className="pt-3 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 sm:gap-4 bg-white px-5 sm:px-6 py-3 rounded-2xl border border-[#E4D9CC] shadow-sm">
              <GoogleIcon className="w-6 h-6 shrink-0" size="24px" />
              
              <div className="flex items-center gap-1.5 border-r border-[#E4D9CC] pr-3 sm:pr-4">
                <span className="text-lg font-bold text-[#2B2723] font-serif">4.9</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#FBBC04] text-[#FBBC04]"
                    />
                  ))}
                </div>
              </div>

              <div className="text-left text-xs">
                <p className="font-bold text-[#2B2723] flex items-center gap-1">
                  <span>EXCELLENT</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
                </p>
                <p className="text-[10px] text-[#8A8178]">
                  Based on 184+ Google Business Reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid (GMB Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-[#E4D9CC] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3.5">
                {/* Reviewer Header with Google Icon */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${rev.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                    >
                      {rev.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-[#2B2723] leading-snug">
                          {rev.name}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853] shrink-0" />
                      </div>
                      <p className="text-[10px] text-[#8A8178]">{rev.location}</p>
                      <p className="text-[9px] text-[#4285F4] font-medium">{rev.badge}</p>
                    </div>
                  </div>

                  {/* Google Logo Mark on each card */}
                  <div className="p-1.5 rounded-full bg-[#FAF6F1] border border-[#E4D9CC]/60 shrink-0">
                    <GoogleIcon className="w-4 h-4" size="16px" />
                  </div>
                </div>

                {/* Rating Stars in GMB Yellow & Date */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#F3ECE2]">
                  <div className="flex items-center">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#FBBC04] text-[#FBBC04]"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#8A8178] font-medium">
                    {rev.date}
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-xs text-[#615850] leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Verified Product Purchased Pill */}
              <div className="pt-3 border-t border-[#F3ECE2]">
                <div className="bg-[#FAF6F1] p-2 rounded-xl border border-[#E4D9CC] text-[10px] text-[#7A1B38] font-semibold flex items-center justify-between">
                  <span className="truncate">{rev.productName}</span>
                  <span className="text-[9px] font-bold text-[#34A853] uppercase ml-1 shrink-0">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-12 p-6 bg-white rounded-3xl border border-[#E4D9CC] shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#7A1B38]">4.9 / 5.0</p>
            <p className="text-xs text-[#8A8178] font-medium mt-0.5">Google Customer Rating</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#34A853]">100%</p>
            <p className="text-xs text-[#8A8178] font-medium mt-0.5">Pure Breathable Cotton</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#4285F4]">24-Hour</p>
            <p className="text-xs text-[#8A8178] font-medium mt-0.5">Jaipur Dispatch Speed</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#FBBC04]">Zero Defects</p>
            <p className="text-xs text-[#8A8178] font-medium mt-0.5">Hand-Inspected by Founders</p>
          </div>
        </div>

      </div>
    </section>
  );
};

