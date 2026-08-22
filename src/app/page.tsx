'use client';

import React, { useState } from 'react';
import { PRODUCTS } from '@/lib/products';
import { Product, Size, Order } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { BrandTrust } from '@/components/BrandTrust';
import { CraftCategories } from '@/components/CraftCategories';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CheckoutDrawer } from '@/components/CheckoutDrawer';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { CraftStory } from '@/components/CraftStory';
import { StyleGuide } from '@/components/StyleGuide';
import { CustomerReviews } from '@/components/CustomerReviews';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const [selectedProductModal, setSelectedProductModal] = useState<{
    product: Product;
    size: Size;
  } | null>(null);

  const [checkoutState, setCheckoutState] = useState<{
    isOpen: boolean;
    product: Product | null;
    size: Size;
  }>({
    isOpen: false,
    product: null,
    size: 'M',
  });

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Chikankari' | 'Handblock' | '3-Piece Set'>('All');

  // Handle Quick View modal trigger
  const handleOpenProductModal = (product: Product, initialSize: Size = 'M') => {
    setSelectedProductModal({ product, size: initialSize });
  };

  // Handle Direct Buy trigger
  const handleDirectBuy = (product: Product, size: Size = 'M') => {
    setSelectedProductModal(null);
    setCheckoutState({
      isOpen: true,
      product,
      size,
    });
  };

  // Filter products based on tab
  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Chikankari') return p.tags.includes('Chikankari');
    if (activeFilter === 'Handblock') return p.craft.toLowerCase().includes('handblock') || p.craft.toLowerCase().includes('hand block');
    if (activeFilter === '3-Piece Set') return p.tags.includes('3-Piece Set');
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723] selection:bg-[#7A1B38] selection:text-white">
      {/* Responsive Header Navbar */}
      <Navbar
        cartCount={checkoutState.isOpen ? 1 : 0}
        onOpenCart={() => {
          if (PRODUCTS.length > 0) {
            handleDirectBuy(PRODUCTS[0], 'M');
          }
        }}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Brand Guarantee Trust Bar */}
        <BrandTrust />

        {/* 3. Craft & Signature Collection Categories Grid */}
        <div id="categories">
          <CraftCategories onSelectCategory={(cat) => setActiveFilter(cat)} />
        </div>

        {/* 4. Curated Products Collection Section */}
        <section id="collection" className="py-16 md:py-24 px-6 lg:px-12 max-w-7xl mx-auto border-b border-[#E4D9CC]">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#7A1B38] bg-[#7A1B38]/10 px-4 py-1.5 rounded-full border border-[#7A1B38]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#B59757]" /> Signature Chikankari Edit
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2B2723] tracking-tight">
              Curated Chikankari Unstitched Suit Collection
            </h2>
            <p className="text-sm sm:text-base text-[#8A8178]">
              Handcrafted 100% Breathable Pure Cotton Unstitched Suit Sets • Order directly with instant Razorpay checkout.
            </p>

            {/* Interactive Filter Tabs */}
            <div className="flex items-center justify-center gap-2.5 pt-6 flex-wrap">
              {(['All', 'Chikankari', 'Handblock', '3-Piece Set'] as const).map((filter) => {
                const count = PRODUCTS.filter((p) => {
                  if (filter === 'All') return true;
                  if (filter === 'Chikankari') return p.tags.includes('Chikankari');
                  if (filter === 'Handblock') return p.craft.includes('Handblock');
                  if (filter === '3-Piece Set') return p.tags.includes('3-Piece Set');
                  return true;
                }).length;

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
                      activeFilter === filter
                        ? 'bg-[#7A1B38] text-white shadow-md border-[#7A1B38]'
                        : 'bg-white text-[#2B2723] border-[#E4D9CC] hover:border-[#7A1B38] shadow-2xs'
                    }`}
                  >
                    <span>{filter} Collection</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      activeFilter === filter ? 'bg-white/20 text-white' : 'bg-[#F3ECE2] text-[#7A1B38]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={handleOpenProductModal}
                onDirectBuy={handleDirectBuy}
              />
            ))}
          </div>

        </section>

        {/* 5. Artisanal Heritage Craft Storytelling */}
        <CraftStory />

        {/* 6. Interactive Style & Occasion Guide */}
        <StyleGuide onSelectProduct={(prod, size) => handleDirectBuy(prod, size || 'M')} />

        {/* 7. Verified Customer Reviews */}
        <CustomerReviews />

        {/* 8. Frequently Asked Questions */}
        <FaqSection />

        {/* Brand Banner Quote in Royal Burgundy */}
        <section className="bg-[#7A1B38] text-[#FAF6F1] py-16 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-2xl sm:text-4xl font-serif italic leading-relaxed">
              "Every thread tells a story of rich artisanal heritage and timeless Chikankari craftsmanship."
            </h3>
            <p className="text-xs uppercase tracking-widest text-[#B59757] font-bold">
              Saga Fabrics • Handcrafted Chikankari
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <ProductModal
          product={selectedProductModal.product}
          initialSize={selectedProductModal.size}
          onClose={() => setSelectedProductModal(null)}
          onProceedToBuy={handleDirectBuy}
        />
      )}

      {/* Checkout Slide-over Drawer */}
      <CheckoutDrawer
        isOpen={checkoutState.isOpen}
        product={checkoutState.product}
        size={checkoutState.size}
        onClose={() => setCheckoutState({ isOpen: false, product: null, size: 'M' })}
        onRemoveProduct={() => setCheckoutState((prev) => ({ ...prev, product: null }))}
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
}
