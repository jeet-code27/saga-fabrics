'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Lock,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { trackInitiateCheckout, trackContact } from '@/lib/metaPixel';
import { trackGABeginCheckout, trackGAContact } from '@/lib/gtag';

export const CartDrawer: React.FC = () => {
  const { cart, cartCount, cartTotal, isCartOpen, closeCart, updateQuantity, removeFromCart } =
    useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    closeCart();
    if (cart.length > 0) {
      // Track InitiateCheckout on the first item or cart total
      trackInitiateCheckout(
        {
          id: cart[0].productId,
          title: cart.map((i) => i.productTitle).join(', '),
          price: cartTotal,
          originalPrice: cartTotal,
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
          originalPrice: cartTotal,
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
    `Hello Saga Fabrics! I want to order the items currently in my shopping cart:\n\n` +
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#EDE7E1] z-10 animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 bg-[#FAF6F1] border-b border-[#DCD3C7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#7A1B38]/10 text-[#7A1B38]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#2B2723]">
                Your Shopping Bag
              </h3>
              <p className="text-xs text-[#8A8178]">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 rounded-full hover:bg-[#EDE6DC] text-[#2B2723] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Highlight Banner */}
        <div className="bg-[#FAF6F1] px-5 py-2.5 border-b border-[#E4D9CC] flex items-center gap-2 text-xs font-semibold text-[#1B4D3E]">
          <Truck className="w-4 h-4 shrink-0 text-[#1B4D3E]" />
          <span>Complimentary Express Doorstep Shipping Across India</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#FAF6F1] border border-[#DCD3C7] flex items-center justify-center text-[#7A1B38] shadow-inner">
                <ShoppingBag className="w-10 h-10 opacity-60" />
              </div>
              <h4 className="text-xl font-serif font-bold text-[#2B2723]">
                Your Bag is Empty
              </h4>
              <p className="text-xs text-[#8A8178] max-w-xs leading-relaxed">
                Add 2 or more handcrafted suits & kurtis to your bag to enjoy timeless Indian craftsmanship.
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-3 bg-[#7A1B38] hover:bg-[#5C142A] text-white text-xs font-bold rounded-full shadow-md transition-colors cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 divide-y divide-[#F3ECE2]">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="pt-3.5 first:pt-0 flex gap-3.5 items-start"
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-[#FAF6F1] border border-[#E4D9CC] shrink-0">
                    <Image
                      src={item.image}
                      alt={item.productTitle}
                      fill
                      sizes="80px"
                      className="object-cover object-top"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.productId}`}
                          onClick={closeCart}
                          className="text-xs font-serif font-bold text-[#2B2723] hover:text-[#7A1B38] transition-colors line-clamp-1"
                        >
                          {item.productTitle}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-[#8A8178] hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF6F1] border border-[#E4D9CC] text-[#7A1B38]">
                          {item.size === 'Unstitched' ? 'Unstitched Set' : `Size: ${item.size}`}
                        </span>
                      </div>
                    </div>

                    {/* Price and Quantity Adjuster */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-serif font-bold text-sm text-[#2B2723]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#DCD3C7] rounded-xl bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="px-2 py-1 text-[#8A8178] hover:bg-[#FAF6F1] hover:text-[#2B2723] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#2B2723]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="px-2 py-1 text-[#8A8178] hover:bg-[#FAF6F1] hover:text-[#2B2723] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions (When cart has items) */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#FAF6F1] border-t border-[#DCD3C7] space-y-3.5">
            {/* Subtotal & Free Shipping Breakdown */}
            <div className="space-y-1.5 text-xs text-[#8A8178]">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):</span>
                <span className="font-medium text-[#2B2723]">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#1B4D3E] font-medium">
                <span>Shipping:</span>
                <span>FREE (Jaipur Express)</span>
              </div>
              <div className="pt-2 border-t border-[#E4D9CC] flex justify-between items-baseline text-sm font-bold text-[#2B2723]">
                <span className="font-serif">Total Amount:</span>
                <span className="font-serif text-lg text-[#7A1B38]">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Primary Action: Proceed to Checkout */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-[#7A1B38] hover:bg-[#5C142A] text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary Action: Order Entire Cart on WhatsApp */}
            <a
              href={`https://wa.me/917023352132?text=${whatsappCartMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackContact('WhatsApp Cart Order', `${cartCount} items`);
                trackGAContact('WhatsApp Cart Order');
              }}
              className="w-full py-2.5 px-4 bg-white hover:bg-emerald-50 text-[#25D366] border border-[#25D366]/40 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" size="16px" />
              <span>Or Order Entire Bag on WhatsApp</span>
            </a>

            {/* Micro Trust Seals */}
            <div className="pt-1 flex items-center justify-center gap-4 text-[10px] text-[#8A8178]">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#1B4D3E]" /> 256-Bit SSL
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#1B4D3E]" /> Razorpay Safe
              </span>
              <span>•</span>
              <span>7-Day Exchange</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
