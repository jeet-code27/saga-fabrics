'use client';

import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Ananya Sharma',
      location: 'New Delhi',
      rating: 5,
      productName: 'Gulabi Baugh Chikankari Set',
      comment: 'The Gulabi Baugh Chikankari set exceeded all my expectations! The pure cotton fabric is extraordinarily soft for Delhi heat, and the intricate needlework looks like it cost 3x more.',
      date: 'Verified Buyer • 2 days ago',
      initials: 'AS',
      avatarBg: 'bg-[#7FA79A]/15 text-[#65897D]',
    },
    {
      id: 2,
      name: 'Priya Ramachandran',
      location: 'Bengaluru',
      rating: 5,
      productName: 'Amer Turquoise Handblock Set',
      comment: 'Ordered on Tuesday and received in Bangalore by Friday! The fitting is spot on true to size, and the handblock prints have that unmistakable authentic Jaipur charm.',
      date: 'Verified Buyer • 1 week ago',
      initials: 'PR',
      avatarBg: 'bg-[#E88DAE]/15 text-[#E88DAE]',
    },
    {
      id: 3,
      name: 'Meera Kulkarni',
      location: 'Mumbai',
      rating: 5,
      productName: 'Rani Pink Royalty 3-Piece Suit',
      comment: 'Saga Fabrics has become my absolute favorite for ethnic wear. The Rani Pink suit dupatta is so airy and elegant. Got so many compliments at my niece’s sangeet!',
      date: 'Verified Buyer • 2 weeks ago',
      initials: 'MK',
      avatarBg: 'bg-[#7FA79A]/15 text-[#65897D]',
    },
    {
      id: 4,
      name: 'Kavita Mathur',
      location: 'Jaipur',
      rating: 5,
      productName: 'Jaipur Pearl White Tunic',
      comment: 'Living in Jaipur, I know authentic handblock and Chikankari work. The stitch density and fabric finish are top-tier. Highly recommended for daily understated luxury.',
      date: 'Verified Buyer • 3 weeks ago',
      initials: 'KM',
      avatarBg: 'bg-[#E88DAE]/15 text-[#E88DAE]',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#EDE6DC] relative overflow-hidden border-b border-[#DCD3C7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#65897D] bg-[#7FA79A]/15 px-4 py-1.5 rounded-full border border-[#7FA79A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#E88DAE]" /> Customer Love & Reviews
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2B2723] tracking-tight">
            Loved by Women Across India
          </h2>
          
          {/* Rating Summary Bar */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="flex items-center text-[#E88DAE]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-sm font-serif font-bold text-[#2B2723]">Top Rated</span>
            <span className="text-xs text-[#8A8178]">(Verified Buyer Reviews)</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-[#DCD3C7] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#E88DAE]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#7FA79A]/30" />
                </div>

                {/* Review Comment */}
                <p className="text-xs text-[#8A8178] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Customer Author Info */}
              <div className="pt-3 border-t border-[#EDE6DC] space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${rev.avatarBg} flex items-center justify-center font-serif font-bold text-xs shrink-0`}>
                    {rev.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[#2B2723]">{rev.name}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7FA79A]" />
                    </div>
                    <p className="text-[10px] text-[#8A8178]">{rev.location}</p>
                  </div>
                </div>

                <div className="bg-[#FAF6F1] p-2 rounded-xl border border-[#DCD3C7] text-[10px] text-[#65897D] font-semibold flex items-center justify-between">
                  <span className="truncate">{rev.productName}</span>
                  <span className="text-[9px] text-[#8A8178]">Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Social Proof Counter Strip */}
        <div className="mt-12 p-6 bg-white rounded-3xl border border-[#DCD3C7] shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#65897D]">Pan-India</p>
            <p className="text-xs text-[#8A8178] font-medium mt-1">Trusted Presence</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#E88DAE]">99.2%</p>
            <p className="text-xs text-[#8A8178] font-medium mt-1">Positive Fit Rating</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#7FA79A]">100%</p>
            <p className="text-xs text-[#8A8178] font-medium mt-1">Authentic Jaipur Cotton</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#2B2723]">7 Days</p>
            <p className="text-xs text-[#8A8178] font-medium mt-1">Free Size Exchange</p>
          </div>
        </div>

      </div>
    </section>
  );
};
