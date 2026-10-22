'use client';

import React from 'react';
import { Hand, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

const ITEMS = [
  { icon: Hand, title: 'Handmade in Jaipur', text: 'Embroidered by hand' },
  { icon: Truck, title: 'Free shipping', text: 'Anywhere in India' },
  { icon: RefreshCw, title: '7-day size exchange', text: 'On stitched pieces' },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'UPI, cards via Razorpay' },
];

export const BrandTrust: React.FC = () => {
  return (
    <section className="bg-[#FAF6F1] border-b border-[#E4D9CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-7 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#F3ECE2] text-[#7A1B38] flex items-center justify-center shrink-0">
              <Icon className="w-[18px] h-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] sm:text-sm font-semibold text-[#2B2723] leading-tight">{title}</p>
              <p className="text-[11px] sm:text-xs text-[#8A8178] leading-tight mt-0.5">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
