'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, Ruler, ChevronDown, ArrowRight, Search } from 'lucide-react';
import { trackContact, trackSearch } from '@/lib/metaPixel';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useCart } from '@/context/CartContext';
import { CATEGORIES, CategoryFilter, shopHref, maxSaleDiscount } from '@/lib/catalog';
import { SALE, isSaleLive } from '@/lib/sale';
import { SaleCountdown } from '@/components/SaleCountdown';
import { useProducts } from '@/context/ProductsContext';

export type { CategoryFilter } from '@/lib/catalog';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSizeChart?: () => void;
  hideSizeGuide?: boolean;
  activeCategory?: CategoryFilter;
  onSelectCategory?: (category: CategoryFilter) => void;
}

const linkCls =
  "hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all";

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSizeChart,
  hideSizeGuide = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saleLive = isSaleLive();
  const products = useProducts();

  let liveCartCount = 0;
  let liveOpenCart = onOpenCart;
  try {
    const cartContext = useCart();
    liveCartCount = cartContext.cartCount;
    if (!liveOpenCart) {
      liveOpenCart = cartContext.openCart;
    }
  } catch (e) {}

  const effectiveCartCount = cartCount !== undefined ? cartCount : liveCartCount;
  const effectiveOpenCart = onOpenCart || liveOpenCart;

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setDesktopDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDesktopDropdownOpen(false);
    }, 200);
  };

  const closeMenus = (categoryKey?: CategoryFilter) => {
    setDesktopDropdownOpen(false);
    setMobileMenuOpen(false);
    if (categoryKey && categoryKey !== 'All') trackSearch(categoryKey);
  };

  const handleSizeGuideClick = () => {
    if (onOpenSizeChart) {
      onOpenSizeChart();
      return;
    }
    const el = typeof document !== 'undefined' ? document.getElementById('size-chart-section') : null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/#faq';
    }
  };

  const menuCategories = saleLive ? CATEGORIES : CATEGORIES.filter((c) => c.key !== 'Sale');

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F1]/95 backdrop-blur-md border-b border-[#E4D9CC]">
      {/* Announcement bar */}
      {saleLive ? (
        <Link
          href="/shop?category=sale"
          className="block bg-[#5C1329] text-[#F6E7C1] text-[11px] sm:text-xs py-2 px-4 border-b border-[#D9B871]/25"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-center">
            <span className="font-semibold tracking-wide">
              {SALE.name}: up to {maxSaleDiscount(products)}% off
            </span>
            <span className="text-[#D9B871]">·</span>
            <span>
              Ends in <SaleCountdown className="font-semibold" />
            </span>
            <span className="hidden sm:inline text-[#D9B871]">·</span>
            <span className="hidden sm:inline">Free shipping across India</span>
          </div>
        </Link>
      ) : (
        <div className="bg-[#7A1B38] text-[#FAF6F1] text-[11px] sm:text-xs py-2 px-4 text-center">
          Handcrafted in Jaipur · Free shipping across India
        </div>
      )}

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
        <div className="grid grid-cols-3 items-center h-16 md:h-20">
          {/* Left */}
          <div className="flex items-center justify-start gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-1 rounded-full hover:bg-[#F3ECE2] text-[#2B2723] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest font-semibold text-[#2B2723]">
              <Link href="/shop" className={linkCls}>
                Shop
              </Link>

              <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <button
                  type="button"
                  onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                  className={`hover:text-[#7A1B38] transition-colors py-1 flex items-center gap-1.5 cursor-pointer uppercase tracking-widest ${
                    desktopDropdownOpen ? 'text-[#7A1B38]' : ''
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${desktopDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {desktopDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E4D9CC] p-1.5 z-50 animate-fadeIn normal-case tracking-normal">
                    {menuCategories.map((cat) => (
                      <Link
                        key={cat.key}
                        href={shopHref(cat.key)}
                        onClick={() => closeMenus(cat.key)}
                        className={`w-full px-3.5 py-2.5 rounded-lg text-left text-sm flex items-center justify-between hover:bg-[#FAF6F1] ${
                          cat.key === 'Sale' ? 'text-[#7A1B38] font-semibold' : 'text-[#2B2723] hover:text-[#7A1B38] font-medium'
                        }`}
                      >
                        {cat.label}
                      </Link>
                    ))}
                    <Link
                      href="/shop"
                      onClick={() => closeMenus()}
                      className="mt-1 pt-2 border-t border-[#F3ECE2] w-full px-3.5 py-2 rounded-lg text-sm font-medium text-[#8A8178] hover:text-[#7A1B38] flex items-center justify-between"
                    >
                      <span>Shop all</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {saleLive && (
                <Link href="/shop?category=sale" className={`${linkCls} text-[#7A1B38]`}>
                  {SALE.name}
                </Link>
              )}
            </nav>
          </div>

          {/* Center logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center justify-center py-1">
              <Image
                src="/images/saga-fabrics-new.png"
                alt="Saga Fabrics"
                width={180}
                height={64}
                priority
                className="w-auto object-contain h-12 md:h-16"
              />
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-1 sm:gap-6">
            <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest font-semibold text-[#2B2723]">
              <Link href="/#craft-story" className={linkCls}>
                Our Story
              </Link>
              {!hideSizeGuide && (
                <button
                  type="button"
                  onClick={handleSizeGuideClick}
                  className={`${linkCls} cursor-pointer flex items-center gap-1 uppercase tracking-widest font-semibold text-xs`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              )}
              <Link href="/#faq" className={linkCls}>
                FAQs
              </Link>
            </nav>

            <Link
              href="/shop"
              aria-label="Search products"
              className="md:hidden p-2 rounded-full text-[#2B2723] hover:bg-[#F3ECE2]"
            >
              <Search className="w-5 h-5" />
            </Link>

            <button
              onClick={effectiveOpenCart}
              className="relative p-2 md:p-2.5 rounded-full md:bg-white md:border border-[#E4D9CC] hover:border-[#7A1B38] text-[#2B2723] hover:text-[#7A1B38] transition-all shrink-0 cursor-pointer"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {effectiveCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7A1B38] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {effectiveCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6F1] border-t border-[#E4D9CC] px-4 pt-3 pb-6 animate-fadeIn max-h-[80vh] overflow-y-auto">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8A8178]">Shop by category</p>
          <div className="grid grid-cols-2 gap-2">
            {menuCategories.map((cat) => (
              <Link
                key={cat.key}
                href={shopHref(cat.key)}
                onClick={() => closeMenus(cat.key)}
                className={`px-3 py-3 rounded-lg border text-sm ${
                  cat.key === 'Sale'
                    ? 'bg-[#5C1329] border-[#5C1329] text-[#F6E7C1] font-semibold'
                    : 'bg-white border-[#E4D9CC] text-[#2B2723]'
                }`}
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => closeMenus()}
              className="col-span-2 px-3 py-3 rounded-lg border border-[#2B2723] text-sm text-center font-medium"
            >
              Shop all products
            </Link>
          </div>

          <nav className="mt-5 pt-3 border-t border-[#E4D9CC] flex flex-col text-sm text-[#2B2723]">
            <Link href="/#craft-story" onClick={() => closeMenus()} className="px-2 py-3 border-b border-[#EFE6DA]">
              Our story
            </Link>
            {!hideSizeGuide && (
              <button
                type="button"
                onClick={() => {
                  closeMenus();
                  handleSizeGuideClick();
                }}
                className="px-2 py-3 border-b border-[#EFE6DA] text-left cursor-pointer"
              >
                Size guide
              </button>
            )}
            <Link href="/#location" onClick={() => closeMenus()} className="px-2 py-3 border-b border-[#EFE6DA]">
              Visit our Jaipur studio
            </Link>
            <Link href="/#faq" onClick={() => closeMenus()} className="px-2 py-3 border-b border-[#EFE6DA]">
              Fabric care & FAQs
            </Link>
            <a
              href="https://wa.me/917023352132"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact('WhatsApp Support', 'Navbar Menu')}
              className="px-2 py-3 flex items-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" size="16px" />
              WhatsApp us: +91 70233 52132
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
