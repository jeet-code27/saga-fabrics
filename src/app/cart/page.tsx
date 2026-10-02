'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { trackInitiateCheckout, trackContact } from '@/lib/metaPixel';
import { trackGABeginCheckout, trackGAContact } from '@/lib/gtag';

export default function CartPage() {
  const router = useRouter();
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      trackInitiateCheckout(
        {
          id: cart[0].productId,
          title: cart.map((i) => i.productTitle).join(', '),
          price: cartTotal,
          subtitle: '',
          description: '',
          fabric: '',
          craft: '',
          care: '',
          color: '',
          colorHex: '',
          images: [cart[0].image],
          tags: [],
          inStock: true,
          rating: 5,
          reviewsCount: 1,
        },
        cartCount,
        cartTotal
      );
      trackGABeginCheckout(
        {
          id: cart[0].productId,
          title: cart.map((i) => i.productTitle).join(', '),
          price: cartTotal,
          subtitle: '',
          description: '',
          fabric: '',
          craft: '',
          care: '',
          color: '',
          colorHex: '',
          images: [cart[0].image],
          tags: [],
          inStock: true,
          rating: 5,
          reviewsCount: 1,
        },
        cartCount,
        cart[0].size,
        cartTotal
      );
    }
    router.push('/checkout');
  };

  const whatsappCartMessage = encodeURIComponent(
    `Hello Saga Fabrics! I want to order the items in my cart:\n\n` +
      cart
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.productTitle} (${item.size}) x ${item.quantity} = ₹${(
              item.price * item.quantity
            ).toLocaleString('en-IN')}`
        )
        .join('\n') +
      `\n\n• Total Items: ${cartCount}\n• Total Amount: ₹${cartTotal.toLocaleString(
        'en-IN'
      )}\n\nPlease assist with confirming my order and delivery details!`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723] selection:bg-[#7A1B38] selection:text-white">
      <Navbar hideSizeGuide={true} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 w-full">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A8178] hover:text-[#7A1B38] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <span className="text-xs uppercase tracking-widest text-[#7A1B38] font-bold">
            Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </span>
        </div>

        {cart.length === 0 ? (
          /* Empty Bag State */
          <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl p-8 border border-[#E4D9CC] shadow-sm space-y-5">
            <div className="w-20 h-20 rounded-full bg-[#FAF6F1] mx-auto flex items-center justify-center text-[#7A1B38] border border-[#DCD3C7]">
              <ShoppingBag className="w-10 h-10 opacity-60" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#2B2723]">
              Your Bag is Empty
            </h2>
            <p className="text-xs text-[#8A8178] leading-relaxed max-w-xs mx-auto">
              Explore our handcrafted pure cotton suits, kurtis, and unstitched fabric sets directly from Jaipur.
            </p>
            <Link
              href="/#collection"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#7A1B38] hover:bg-[#5C142A] text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          /* Two Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Cart Items (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Header Box */}
              <div className="bg-white rounded-3xl p-6 border border-[#E4D9CC] shadow-2xs flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2B2723]">
                    Your Shopping Bag
                  </h1>
                  <p className="text-xs text-[#8A8178] mt-0.5">
                    Review your items before proceeding to secure checkout.
                  </p>
                </div>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-[#8A8178] hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Free Shipping Banner */}
              <div className="bg-[#1B4D3E]/10 border border-[#1B4D3E]/20 text-[#1B4D3E] px-5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Complimentary Express Shipping Included on this Order across India</span>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-3xl p-6 border border-[#E4D9CC] shadow-2xs divide-y divide-[#F3ECE2]">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex gap-4 items-center">
                      <div className="relative w-20 h-26 rounded-2xl overflow-hidden bg-[#FAF6F1] border border-[#E4D9CC] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.productTitle}
                          fill
                          sizes="80px"
                          className="object-cover object-top"
                        />
                      </div>

                      <div className="space-y-1">
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-sm sm:text-base font-serif font-bold text-[#2B2723] hover:text-[#7A1B38] transition-colors line-clamp-1"
                        >
                          {item.productTitle}
                        </Link>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FAF6F1] border border-[#E4D9CC] text-[#7A1B38]">
                            {item.size === 'Unstitched' ? 'Unstitched Fabric' : `Size: ${item.size}`}
                          </span>
                          <span className="text-xs text-[#8A8178]">
                            ₹{item.price.toLocaleString('en-IN')} each
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quantity Controls & Subtotal */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3ECE2]">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#DCD3C7] rounded-xl bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="px-2.5 py-1.5 text-[#8A8178] hover:bg-[#FAF6F1] hover:text-[#2B2723] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-[#2B2723]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="px-2.5 py-1.5 text-[#8A8178] hover:bg-[#FAF6F1] hover:text-[#2B2723] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <div className="text-right min-w-[80px]">
                        <span className="font-serif font-bold text-base text-[#2B2723]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-[#8A8178] hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Features Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#E4D9CC] flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FAF6F1] text-[#7A1B38]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2723]">Pure Breathable Cotton</h4>
                    <p className="text-[10px] text-[#8A8178]">Hand-picked artisanal weave</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E4D9CC] flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FAF6F1] text-[#1B4D3E]">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2723]">7-Day Size Exchange</h4>
                    <p className="text-[10px] text-[#8A8178]">Doorstep pickup support</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E4D9CC] flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FAF6F1] text-[#B59757]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2723]">Jaipur Atelier Direct</h4>
                    <p className="text-[10px] text-[#8A8178]">Zero middlemen markup</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Checkout Trigger (4 cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D9CC] shadow-sm space-y-6">
                
                <h3 className="font-serif font-bold text-lg text-[#2B2723] border-b border-[#F3ECE2] pb-3">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs text-[#8A8178]">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):</span>
                    <span className="font-medium text-[#2B2723]">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#1B4D3E] font-medium">
                    <span>Shipping Charges:</span>
                    <span>FREE (Jaipur Express)</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated GST / Taxes:</span>
                    <span className="text-[#1B4D3E] font-medium">Included</span>
                  </div>

                  <div className="pt-3 border-t border-[#E4D9CC] flex justify-between items-baseline">
                    <span className="font-serif font-bold text-base text-[#2B2723]">Total:</span>
                    <span className="font-serif text-2xl font-bold text-[#7A1B38]">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Primary Proceed Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 px-6 bg-[#7A1B38] hover:bg-[#5C142A] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {/* WhatsApp Alternative */}
                <div>
                  <a
                    href={`https://wa.me/917023352132?text=${whatsappCartMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackContact('WhatsApp Cart Page Order', `${cartCount} items`);
                      trackGAContact('WhatsApp Cart Page Order');
                    }}
                    className="w-full py-3 px-4 bg-white hover:bg-emerald-50 text-[#25D366] border border-[#25D366]/40 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" size="18px" />
                    <span>Order Bag via WhatsApp</span>
                  </a>
                </div>

                {/* Trust Seals */}
                <div className="pt-2 border-t border-[#F3ECE2] space-y-2 text-[11px] text-[#8A8178]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#1B4D3E]" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />
                    <span>Razorpay Verified Payment Gateway</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
