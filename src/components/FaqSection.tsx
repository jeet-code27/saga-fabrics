'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Are your suits & kurtis 100% pure cotton & breathable?',
      answer: 'Yes, absolutely! Every Saga Fabrics suit and kurti is crafted from 100% pure organic cotton, Chanderi cotton, or soft Mulmul, complete with a breathable pure cotton dupatta for suit sets. We never use synthetic polyester blends.',
    },
    {
      question: 'Are these suits and kurtis stitched or unstitched?',
      answer: 'We offer authentic unstitched Chikankari suit sets (Top material: ~2.5m, Bottom material: ~2.5m, Pure Cotton Dupatta: ~2.25m) as well as crafted short kurtis. Our suit sets are designed for custom boutique stitching so you can get them tailored to your perfect fit and style.',
    },
    {
      question: 'How long does express shipping take across India?',
      answer: 'All orders are packed with care and dispatched from our studio within 24 hours. Express delivery arrives within 2 to 4 business days across all PIN codes in India, complete with live tracking.',
    },
    {
      question: 'Is instant Razorpay checkout safe? Can I pay with UPI?',
      answer: 'Yes! We integrate with Razorpay using 256-bit bank-grade SSL encryption. You can complete payment instantly via Google Pay, PhonePe, Paytm, Credit/Debit cards, or NetBanking.',
    },
    {
      question: 'How should I wash and care for Chikankari suits and kurtis?',
      answer: 'We recommend gentle hand washing in cold water with a mild detergent for the first few washes. Avoid harsh bleaching. Line dry in shade to preserve natural thread embroidery.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#FAF6F1] border-b border-[#DCD3C7]">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#65897D] bg-[#7FA79A]/15 px-4 py-1.5 rounded-full border border-[#7FA79A]/30">
            <HelpCircle className="w-3.5 h-3.5 text-[#E88DAE]" /> Got Questions?
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2B2723] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#8A8178]">
            Everything you need to know about our handcrafted Chikankari suits, kurtis, fabrics, sizing, shipping & payments.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#DCD3C7] shadow-2xs overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif font-medium text-base sm:text-lg text-[#2B2723] hover:text-[#65897D] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FAF6F1] text-[#65897D] font-mono text-xs flex items-center justify-center font-bold shrink-0 border border-[#DCD3C7]">
                      Q{idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#65897D] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-[#8A8178] leading-relaxed border-t border-[#EDE6DC]">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
