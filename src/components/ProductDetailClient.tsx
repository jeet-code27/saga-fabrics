'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Size } from '@/types';
import { useCart } from '@/context/CartContext';
import { ProductSizeChart } from '@/components/ProductSizeChart';
import { ProductCard } from '@/components/ProductCard';
import { SALE, isSaleLive, isSaleProduct } from '@/lib/sale';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { trackViewContent, trackAddToCart, trackContact } from '@/lib/metaPixel';
import { trackGAViewItem, trackGAAddToCart, trackGAContact } from '@/lib/gtag';
import {
  Star,
  Shield,
  Truck,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Share2,
  Check,
  MessageCircle,
  Clock,
  Ruler,
  Scissors,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { DeliveryEstimator } from '@/components/DeliveryEstimator';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  pairProducts?: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
  pairProducts = [],
}) => {
  const isJewellery =
    product.tags.includes('Jewellery') ||
    product.tags.includes('Anti Tarnish Jewellery') ||
    product.tags.includes('Artificial Jewellery') ||
    product.title.toLowerCase().includes('jewellery') ||
    product.title.toLowerCase().includes('necklace') ||
    product.title.toLowerCase().includes('choker');

  const isUnstitched =
    !isJewellery && (
      product.sizes?.includes('Unstitched') ||
      product.tags?.includes('Unstitched') ||
      product.title.toLowerCase().includes('unstitched')
    );
  const isStitched = !isUnstitched && !isJewellery;

  const defaultSize: Size = isJewellery
    ? 'Free Size'
    : isStitched && product.sizes && product.sizes.length > 0
    ? product.sizes[0]
    : 'Unstitched';

  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Safeguard: Ensure selectedSize is always valid and available for this product
  React.useEffect(() => {
    if (product.sizes && product.sizes.length > 0 && !product.sizes.includes(selectedSize)) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product.sizes, selectedSize]);


  const currentImage = product.images[selectedImageIndex] || product.images[0];
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const isSale = isSaleProduct(product) && isSaleLive();

  const hasFreeJhumka = product.tags.includes('Free Jhumka');
  const hasFreeBangles = product.tags.includes('Free Bangles');

  // Meta Pixel ViewContent & GA4 view_item event
  React.useEffect(() => {
    trackViewContent(product);
    trackGAViewItem({
      id: product.id,
      title: product.title,
      price: product.price,
      tags: product.tags,
      size: isJewellery ? 'Free Size' : isStitched ? selectedSize : 'Unstitched',
    });
  }, [product, isJewellery, isStitched, selectedSize]);

  const router = useRouter();
  const { addToCart, setDirectBuy } = useCart();

  const handleAddToCart = () => {
    const finalSize = isJewellery ? 'Free Size' : isStitched ? selectedSize : 'Unstitched';
    addToCart(product, finalSize, 1);
  };

  const handleDirectBuyNow = () => {
    const finalSize = isJewellery ? 'Free Size' : isStitched ? selectedSize : 'Unstitched';
    setDirectBuy(product, finalSize, 1);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator
          .share({
            title: product.title,
            text: product.subtitle,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Saga Fabrics! I want to quickly order this handcrafted piece:\n\n• Product: ${product.title}\n• Price: ₹${product.price.toLocaleString('en-IN')}\n• Specification: ${isJewellery ? 'Anti-Tarnish Jewellery Set (Free Size)' : isStitched ? `Size: ${selectedSize}` : 'Unstitched 3-Piece Fabric Set'}${hasFreeJhumka ? '\n• Complimentary Offer: 1 Pair of Traditional Jhumkas Included FREE' : ''}${hasFreeBangles ? '\n• Complimentary Offer: 1 Set of Traditional Bangles Included FREE' : ''}\n• Material/Craft: ${product.fabric}\n• Product Link: ${typeof window !== 'undefined' ? window.location.href : `https://sagafabrics.in/products/${product.id}`}\n\nPlease share delivery details and confirm my order!`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723] selection:bg-[#7A1B38] selection:text-white">
      {/* Header Navbar with full interactivity */}
      <Navbar
        hideSizeGuide={!isStitched}
        onOpenSizeChart={
          isStitched
            ? () => {
                const el = document.getElementById('size-chart-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            : undefined
        }
      />

      {/* Main Product Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 w-full space-y-12 sm:space-y-16">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between text-xs text-[#8A8178] border-b border-[#E4D9CC] pb-4">
        <nav className="flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#7A1B38] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#7A1B38] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#2B2723] font-medium truncate max-w-[200px] sm:max-w-none">
            {product.title}
          </span>
        </nav>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A1B38] hover:text-[#5C142A] bg-white border border-[#DCD3C7] px-3 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Main Product Display (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Hero Image */}
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#EDE6DC] border border-[#DCD3C7] shadow-md group">
            <Image
              src={currentImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />

            {/* Festive sale badge over image */}
            {isSale && (
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="inline-flex items-center text-xs font-semibold tracking-wide px-3 py-1 rounded bg-[#5C1329] text-[#F6E7C1] shadow-md">
                  {SALE.name}
                </span>
              </div>
            )}

            {/* Free Jhumka Offer Badge */}
            {hasFreeJhumka && (
              <div className={`absolute ${isSale ? 'bottom-4' : 'top-4'} left-4 z-10 pointer-events-none`}>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded bg-white/95 text-[#1B4D3E] shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free jhumkas included</span>
                </span>
              </div>
            )}

            {/* Free Bangles Offer Badge */}
            {hasFreeBangles && (
              <div className={`absolute ${isSale ? 'bottom-4' : 'top-4'} left-4 z-10 pointer-events-none`}>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded bg-white/95 text-[#1B4D3E] shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free bangles included</span>
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails (if multiple images) */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 relative rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#7A1B38] ring-2 ring-[#7A1B38]/20 shadow-md scale-102'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 text-xs text-[#8A8178]">
            <div className="p-3 bg-white rounded-2xl border border-[#DCD3C7] flex flex-col items-center text-center gap-1">
              <Truck className="w-5 h-5 text-[#65897D]" />
              <span className="font-bold text-[#2B2723]">Free Shipping</span>
              <span className="text-[10px]">All over India</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#DCD3C7] flex flex-col items-center text-center gap-1">
              <Shield className="w-5 h-5 text-[#65897D]" />
              <span className="font-bold text-[#2B2723]">Secure Payment</span>
              <span className="text-[10px]">UPI & cards</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#DCD3C7] flex flex-col items-center text-center gap-1">
              <Clock className="w-5 h-5 text-[#65897D]" />
              <span className="font-bold text-[#2B2723]">Fast Dispatch</span>
              <span className="text-[10px]">Within 24 Hours</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Purchase Options (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Tag & Rating Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#65897D] font-bold tracking-wider uppercase">
                {product.tags.join(' • ')}
              </span>
              <div className="flex items-center gap-1 text-[#B59757] bg-white px-2.5 py-1 rounded-full border border-[#DCD3C7]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-[#2B2723]">{product.rating}</span>
                <span className="text-[#8A8178]">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-4xl font-serif font-medium text-[#2B2723] leading-snug">
              {product.title}
            </h1>
            <p className="text-sm text-[#8A8178] leading-relaxed">{product.subtitle}</p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#DCD3C7] shadow-sm space-y-3">
            {isSale && (
              <div className="flex items-center justify-between pb-2.5 border-b border-[#F3ECE2]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A1B38]">
                  {SALE.name} price
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-baseline gap-3.5 flex-wrap">
                <span className="text-4xl sm:text-5xl font-serif font-black text-[#7A1B38] tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-lg sm:text-xl text-[#8A8178] line-through font-normal">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#E11D48] bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                  {discountPercent}% OFF
                </span>
              </div>
            </div>

            <span className="text-xs text-[#5C7056] font-medium block">
              Inclusive of all taxes • Free express doorstep delivery across India
            </span>
          </div>

          {/* Complimentary Free Jhumka Offer Banner */}
          {hasFreeJhumka && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/90 via-[#FAF6F1] to-rose-50/90 rounded-3xl border border-amber-300/80 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-[#7A1B38] text-white flex items-center justify-center shrink-0 shadow-xs text-lg">
                ✨
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    Special Festive Offer
                  </span>
                  <span className="text-xs font-bold text-emerald-800">
                    Complimentary Jhumkas Included FREE
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#2B2723]">
                  Buy 1 Handcrafted Kurti, Get 1 Pair of Traditional Jhumkas FREE
                </h4>
                <p className="text-xs text-[#5C554E] leading-relaxed">
                  A matching pair of handcrafted traditional silver jhumka earrings will be packed and shipped along with your kurti at zero additional cost!
                </p>
              </div>
            </div>
          )}

          {/* Complimentary Free Bangles Offer Banner */}
          {hasFreeBangles && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/90 via-[#FAF6F1] to-emerald-50/90 rounded-3xl border border-amber-300/80 shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-[#1B4D3E] text-white flex items-center justify-center shrink-0 shadow-xs text-lg">
                ✨
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    Special Festive Offer
                  </span>
                  <span className="text-xs font-bold text-emerald-800">
                    Complimentary Bangles Included FREE
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#2B2723]">
                  Buy 1 Three-Piece Suit, Get 1 Set of Traditional Bangles FREE
                </h4>
                <p className="text-xs text-[#5C554E] leading-relaxed">
                  An exquisite set of traditional silver oxidized bangles / kadas will be packed and shipped along with your 3-piece suit at zero additional cost!
                </p>
              </div>
            </div>
          )}

          {/* Size Selection Section */}
          {isJewellery ? (
            <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#DCD3C7] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#B59757] tracking-wider block">
                  Jewellery Sizing & Inclusions
                </span>
                <h4 className="font-serif font-bold text-sm text-[#2B2723] mt-0.5">
                  Complete Necklace & Matching Earrings Set
                </h4>
                <p className="text-xs text-[#8A8178] mt-0.5">
                  Adjustable dori / clasp chain fits comfortably for all neck sizes
                </p>
              </div>
              <span className="px-3 py-1.5 bg-[#B59757] text-white text-xs font-bold rounded-xl shrink-0 shadow-2xs">
                Free Size
              </span>
            </div>
          ) : isStitched && product.sizes && product.sizes.length > 0 ? (
            <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#DCD3C7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2B2723]">
                  {product.sizes.length === 1 ? 'Available Stitched Size:' : 'Select Stitched Size:'}{' '}
                  <strong className="text-[#7A1B38] font-bold text-base ml-1">{selectedSize}</strong>
                </span>
                <a
                  href="#size-chart-section"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1B38] hover:text-[#5C142A] bg-[#FAF6F1] hover:bg-[#F3ECE2] px-2.5 py-1 rounded-xl border border-[#DCD3C7] transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#7A1B38]" />
                  <span>Size Chart</span>
                </a>
              </div>

              {/* Size Buttons */}
              <div className={`flex flex-wrap gap-2 ${product.sizes.length > 4 ? 'sm:grid sm:grid-cols-6' : ''}`}>
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 px-5 sm:py-2.5 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer border flex items-center justify-center gap-2 ${
                      selectedSize === sz
                        ? 'bg-[#7A1B38] text-white border-[#7A1B38] shadow-md scale-102'
                        : 'bg-[#FAF6F1] text-[#2B2723] border-[#DCD3C7] hover:border-[#7A1B38]'
                    }`}
                  >
                    <span>{product.sizes && product.sizes.length === 1 ? (sz === 'XL' ? `Size ${sz} (Size 42)` : `Size ${sz}`) : sz}</span>
                    {product.sizes && product.sizes.length === 1 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        In Stock
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {product.sizes.length === 1 ? (
                <p className="text-[11px] text-[#7A1B38] font-medium flex items-center gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#B59757]" />
                  <span>
                    {isSale
                      ? `Season's End Clearance: Only Size ${product.sizes[0]} is available in this piece.`
                      : `Exclusive Tailored Piece: Handcrafted in ready-to-wear Size ${product.sizes[0]} (Size 42 / 42" Bust).`}
                  </span>
                </p>
              ) : (
                <p className="text-[11px] text-[#8A8178]">
                  Stitched and ready to wear. Check the detailed measurements chart below.
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#DCD3C7] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#65897D] tracking-wider block">
                  Sizing & Fit Specification
                </span>
                <h4 className="font-serif font-bold text-sm text-[#2B2723] mt-0.5">
                  100% Unstitched Fabric Set
                </h4>
                <p className="text-xs text-[#8A8178] mt-0.5">
                  Customizable by your tailor to any size from XS to 5XL
                </p>
              </div>
              <span className="px-3 py-1.5 bg-[#9E6962] text-white text-xs font-bold rounded-xl shrink-0 shadow-2xs">
                Free Size
              </span>
            </div>
          )}

          {/* Primary Action Buttons - Add to Bag, Buy Now & WhatsApp */}
          <div className="space-y-3 pt-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Add to Bag */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 bg-white hover:bg-[#FAF6F1] text-[#7A1B38] border-2 border-[#7A1B38] rounded-2xl font-bold text-sm transition-all shadow-2xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 text-[#7A1B38] transition-transform group-hover:scale-110" />
                <span>Add to Bag</span>
              </button>

              {/* Option 2: Direct Buy Now */}
              <button
                type="button"
                onClick={handleDirectBuyNow}
                className="w-full py-3.5 px-4 bg-[#7A1B38] hover:bg-[#5C142A] text-white rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-[#B59757] transition-transform group-hover:scale-110" />
                <span>Buy Now (Checkout)</span>
              </button>
            </div>

            {/* Option 3: Quick Order on WhatsApp */}
            <a
              href={`https://wa.me/917023352132?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackContact('WhatsApp Quick Order Button', product.title);
                trackGAContact('WhatsApp Quick Order');
              }}
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20BE5C] text-white font-semibold rounded-2xl transition-all duration-300 text-xs sm:text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2.5 text-center cursor-pointer group"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current shrink-0 transition-transform group-hover:scale-110" size="18px" />
              <span>
                Quick Order on WhatsApp (+91 70233 52132)
              </span>
            </a>
          </div>

          {/* PIN Code Delivery Estimator (5-7 Days Realistic Guarantee) */}
          <DeliveryEstimator />

          {/* Sizing & Tailoring Guide: Only show Size Chart for Stitched products */}
          {isJewellery ? (
            <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#DCD3C7] shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-[#E4D9CC] pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B59757]/15 flex items-center justify-center text-[#B59757]">
                  <Sparkles className="w-5 h-5 text-[#B59757]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B59757] block">
                    Jewellery Care & Specifications
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#2B2723]">
                    Handcrafted Anti-Tarnish Jewellery Set
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC]">
                  <span className="text-[#8A8178] block font-medium">Necklace Type</span>
                  <span className="font-serif font-bold text-sm text-[#2B2723] block mt-0.5">Adjustable Choker</span>
                  <span className="text-[11px] text-[#5A534C] mt-1 block">Comfortable fit with adjustable dori</span>
                </div>
                <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC]">
                  <span className="text-[#8A8178] block font-medium">Earrings Included</span>
                  <span className="font-serif font-bold text-sm text-[#2B2723] block mt-0.5">Matching Pair</span>
                  <span className="text-[11px] text-[#5A534C] mt-1 block">Secure push-back closure</span>
                </div>
                <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC]">
                  <span className="text-[#8A8178] block font-medium">Plating & Stone</span>
                  <span className="font-serif font-bold text-sm text-[#2B2723] block mt-0.5">Premium Finish</span>
                  <span className="text-[11px] text-[#5A534C] mt-1 block">Anti-tarnish coating with crystals / pearls</span>
                </div>
              </div>

              <p className="text-xs text-[#5A534C] bg-[#FAF6F1] p-3.5 rounded-xl border border-[#E4D9CC] leading-relaxed flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B59757] shrink-0" />
                <span><strong>Care Advice:</strong> Keep away from water, perfumes, and harsh chemicals. Store in an airtight pouch or box after use for lasting shine.</span>
              </p>
            </div>
          ) : isStitched ? (
            <div id="size-chart-section">
              <ProductSizeChart
                selectedSize={selectedSize}
                availableSizes={product.sizes}
                onSelectSize={(sz) => {
                  if (!product.sizes || product.sizes.length === 0 || product.sizes.includes(sz)) {
                    setSelectedSize(sz);
                  }
                }}
              />
            </div>
          ) : (
            <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#DCD3C7] shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-[#E4D9CC] pb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7A1B38]/10 flex items-center justify-center text-[#7A1B38]">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A1B38] block">
                    Fabric Dimensions & Tailoring
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#2B2723]">
                    100% Unstitched Fabric Specifications
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC]">
                  <span className="text-[#8A8178] block font-medium">Top / Kurta Fabric</span>
                  <span className="font-serif font-bold text-sm text-[#2B2723] block mt-0.5">~ 2.50 Meters</span>
                  <span className="text-[11px] text-[#5A534C] mt-1 block">Pure Cotton with detailed embroidery</span>
                </div>
                <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC]">
                  <span className="text-[#8A8178] block font-medium">Bottom / Salwar Fabric</span>
                  <span className="font-serif font-bold text-sm text-[#2B2723] block mt-0.5">~ 2.50 Meters</span>
                  <span className="text-[11px] text-[#5A534C] mt-1 block">Comfortable pure cotton material</span>
                </div>
                <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC]">
                  <span className="text-[#8A8178] block font-medium">Dupatta Material</span>
                  <span className="font-serif font-bold text-sm text-[#2B2723] block mt-0.5">~ 2.25 Meters</span>
                  <span className="text-[11px] text-[#5A534C] mt-1 block">Lightweight breathable pure mulmul</span>
                </div>
              </div>

              <p className="text-xs text-[#5A534C] bg-[#FAF6F1] p-3.5 rounded-xl border border-[#E4D9CC] leading-relaxed flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B59757] shrink-0" />
                <span><strong>No Size Chart needed:</strong> Being an unstitched 3-piece fabric set, this can be customized by your boutique or tailor to your exact desired fit (XS to 5XL) and styling.</span>
              </p>
            </div>
          )}

          {/* Fabric & Craft Description */}
          <div className="p-5 bg-white rounded-3xl border border-[#DCD3C7] space-y-3 shadow-xs">
            <h3 className="font-serif font-bold text-sm text-[#2B2723] uppercase tracking-wider">
              {isJewellery ? 'Artisanal Jewellery Details' : 'Artisanal Fabric Details'}
            </h3>
            <p className="text-xs sm:text-sm text-[#8A8178] leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-[#FAF6F1] rounded-xl border border-[#E4D9CC]">
                <span className="text-[#8A8178] block font-medium">{isJewellery ? 'Material' : 'Fabric Type'}</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.fabric}</span>
              </div>
              <div className="p-3 bg-[#FAF6F1] rounded-xl border border-[#E4D9CC]">
                <span className="text-[#8A8178] block font-medium">Craft & Work</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.craft}</span>
              </div>
              <div className="p-3 bg-[#FAF6F1] rounded-xl border border-[#E4D9CC]">
                <span className="text-[#8A8178] block font-medium">{isJewellery ? 'Care Guide' : 'Wash Care'}</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.care}</span>
              </div>
              <div className="p-3 bg-[#FAF6F1] rounded-xl border border-[#E4D9CC]">
                <span className="text-[#8A8178] block font-medium">Color Palette</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.color}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Cross-sell: complete the look */}
      {pairProducts.length > 0 && (
        <section className="pt-10 border-t border-[#E4D9CC]">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#A08350]">Complete the look</p>
              <h3 className="mt-1 text-2xl sm:text-3xl font-serif text-[#2B2723]">
                {isJewellery ? 'Wear it with' : 'Pair it with'}
              </h3>
            </div>
            <Link
              href={isJewellery ? '/shop?category=sale' : '/shop?category=jewellery'}
              className="text-sm text-[#7A1B38] font-medium hover:underline underline-offset-4 shrink-0"
            >
              See all →
            </Link>
          </div>
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
            {pairProducts.map((p) => (
              <div key={p.id} className="snap-start shrink-0 w-[44%] sm:w-[30%] lg:w-[22%]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* You may also like */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-[#E4D9CC]">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#A08350]">More from Saga</p>
              <h3 className="mt-1 text-2xl sm:text-3xl font-serif text-[#2B2723]">You may also like</h3>
            </div>
            <Link href="/shop" className="text-sm text-[#7A1B38] font-medium hover:underline underline-offset-4 shrink-0">
              Shop all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      </main>

      {/* Footer with smooth Size Guide navigation */}
      <Footer
        onOpenSizeChart={
          isStitched
            ? () => {
                const el = document.getElementById('size-chart-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            : undefined
        }
      />

      <div className="h-16 sm:hidden" aria-hidden="true" />

      {/* Sticky Bottom Buy Bar on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DCD3C7] px-3 py-2.5 sm:hidden shadow-2xl flex items-center justify-between gap-2">
        <div className="min-w-0 pr-1">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-serif font-bold text-[#7A1B38]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#8A8178] line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-[#5C7056] font-semibold block truncate">
            {isStitched ? `Selected: ${selectedSize}` : isJewellery ? 'Free size' : 'Unstitched set'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick WhatsApp Order */}
          <a
            href={`https://wa.me/917023352132?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackContact('WhatsApp Mobile Sticky', product.title);
              trackGAContact('WhatsApp Mobile Sticky');
            }}
            aria-label="Order on WhatsApp"
            className="p-2.5 bg-[#25D366] hover:bg-[#20BE5C] text-white rounded-xl shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" size="18px" />
          </a>

          {/* Add to Bag */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="py-2.5 px-3 bg-white border border-[#7A1B38] text-[#7A1B38] font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#7A1B38]" />
            <span>Add</span>
          </button>

          {/* Buy Now (Checkout) */}
          <button
            type="button"
            onClick={handleDirectBuyNow}
            className="py-2.5 px-3.5 bg-[#7A1B38] hover:bg-[#5C142A] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1 cursor-pointer shrink-0 transition-all active:scale-95"
          >
            <span>{isStitched ? `Buy (${selectedSize})` : 'Buy Now'}</span>
          </button>
        </div>
      </div>

      {/* Floating Quick Order on WhatsApp Button on Product Page (Hidden on Mobile/Phone) */}
      <aside className="hidden sm:block fixed bottom-8 right-8 z-40 group animate-fadeIn">
        <a
          href={`https://wa.me/917023352132?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackContact('WhatsApp Floating Quick Order', product.title);
            trackGAContact('WhatsApp Floating Quick Order');
          }}
          className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BE5C] text-white pl-3.5 pr-4 py-2.5 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ring-4 ring-white/90 border border-[#20BE5C] cursor-pointer"
          title="Quick Order on WhatsApp"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" size="20px" />
          <span className="text-xs font-bold tracking-wide">
            Quick Order on WhatsApp
          </span>
        </a>
      </aside>
    </div>
  );
};
