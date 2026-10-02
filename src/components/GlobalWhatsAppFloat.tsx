'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { trackContact } from '@/lib/metaPixel';
import { trackGAContact } from '@/lib/gtag';

export const GlobalWhatsAppFloat: React.FC = () => {
  const pathname = usePathname();

  // On individual product pages, the product-specific Quick Order button is rendered
  if (pathname && pathname.startsWith('/products/')) {
    return null;
  }

  const defaultMessage = encodeURIComponent(
    'Hello Saga Fabrics! I am browsing your handcrafted collection and have a question regarding suits, sizing & delivery. Please assist me!'
  );

  return (
    <aside className="fixed bottom-6 right-5 sm:right-8 z-40 group animate-fadeIn">
      <a
        href={`https://wa.me/917023352132?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackContact('Global WhatsApp Float', 'Storefront Support');
          trackGAContact('Global WhatsApp Float');
        }}
        aria-label="Chat with Saga Fabrics on WhatsApp"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BE5C] text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ring-4 ring-white/90 border border-[#20BE5C] cursor-pointer"
        title="Chat on WhatsApp (+91 70233 52132)"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" size="20px" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
};
