'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Size, Order } from '@/types';
import { ProductSizeChart } from '@/components/ProductSizeChart';
import { CheckoutDrawer } from '@/components/CheckoutDrawer';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { ProductCard } from '@/components/ProductCard';
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
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const isStitched = product.tags.includes('Stitched Suit') || product.tags.includes('Short Kurti') || (product.sizes && product.sizes.includes('S'));
  const defaultSize: Size = isStitched ? 'M' : 'Unstitched';

  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Checkout Drawer state
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const currentImage = product.images[selectedImageIndex] || product.images[0];
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Meta Pixel ViewContent event
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: product.title,
        content_category: 'Suits & Kurtis Collection',
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'INR',
      });
    }
  }, [product]);

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
    `Hello Saga Fabrics! I am interested in purchasing "${product.title}" (${
      isStitched ? `Size: ${selectedSize}` : 'Unstitched Set'
    }) priced at ₹${product.price}. Please assist me!`
  );

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* Breadcrumb Bar */}
      <div className="flex items-center justify-between text-xs text-[#8A8178] border-b border-[#E4D9CC] pb-4">
        <nav className="flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#7A1B38] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/#collection" className="hover:text-[#7A1B38] transition-colors">
            Collection
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

            {/* Artisanal Badge */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="bg-[#7A1B38] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                Handcrafted Artisanal
              </span>
              {product.tags.includes('Bestseller') && (
                <span className="bg-[#B59757] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  Bestseller
                </span>
              )}
            </div>

            {/* Discount Badge */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#DCD3C7] text-xs font-bold text-[#7A1B38] shadow-xs">
              {discountPercent}% OFF
            </div>
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
              <span className="font-bold text-[#2B2723]">100% Cotton</span>
              <span className="text-[10px]">Breathable craft</span>
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
          <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#DCD3C7] shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#7A1B38]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-[#8A8178] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[11px] text-[#5C7056] font-semibold block mt-0.5">
                Inclusive of all taxes • Free express doorstep delivery
              </span>
            </div>

            <span className="bg-[#7A1B38]/10 text-[#7A1B38] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#7A1B38]/20">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Size Selection Section */}
          {isStitched && product.sizes && product.sizes.length > 1 ? (
            <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#DCD3C7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2B2723]">
                  Select Stitched Size: <strong className="text-[#7A1B38] font-bold text-base ml-1">{selectedSize}</strong>
                </span>
                <span className="text-xs text-[#5C7056] font-semibold bg-[#5C7056]/10 px-2.5 py-0.5 rounded-full">
                  Regular Fit
                </span>
              </div>

              {/* Size Buttons */}
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer border flex flex-col items-center justify-center ${
                      selectedSize === sz
                        ? 'bg-[#7A1B38] text-white border-[#7A1B38] shadow-md scale-102'
                        : 'bg-[#FAF6F1] text-[#2B2723] border-[#DCD3C7] hover:border-[#7A1B38]'
                    }`}
                  >
                    <span>{sz}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#8A8178]">
                Stitched and ready to wear. Check the detailed measurements chart below.
              </p>
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

          {/* Embedded Mobile-Responsive Size Chart */}
          <div id="size-chart-section">
            <ProductSizeChart
              selectedSize={selectedSize}
              onSelectSize={(sz) => setSelectedSize(sz)}
            />
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full py-4 bg-[#7A1B38] hover:bg-[#5C142A] text-white font-medium rounded-2xl transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 group tracking-wide"
            >
              <ShoppingBag className="w-5 h-5 text-[#B59757] transition-transform group-hover:scale-110" />
              <span>
                {isStitched
                  ? `Proceed to Buy (Size: ${selectedSize}) with Razorpay`
                  : 'Direct Buy (Unstitched) with Razorpay'}
              </span>
            </button>

            {/* WhatsApp Styling Assistant Button */}
            <a
              href={`https://wa.me/917023352132?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-white hover:bg-[#F3ECE2] text-[#25D366] font-semibold rounded-2xl transition-colors text-xs sm:text-sm border border-[#DCD3C7] flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Order or Inquire via WhatsApp (+91 70233 52132)</span>
            </a>
          </div>

          {/* Fabric & Craft Description */}
          <div className="p-5 bg-white rounded-3xl border border-[#DCD3C7] space-y-3 shadow-xs">
            <h3 className="font-serif font-bold text-sm text-[#2B2723] uppercase tracking-wider">
              Artisanal Fabric Details
            </h3>
            <p className="text-xs sm:text-sm text-[#8A8178] leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-[#FAF6F1] rounded-xl border border-[#E4D9CC]">
                <span className="text-[#8A8178] block font-medium">Fabric Type</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.fabric}</span>
              </div>
              <div className="p-3 bg-[#FAF6F1] rounded-xl border border-[#E4D9CC]">
                <span className="text-[#8A8178] block font-medium">Craft & Work</span>
                <span className="font-serif font-bold text-[#2B2723]">{product.craft}</span>
              </div>
              <div className="p-3 bg-[#FAF6F1] rounded-xl border border-[#E4D9CC]">
                <span className="text-[#8A8178] block font-medium">Wash Care</span>
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

      {/* Related Products from Curated Collection */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#E4D9CC] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#7A1B38] font-bold">
                More Handcrafted Designs
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#2B2723]">
                You May Also Love
              </h3>
            </div>
            <Link
              href="/#collection"
              className="text-xs font-bold text-[#7A1B38] hover:underline"
            >
              View Full Collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelectProduct={() => {}}
                onDirectBuy={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = `/products/${rel.id}`;
                  }
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Checkout Slide-over Drawer */}
      <CheckoutDrawer
        isOpen={checkoutOpen}
        product={product}
        size={isStitched ? selectedSize : 'Unstitched'}
        onClose={() => setCheckoutOpen(false)}
        onRemoveProduct={() => setCheckoutOpen(false)}
        onSuccess={(order) => {
          setCompletedOrder(order);
        }}
      />

      {/* Order Success Confetti Modal */}
      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}
    </div>
  );
};
