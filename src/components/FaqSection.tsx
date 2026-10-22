'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface FaqSectionProps {
  onOpenSizeChart?: () => void;
}

const FAQS: { q: string; a: React.ReactNode; sizeChart?: boolean }[] = [
  {
    q: 'Is the fabric really pure cotton?',
    a: 'Yes. Our cotton suits and kurtis are pure cotton — no polyester blends. The festive short kurtis are silk with a soft inner lining, and each product page lists the exact fabric.',
  },
  {
    q: 'What comes in an unstitched suit set?',
    a: 'Around 2.5 m for the kurta, 2.5 m for the bottom and 2.25 m for the dupatta — enough for your tailor to stitch any size from XS to 5XL.',
  },
  {
    q: 'How do I pick the right size?',
    a: 'Stitched pieces follow standard Indian sizes (XS to XXL). Check the size chart, or send us your bust and length on WhatsApp and we’ll tell you which size to order.',
    sizeChart: true,
  },
  {
    q: 'How fast is delivery?',
    a: 'We dispatch within 24 hours from Jaipur. Most orders reach you in 2–4 working days, and shipping is free across India.',
  },
  {
    q: 'What if something is wrong with my order?',
    a: (
      <>
        If a piece arrives damaged or wrong, send us the unboxing video within 7 days and we’ll replace it free. For
        stitched kurtis and suits you can exchange the size within 7 days — you only pay the return courier. Details
        are in our{' '}
        <Link href="/refund-policy" className="text-[#7A1B38] underline underline-offset-2">
          refund policy
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Which payment methods do you take?',
    a: 'UPI (GPay, PhonePe, Paytm), debit and credit cards, and net banking — all through Razorpay’s secure checkout.',
  },
  {
    q: 'How do I wash it?',
    a: 'Hand wash in cold water with a mild detergent and dry in the shade. Silk kurtis are best dry-cleaned.',
  },
];

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenSizeChart }) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-14 md:py-24 bg-[#FAF6F1] border-t border-[#E4D9CC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#A08350]">Questions</p>
          <h2 className="mt-1 text-3xl sm:text-5xl font-serif text-[#2B2723]">Before you order</h2>
        </div>

        <div className="divide-y divide-[#E4D9CC] border-y border-[#E4D9CC]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className="font-serif text-lg sm:text-xl text-[#2B2723]">{f.q}</span>
                  <Plus
                    className={`w-5 h-5 text-[#7A1B38] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-5 -mt-1 text-[15px] text-[#5A524B] leading-relaxed animate-fadeIn">
                    <p>{f.a}</p>
                    {f.sizeChart && onOpenSizeChart && (
                      <button
                        type="button"
                        onClick={onOpenSizeChart}
                        className="mt-3 text-sm font-medium text-[#7A1B38] underline underline-offset-2 cursor-pointer"
                      >
                        Open the size chart
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-[#6F665E]">
          Still unsure?{' '}
          <a
            href="https://wa.me/917023352132"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7A1B38] font-medium underline underline-offset-2"
          >
            Message us on WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  );
};
