'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { trackContact } from '@/lib/metaPixel';
import { SALE, isSaleLive } from '@/lib/sale';

// Product pages have their own sticky Buy bar; checkout/admin need the full screen.
export const showsBottomNav = (pathname: string | null): boolean =>
  !!pathname &&
  !pathname.startsWith('/products/') &&
  !pathname.startsWith('/checkout') &&
  !pathname.startsWith('/admin');

const itemCls = (active: boolean) =>
  `flex flex-col items-center justify-center gap-0.5 h-full text-[10px] tracking-wide transition-colors ${
    active ? 'text-[#7A1B38] font-semibold' : 'text-[#6F665E]'
  }`;

function BottomNavInner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const { cartCount, openCart } = useCart();

  if (!showsBottomNav(pathname)) return null;

  const onSalePage = pathname === '/shop' && params.get('category') === 'sale';
  const saleLive = isSaleLive();

  return (
    <>
      {/* Spacer so page content never hides behind the fixed bar */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <nav
        aria-label="Quick navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4D9CC] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-16">
          <Link href="/" className={itemCls(pathname === '/')}>
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link href="/shop" className={itemCls(pathname === '/shop' && !onSalePage)}>
            <LayoutGrid className="w-5 h-5" />
            Shop
          </Link>

          {saleLive ? (
            <Link href="/shop?category=sale" className="relative flex flex-col items-center justify-end pb-2 h-full">
              <span
                className={`absolute -top-4 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md ${
                  onSalePage ? 'bg-[#7A1B38]' : 'bg-[#5C1329]'
                }`}
              >
                <Sparkles className="w-5 h-5 text-[#F6E7C1]" />
              </span>
              <span className={`text-[10px] tracking-wide ${onSalePage ? 'text-[#7A1B38] font-semibold' : 'text-[#7A1B38]'}`}>
                {SALE.name.split(' ')[0]} Sale
              </span>
            </Link>
          ) : (
            <Link href="/#faq" className={itemCls(false)}>
              <Sparkles className="w-5 h-5" />
              FAQs
            </Link>
          )}

          <button type="button" onClick={openCart} className={`${itemCls(false)} relative cursor-pointer`}>
            <span className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#7A1B38] text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </span>
            Bag
          </button>

          <a
            href="https://wa.me/917023352132"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContact('WhatsApp Support', 'Bottom Nav')}
            className={itemCls(false)}
          >
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" size="20px" />
            Help
          </a>
        </div>
      </nav>
    </>
  );
}

export const MobileBottomNav: React.FC = () => (
  <Suspense fallback={null}>
    <BottomNavInner />
  </Suspense>
);
