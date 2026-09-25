'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Sparkles, Menu, X, Phone, MapPin, Ruler } from 'lucide-react';
import { trackContact } from '@/lib/metaPixel';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSizeChart?: () => void;
  hideSizeGuide?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount = 0, onOpenCart, onOpenSizeChart, hideSizeGuide = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F1]/90 backdrop-blur-md border-b border-[#E4D9CC] transition-all">

      {/* Announcement Top Bar in Royal Burgundy */}
      <div className="bg-[#7A1B38] text-[#FAF6F1] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium tracking-wide">

          <div className="hidden sm:flex items-center gap-4 mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-[#FDF4F6]">
              <Sparkles className="w-3.5 h-3.5 text-[#B59757]" /> Handcrafted Ethnic Suits & Kurtis Collection
            </span>
            <span className="text-[#FAF6F1]/40">•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B59757]" /> Premium Artisanal Suits, Kurtis & Fabrics
            </span>
            <span className="text-[#FAF6F1]/40">•</span>
            <span className="font-bold text-white tracking-wider">FREE EXPRESS SHIPPING ACROSS INDIA</span>
          </div>

          <div className="flex sm:hidden items-center justify-center w-full text-center">
            <span className="inline-flex items-center gap-1.5 text-[#FDF4F6] font-medium text-[11px] truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#B59757] shrink-0" />
              <span>Handcrafted Suits & Kurtis • Free Express Delivery</span>
            </span>
          </div>

        </div>
      </div>

      {/* Main Balanced Navbar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-3 items-center h-20">

          {/* Left Column: Menu Links (Desktop) & Mobile Toggle */}
          <div className="flex items-center justify-start gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#F3ECE2] text-[#2B2723] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-[#2B2723]">
              <Link href="/#collection" className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all">
                Collection
              </Link>
              <Link href="/#categories" className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all">
                Crafts
              </Link>
            </nav>
          </div>

          {/* Center Column: Perfectly Centered Brand Logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className="group flex items-center justify-center py-1">
              <Image
                src="/images/saga-fabrics-new.png"
                alt="Saga Fabrics"
                width={180}
                height={64}
                priority
                className="max-h-16 w-auto object-contain transition-transform group-hover:scale-105"
                style={{ height: '64px', width: 'auto' }}
              />
            </Link>
          </div>

          {/* Right Column: Menu Links (Desktop) & Cart */}
          <div className="flex items-center justify-end gap-6">
            <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-[#2B2723]">
              <Link href="/#craft-story" className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all">
                Our Story
              </Link>
              {!hideSizeGuide && (
                <button
                  type="button"
                  onClick={handleSizeGuideClick}
                  className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all cursor-pointer flex items-center gap-1 uppercase tracking-widest font-semibold text-xs"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              )}
              <Link href="/#faq" className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all">
                FAQs
              </Link>
            </nav>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white border border-[#E4D9CC] hover:border-[#7A1B38] text-[#2B2723] hover:text-[#7A1B38] transition-all shadow-xs group shrink-0"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#7A1B38] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6F1] border-b border-[#E4D9CC] px-6 pt-2 pb-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#2B2723]">
            <Link
              href="/#collection"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F3ECE2] text-[#7A1B38] font-bold flex items-center justify-between"
            >
              <span>🌸 Suits & Kurtis Collection</span>
              <span className="text-xs bg-[#7A1B38]/10 px-2.5 py-0.5 rounded-full text-[#7A1B38]">Featured</span>
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F3ECE2] text-[#2B2723]"
            >
              ✨ Artisanal Crafts
            </Link>
            <Link
              href="/#craft-story"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F3ECE2] text-[#2B2723]"
            >
              🌿 Our Craft Story
            </Link>
            {!hideSizeGuide && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSizeGuideClick();
                }}
                className="p-2.5 rounded-xl hover:bg-[#F3ECE2] text-[#2B2723] flex items-center justify-between w-full text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#7A1B38]" />
                  <span>Women's Size Guide (Chart)</span>
                </span>
                <span className="text-[10px] bg-[#65897D]/15 text-[#65897D] font-bold px-2 py-0.5 rounded-full">CM & INCH</span>
              </button>
            )}
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F3ECE2] text-[#2B2723]"
            >
              ❓ Fabric Care & FAQs
            </Link>
            <div className="pt-2 border-t border-[#E4D9CC] text-xs text-[#8A8178] flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#7A1B38]" />
              <a
                href="https://wa.me/917023352132"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact('WhatsApp Support', 'Navbar Menu')}
                className="hover:underline"
              >
                WhatsApp Support: +91 70233 52132
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
