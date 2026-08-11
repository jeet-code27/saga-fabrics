'use client';

import React from 'react';
import { Award, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

export const BrandTrust: React.FC = () => {
  return (
    <section className="py-12 bg-[#FAF6F1] border-b border-[#DCD3C7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          
          <div className="flex items-start gap-4 justify-center sm:justify-start group">
            <div className="w-12 h-12 rounded-2xl bg-[#7FA79A]/15 border border-[#7FA79A]/30 flex items-center justify-center text-[#65897D] shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-serif font-semibold text-[#2B2723]">100% Jaipur Artisanal</h4>
              <p className="text-xs text-[#8A8178] mt-1 leading-relaxed">Handcrafted by traditional master artisans in Jaipur, Rajasthan.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center sm:justify-start group">
            <div className="w-12 h-12 rounded-2xl bg-[#E88DAE]/15 border border-[#E88DAE]/30 flex items-center justify-center text-[#E88DAE] shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-serif font-semibold text-[#2B2723]">Free Express Delivery</h4>
              <p className="text-xs text-[#8A8178] mt-1 leading-relaxed">Complimentary doorstep delivery across all PIN codes in India.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center sm:justify-start group">
            <div className="w-12 h-12 rounded-2xl bg-[#7FA79A]/15 border border-[#7FA79A]/30 flex items-center justify-center text-[#65897D] shrink-0 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-serif font-semibold text-[#2B2723]">100% Quality Inspected</h4>
              <p className="text-xs text-[#8A8178] mt-1 leading-relaxed">Every unstitched fabric length undergoes strict quality check. (No Returns Policy)</p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center sm:justify-start group">
            <div className="w-12 h-12 rounded-2xl bg-[#65897D]/15 border border-[#65897D]/30 flex items-center justify-center text-[#65897D] shrink-0 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-serif font-semibold text-[#2B2723]">Razorpay Secured</h4>
              <p className="text-xs text-[#8A8178] mt-1 leading-relaxed">Safe instant payments via UPI, Credit/Debit & NetBanking.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
