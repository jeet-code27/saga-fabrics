'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  MapPin,
  Ruler,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { trackContact, trackSearch } from '@/lib/metaPixel';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useCart } from '@/context/CartContext';

export type CategoryFilter =
  | 'All'
  | 'End of Season Sale'
  | 'Unstitched'
  | 'Stitched'
  | 'Short Kurti'
  | '3-Piece Set';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSizeChart?: () => void;
  hideSizeGuide?: boolean;
  activeCategory?: CategoryFilter;
  onSelectCategory?: (category: CategoryFilter) => void;
}

export const CATEGORIES_NAV = [
  {
    key: 'End of Season Sale' as CategoryFilter,
    slug: 'sale',
    label: 'End of Season Sale',
    isSale: true,
  },
  {
    key: 'Unstitched' as CategoryFilter,
    slug: 'unstitched',
    label: 'Unstitched Suits',
  },
  {
    key: 'Stitched' as CategoryFilter,
    slug: 'stitched',
    label: 'Stitched Suits',
  },
  {
    key: 'Short Kurti' as CategoryFilter,
    slug: 'short-kurti',
    label: 'Short Kurtis',
  },
  {
    key: '3-Piece Set' as CategoryFilter,
    slug: '3-piece-set',
    label: '3-Piece Sets',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSizeChart,
  hideSizeGuide = false,
  activeCategory,
  onSelectCategory,
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(true);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleCategoryClick = (categoryKey: CategoryFilter, slug: string) => {
    setDesktopDropdownOpen(false);
    setMobileMenuOpen(false);
    trackSearch(categoryKey);

    if (onSelectCategory) {
      onSelectCategory(categoryKey);
      const el = document.getElementById('collection');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/?category=${slug}#collection`);
    }
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

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F1]/95 backdrop-blur-md border-b border-[#E4D9CC] transition-all shadow-2xs">
      
      {/* Announcement Top Bar in Royal Burgundy */}
      <div className="bg-[#7A1B38] text-[#FAF6F1] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium tracking-wide">
          <div className="hidden sm:flex items-center gap-4 mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 text-[#FDF4F6]">
              <Sparkles className="w-3.5 h-3.5 text-[#B59757]" /> Handcrafted Ethnic Suits & Kurtis
            </span>
            <span className="text-[#FAF6F1]/40">•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B59757]" /> Direct Jaipur Atelier Dispatch
            </span>
            <span className="text-[#FAF6F1]/40">•</span>
            <span className="font-bold text-white tracking-wider">
              FREE EXPRESS SHIPPING PAN-INDIA
            </span>
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
              className="md:hidden p-2 rounded-full hover:bg-[#F3ECE2] text-[#2B2723] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest font-semibold text-[#2B2723]">
              {/* All Collection Link */}
              <Link
                href="/#collection"
                onClick={() => {
                  if (onSelectCategory) onSelectCategory('All');
                }}
                className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all cursor-pointer"
              >
                Collection
              </Link>

              {/* Categories Dropdown Menu */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                  className={`hover:text-[#7A1B38] transition-colors relative py-1 flex items-center gap-1.5 cursor-pointer group ${
                    desktopDropdownOpen ? 'text-[#7A1B38]' : ''
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      desktopDropdownOpen ? 'rotate-180 text-[#7A1B38]' : 'text-[#8A8178] group-hover:text-[#7A1B38]'
                    }`}
                  />
                </button>

                {/* Desktop Dropdown Panel */}
                {desktopDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E4D9CC] py-2 px-1.5 z-50 animate-fadeIn"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-0.5">
                      {CATEGORIES_NAV.map((cat) => {
                        const isSale = cat.isSale;
                        const isActive = activeCategory === cat.key;

                        return (
                          <button
                            key={cat.key}
                            type="button"
                            onClick={() => handleCategoryClick(cat.key, cat.slug)}
                            className={`w-full px-3.5 py-2.5 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer group ${
                              isActive
                                ? 'bg-[#7A1B38]/10 text-[#7A1B38] font-bold'
                                : isSale
                                ? 'hover:bg-rose-50 text-[#E11D48] font-medium'
                                : 'hover:bg-[#FAF6F1] text-[#2B2723] hover:text-[#7A1B38] font-medium'
                            }`}
                          >
                            <span className="text-xs tracking-wide">
                              {cat.label}
                            </span>
                            {isSale && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E11D48]/10 text-[#E11D48]">
                                Sale
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* View All Option */}
                    <div className="pt-1 mt-1 border-t border-[#F3ECE2]">
                      <button
                        type="button"
                        onClick={() => handleCategoryClick('All', 'all')}
                        className="w-full px-3.5 py-2 rounded-xl text-left text-xs font-semibold text-[#8A8178] hover:text-[#7A1B38] hover:bg-[#FAF6F1] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>All Collection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Crafts Link */}
              <Link
                href="/#categories"
                className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all"
              >
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
            <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest font-semibold text-[#2B2723]">
              <Link
                href="/#craft-story"
                className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all"
              >
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

              <Link
                href="/#location"
                className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-[#B59757]" />
                <span>Atelier</span>
              </Link>

              <Link
                href="/#faq"
                className="hover:text-[#7A1B38] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#7A1B38] hover:after:w-full after:transition-all"
              >
                FAQs
              </Link>
            </nav>

            {/* Cart Trigger Button */}
            <button
              onClick={effectiveOpenCart}
              className="relative p-2.5 rounded-full bg-white border border-[#E4D9CC] hover:border-[#7A1B38] text-[#2B2723] hover:text-[#7A1B38] transition-all shadow-xs group shrink-0 cursor-pointer"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
              {effectiveCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#7A1B38] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-scaleIn">
                  {effectiveCartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6F1] border-b border-[#E4D9CC] px-5 pt-3 pb-6 space-y-4 animate-fadeIn max-h-[85vh] overflow-y-auto">
          
          {/* Mobile Categories Section */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#7A1B38] p-2 rounded-xl bg-[#7A1B38]/5 border border-[#7A1B38]/10 cursor-pointer"
            >
              <span>🌸 Shop By Category</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileCategoriesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {mobileCategoriesOpen && (
              <div className="space-y-1 pl-1 pr-1 pt-1">
                {CATEGORIES_NAV.map((cat) => {
                  const isSale = cat.isSale;
                  const isActive = activeCategory === cat.key;

                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleCategoryClick(cat.key, cat.slug)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-left text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#7A1B38]/10 text-[#7A1B38] font-bold'
                          : isSale
                          ? 'bg-rose-50/70 text-[#E11D48] font-medium'
                          : 'hover:bg-[#FAF6F1] text-[#2B2723] font-medium'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {isSale ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E11D48]/10 text-[#E11D48]">
                          Sale
                        </span>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-[#8A8178]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Standard Navigation Links */}
          <nav className="flex flex-col space-y-2 text-sm font-medium text-[#2B2723] pt-2 border-t border-[#E4D9CC]">
            <Link
              href="/#collection"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory('All');
              }}
              className="p-2.5 rounded-xl hover:bg-[#F3ECE2] text-[#2B2723] flex items-center justify-between"
            >
              <span>All Collection</span>
              <span className="text-xs bg-[#F3ECE2] px-2 py-0.5 rounded-md text-[#7A1B38] font-bold">
                31+ Pieces
              </span>
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
              🌿 Our Story (Gaurav & Sonica)
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
                <span className="text-[10px] bg-[#65897D]/15 text-[#65897D] font-bold px-2 py-0.5 rounded-full">
                  CM & INCH
                </span>
              </button>
            )}

            <Link
              href="/#location"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F3ECE2] text-[#2B2723] flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#B59757]" />
              <span>Jaipur Atelier & Google Map</span>
            </Link>

            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-[#F3ECE2] text-[#2B2723]"
            >
              ❓ Fabric Care & FAQs
            </Link>

            <div className="pt-2 border-t border-[#E4D9CC] text-xs text-[#8A8178] flex items-center gap-2">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" size="16px" />
              <a
                href="https://wa.me/917023352132"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact('WhatsApp Support', 'Navbar Menu')}
                className="hover:underline text-[#2B2723] font-medium"
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
