'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Order, CustomerInfo } from '@/types';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Truck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  HelpCircle,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase, setUserData, trackContact } from '@/lib/metaPixel';
import { trackGABeginCheckout, trackGAAddPaymentInfo, trackGAPurchase, trackGAContact } from '@/lib/gtag';
import { getDeliveryEstimate } from '@/lib/deliveryEstimator';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
  'Chandigarh',
  'Jammu & Kashmir',
  'Ladakh',
  'Puducherry',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, directBuyItem, clearCart, clearDirectBuy, cartTotal, cartCount } = useCart();

  // Determine effective checkout items: directBuyItem takes precedence if present, otherwise whole cart
  const checkoutItems = directBuyItem ? [directBuyItem] : cart;
  const effectiveTotal = directBuyItem
    ? directBuyItem.price * directBuyItem.quantity
    : cartTotal;
  const effectiveCount = directBuyItem ? directBuyItem.quantity : cartCount;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [form, setForm] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Rajasthan',
    pincode: '',
    notes: '',
  });

  // Track begin_checkout on page load if items exist
  useEffect(() => {
    if (checkoutItems.length > 0) {
      const firstItem = checkoutItems[0];
      const dummyProd = {
        id: firstItem.productId,
        title: checkoutItems.map((i) => i.productTitle).join(', '),
        price: effectiveTotal,
        originalPrice: effectiveTotal,
        subtitle: '',
        description: '',
        fabric: '',
        craft: '',
        care: '',
        color: '',
        colorHex: '',
        images: [firstItem.image],
        tags: [],
        inStock: true,
        rating: 5,
        reviewsCount: 1,
      };
      trackInitiateCheckout(dummyProd, effectiveCount, effectiveTotal);
      trackGABeginCheckout(dummyProd, effectiveCount, firstItem.size, effectiveTotal);
    }
  }, []);

  // Pre-fill remembered pincode from product page if available
  useEffect(() => {
    try {
      const savedPin = localStorage.getItem('saga_fabrics_pincode');
      if (savedPin && /^\d{6}$/.test(savedPin)) {
        setForm((prev) => ({ ...prev, pincode: savedPin }));
      }
    } catch (e) {}
  }, []);

  const deliveryEstimate = getDeliveryEstimate(form.pincode);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'pincode') {
      const clean = value.replace(/\D/g, '').slice(0, 6);
      setForm({ ...form, pincode: clean });
      if (clean.length === 6) {
        try {
          localStorage.setItem('saga_fabrics_pincode', clean);
        } catch (err) {}
      }
    } else {
      setForm({ ...form, [name]: value });
    }
    if (error) setError(null);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.address.trim() || !form.pincode.trim()) {
      setError('Please fill in your Name, WhatsApp Mobile Number, Email, Address, and 6-digit Pincode.');
      return;
    }

    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10 || !/^[6-9]\d{9}$/.test(digits.slice(-10))) {
      setError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (checkoutItems.length === 0) {
      setError('Your shopping bag is empty. Please add items to checkout.');
      return;
    }

    setLoading(true);

    // Advanced Meta Pixel matching
    setUserData(form);
    const firstItem = checkoutItems[0];
    const dummyProd = {
      id: firstItem.productId,
      title: checkoutItems.map((i) => i.productTitle).join(', '),
      price: effectiveTotal,
      originalPrice: effectiveTotal,
      subtitle: '',
      description: '',
      fabric: '',
      craft: '',
      care: '',
      color: '',
      colorHex: '',
      images: [firstItem.image],
      tags: [],
      inStock: true,
      rating: 5,
      reviewsCount: 1,
    };
    trackAddPaymentInfo(dummyProd, effectiveTotal, effectiveCount);
    trackGAAddPaymentInfo(dummyProd, effectiveTotal, effectiveCount, firstItem.size);

    try {
      // 1. Create Razorpay order on server
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: effectiveTotal,
          receipt: `saga_${Date.now()}`,
        }),
      });

      const orderData = await res.json();

      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || 'Could not initiate Razorpay checkout');
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'SAGA FABRICS',
        description: `Handcrafted Ethnic Order (${effectiveCount} Items)`,
        image: 'https://res.cloudinary.com/dnd8u5sll/image/upload/v1787209605/saga-fabrics-logo-new_skmnli.png',
        order_id: orderData.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#7A1B38',
        },
        retry: {
          enabled: true,
        },
        modal: {
          confirm_close: false,
          ondismiss: function () {
            setLoading(false);
          },
        },
        handler: async function (response: any) {
          try {
            // 3. Verify Razorpay payment signature on backend
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: form,
                items: checkoutItems,
                totalAmount: effectiveTotal,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Track successful purchase
              trackPurchase({
                orderId: response.razorpay_payment_id || verifyData.order?.orderId || `order_${Date.now()}`,
                product: dummyProd,
                totalAmount: effectiveTotal,
                quantity: effectiveCount,
              });
              trackGAPurchase({
                orderId: response.razorpay_payment_id || verifyData.order?.orderId || `order_${Date.now()}`,
                product: dummyProd,
                totalAmount: effectiveTotal,
                quantity: effectiveCount,
                size: firstItem.size,
              });

              // Clear cart and direct buy state
              clearCart();
              clearDirectBuy();

              setCompletedOrder(verifyData.order);
            } else {
              setError(verifyData.error || 'Payment verification failed. Please contact support.');
            }
          } catch (err: any) {
            console.error('Payment verification error:', err);
            setError('Payment verification failed. If your money was deducted, it will be refunded or your order confirmed shortly.');
          } finally {
            setLoading(false);
          }
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please refresh and check your internet connection.');
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        console.error('Payment failed:', resp.error);
        setError(`Payment failed: ${resp.error.description || 'Transaction cancelled'}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment processing error. Please try again.');
      setLoading(false);
    }
  };

  // WhatsApp manual order fallback
  const whatsappCheckoutMessage = encodeURIComponent(
    `Hello Saga Fabrics! I want to complete my order via WhatsApp:\n\n` +
      checkoutItems
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.productTitle} (${item.size}) x ${item.quantity} = ₹${(
              item.price * item.quantity
            ).toLocaleString('en-IN')}`
        )
        .join('\n') +
      `\n\n• Total Amount: ₹${effectiveTotal.toLocaleString('en-IN')}\n` +
      `• Name: ${form.name || '[My Name]'}\n` +
      `• Mobile: ${form.phone || '[My Phone]'}\n` +
      `• City: ${form.city || '[City]'}\n` +
      `• PIN: ${form.pincode || '[PIN]'}\n\nPlease share payment/dispatch instructions!`
  );

  return (
    <div className="min-h-screen bg-[#FAF6F1] text-[#2B2723] flex flex-col selection:bg-[#7A1B38] selection:text-white">
      
      {/* Checkout Minimalist Header */}
      <header className="bg-white border-b border-[#E4D9CC] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A8178] hover:text-[#7A1B38] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/images/saga-fabrics-new.png"
              alt="Saga Fabrics"
              width={160}
              height={50}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1B4D3E] bg-[#1B4D3E]/10 px-3 py-1 rounded-full border border-[#1B4D3E]/20">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">256-Bit SSL Secure</span>
            <span className="sm:hidden">Secure</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 w-full">
        {checkoutItems.length === 0 && !completedOrder ? (
          <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl p-8 border border-[#E4D9CC] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF6F1] mx-auto flex items-center justify-center text-[#7A1B38]">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#2B2723]">
              Your Bag is Empty
            </h2>
            <p className="text-xs text-[#8A8178]">
              You don't have any items in your checkout session. Browse our collection to add handcrafted suits & kurtis.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#7A1B38] hover:bg-[#5C142A] text-white text-xs font-bold rounded-full shadow-md transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ================================================================= */}
            {/* LEFT COLUMN (7 Cols): SHIPPING DETAILS FORM & TRUST POLICIES     */}
            {/* ================================================================= */}
            <div className="lg:col-span-7 space-y-8">
              
              <form onSubmit={handlePay} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D9CC] shadow-sm space-y-6">
                
                {/* Form Heading */}
                <div className="border-b border-[#F3ECE2] pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A1B38]">
                    Step 1 of 2
                  </span>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2B2723] mt-0.5">
                    Shipping & Delivery Details
                  </h1>
                  <p className="text-xs text-[#8A8178] mt-1">
                    Free express doorstep delivery across all PIN codes in India directly from Jaipur.
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                    <div>
                      <p className="font-bold">Checkout Notice</p>
                      <p className="mt-0.5 leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B2723]">
                    1. Contact Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2B2723] mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Ananya Sharma"
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-[#DCD3C7] focus:border-[#7A1B38] focus:ring-2 focus:ring-[#7A1B38]/10 text-xs outline-none bg-[#FAF6F1]/50 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2B2723] mb-1.5 flex items-center justify-between">
                        <span>WhatsApp Number <span className="text-rose-500">*</span></span>
                        <span className="text-[10px] text-[#1B4D3E] font-bold">For Live Tracking</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile (e.g. 9876543210)"
                        maxLength={10}
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-[#DCD3C7] focus:border-[#7A1B38] focus:ring-2 focus:ring-[#7A1B38]/10 text-xs outline-none bg-[#FAF6F1]/50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B2723] mb-1.5 flex items-center justify-between">
                      <span>Email Address <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-[#8A8178]">Order receipt will be sent here</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-[#DCD3C7] focus:border-[#7A1B38] focus:ring-2 focus:ring-[#7A1B38]/10 text-xs outline-none bg-[#FAF6F1]/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4 pt-4 border-t border-[#F3ECE2]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B2723]">
                    2. Doorstep Delivery Address
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B2723] mb-1.5">
                      House / Flat No., Building & Street Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="e.g. Flat 304, Green Heights, MG Road, near City Center"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-[#DCD3C7] focus:border-[#7A1B38] focus:ring-2 focus:ring-[#7A1B38]/10 text-xs outline-none bg-[#FAF6F1]/50 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2B2723] mb-1.5">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Jaipur"
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-[#DCD3C7] focus:border-[#7A1B38] focus:ring-2 focus:ring-[#7A1B38]/10 text-xs outline-none bg-[#FAF6F1]/50 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2B2723] mb-1.5">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-3 rounded-2xl border border-[#DCD3C7] focus:border-[#7A1B38] focus:ring-2 focus:ring-[#7A1B38]/10 text-xs outline-none bg-[#FAF6F1]/50 focus:bg-white transition-all cursor-pointer"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2B2723] mb-1.5">
                        PIN Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="6-digit PIN"
                        maxLength={6}
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-[#DCD3C7] focus:border-[#7A1B38] focus:ring-2 focus:ring-[#7A1B38]/10 text-xs outline-none bg-[#FAF6F1]/50 focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Dynamic Realistic Delivery Window (5-7 Days Trust Factor) */}
                  {deliveryEstimate.isValid && (
                    <div className="p-3.5 bg-[#FAF6F1] border border-[#E4D9CC] rounded-2xl flex items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn">
                      <div className="flex items-start sm:items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#1B4D3E]/10 text-[#1B4D3E] shrink-0 mt-0.5 sm:mt-0">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#1B4D3E]">
                              Estimated Delivery: {deliveryEstimate.dateRangeText}
                            </span>
                            <span className="text-[10px] font-semibold text-[#8A8178]">
                              ({deliveryEstimate.minDays}–{deliveryEstimate.maxDays} Business Days)
                            </span>
                          </div>
                          <span className="text-[11px] text-[#63584F] block mt-0.5">
                            Dispatched within 24–48h directly from Jaipur Atelier via Delhivery / Bluedart
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#1B4D3E] bg-[#1B4D3E]/15 px-2.5 py-1 rounded-md shrink-0">
                        FREE SHIPPING
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#2B2723] mb-1.5">
                      Landmark / Special Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="e.g. Near Metro Pillar 12, Deliver after 2 PM"
                      className="w-full px-4 py-3 rounded-2xl border border-[#DCD3C7] focus:border-[#7A1B38] focus:ring-2 focus:ring-[#7A1B38]/10 text-xs outline-none bg-[#FAF6F1]/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Primary Payment Trigger Button */}
                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-[#7A1B38] hover:bg-[#5C142A] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    <Lock className="w-5 h-5 text-[#B59757]" />
                    <span>
                      {loading
                        ? 'Connecting to Secure Gateway...'
                        : `Pay ₹${effectiveTotal.toLocaleString('en-IN')} with Razorpay`}
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A8178]">
                    <ShieldCheck className="w-4 h-4 text-[#1B4D3E]" />
                    <span>Instant UPI (GPay/PhonePe/Paytm), Cards & NetBanking</span>
                  </div>

                  {/* WhatsApp Quick Order Option */}
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/917023352132?text=${whatsappCheckoutMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackContact('Checkout WhatsApp Option', `${effectiveCount} items`);
                        trackGAContact('Checkout WhatsApp Option');
                      }}
                      className="w-full py-3 px-4 bg-white hover:bg-emerald-50 text-[#25D366] border border-[#25D366]/40 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" size="18px" />
                      <span>Prefer to Order via WhatsApp? Click Here</span>
                    </a>
                  </div>
                </div>

              </form>

              {/* ================================================================= */}
              {/* DEDICATED POLICY & TRUST SECTION (CRITICAL REQUIREMENT)            */}
              {/* ================================================================= */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D9CC] shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-[#7A1B38]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-serif font-bold text-base text-[#2B2723]">
                    Customer Trust & Store Policies
                  </h3>
                </div>

                <p className="text-xs text-[#8A8178] leading-relaxed">
                  We believe in 100% transparency. Please review our official merchant policies before completing your order:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  
                  {/* Cancellation & Refund Policy Link Card */}
                  <Link
                    href="/refund-policy"
                    target="_blank"
                    className="p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D9CC] hover:border-[#7A1B38] transition-all group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-white text-[#7A1B38] shrink-0 group-hover:scale-105 transition-transform">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2B2723] group-hover:text-[#7A1B38]">
                        Cancellation & Refund
                      </h4>
                      <p className="text-[11px] text-[#8A8178] mt-0.5 leading-relaxed">
                        12-hour cancellation window • 7-day free replacement for defects or size exchange.
                      </p>
                    </div>
                  </Link>

                  {/* Shipping & Delivery Policy Link Card */}
                  <Link
                    href="/shipping-policy"
                    target="_blank"
                    className="p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D9CC] hover:border-[#7A1B38] transition-all group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-white text-[#1B4D3E] shrink-0 group-hover:scale-105 transition-transform">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2B2723] group-hover:text-[#7A1B38]">
                        Shipping & Delivery
                      </h4>
                      <p className="text-[11px] text-[#8A8178] mt-0.5 leading-relaxed">
                        Free express delivery pan-India • Dispatched within 24h from Jaipur with live AWB tracking.
                      </p>
                    </div>
                  </Link>

                  {/* Privacy Policy Link Card */}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D9CC] hover:border-[#7A1B38] transition-all group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-white text-[#4285F4] shrink-0 group-hover:scale-105 transition-transform">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2B2723] group-hover:text-[#7A1B38]">
                        Privacy Policy
                      </h4>
                      <p className="text-[11px] text-[#8A8178] mt-0.5 leading-relaxed">
                        100% confidential • Encrypted transaction data • No spam guarantee.
                      </p>
                    </div>
                  </Link>

                  {/* Terms & Conditions Link Card */}
                  <Link
                    href="/terms-and-conditions"
                    target="_blank"
                    className="p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D9CC] hover:border-[#7A1B38] transition-all group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-white text-[#B59757] shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2B2723] group-hover:text-[#7A1B38]">
                        Terms & Conditions
                      </h4>
                      <p className="text-[11px] text-[#8A8178] mt-0.5 leading-relaxed">
                        Official terms governing purchases, warranties, and verified artisan craftsmanship.
                      </p>
                    </div>
                  </Link>

                </div>

                {/* Direct Founder Helpline Note */}
                <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" size="18px" />
                    <span className="text-[#2B2723] font-medium">
                      Questions regarding sizing or dispatch? WhatsApp founders:
                    </span>
                  </div>
                  <a
                    href="https://wa.me/917023352132"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7A1B38] font-bold underline hover:text-[#5C142A]"
                  >
                    +91 70233 52132
                  </a>
                </div>

              </div>

            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN (5 Cols): STICKY ORDER SUMMARY & TRUST GUARANTEES   */}
            {/* ================================================================= */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D9CC] shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F3ECE2] pb-4">
                  <h2 className="font-serif font-bold text-lg text-[#2B2723]">
                    Order Summary
                  </h2>
                  <span className="text-xs font-mono font-bold text-[#7A1B38] bg-[#7A1B38]/10 px-2.5 py-1 rounded-full">
                    {effectiveCount} {effectiveCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-[#F3ECE2]">
                  {checkoutItems.map((item, idx) => (
                    <div key={`${item.productId}-${item.size}-${idx}`} className="pt-3.5 first:pt-0 flex gap-3.5 items-center">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#FAF6F1] border border-[#E4D9CC] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.productTitle}
                          fill
                          sizes="64px"
                          className="object-cover object-top"
                        />
                        <span className="absolute top-1 right-1 w-4 h-4 bg-[#7A1B38] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-serif font-bold text-[#2B2723] line-clamp-1">
                          {item.productTitle}
                        </h4>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-[#8A8178]">
                            {item.size === 'Unstitched' ? 'Unstitched Fabric' : `Size: ${item.size}`}
                          </span>
                          <span className="text-[10px] text-[#8A8178]">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <p className="font-serif font-bold text-xs text-[#2B2723] mt-1">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-[#F3ECE2] space-y-2 text-xs">
                  <div className="flex justify-between text-[#8A8178]">
                    <span>Items Subtotal:</span>
                    <span className="font-medium text-[#2B2723]">
                      ₹{effectiveTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between items-start text-[#1B4D3E] font-medium">
                    <div>
                      <span>Express Doorstep Delivery:</span>
                      <span className="text-[10px] text-[#8A8178] block">
                        {deliveryEstimate.isValid
                          ? `Expected: ${deliveryEstimate.dateRangeText} (${deliveryEstimate.minDays}–${deliveryEstimate.maxDays} days)`
                          : 'Expected in 5–7 business days'}
                      </span>
                    </div>
                    <span className="font-bold uppercase tracking-wider text-[11px] bg-[#1B4D3E]/10 px-2 py-0.5 rounded text-[#1B4D3E]">
                      FREE
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#E4D9CC] flex justify-between items-baseline">
                    <div>
                      <span className="font-serif font-bold text-base text-[#2B2723] block">
                        Total Amount Payable
                      </span>
                      <span className="text-[10px] text-[#8A8178]">
                        Inclusive of all taxes & insurance
                      </span>
                    </div>
                    <span className="font-serif text-2xl font-bold text-[#7A1B38]">
                      ₹{effectiveTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="p-4 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC] space-y-2 text-[11px] text-[#615850]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                    <span>100% Breathable Pure Cotton Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                    <span>Personally inspected by founders Gaurav & Sonica</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                    <span>Dispatched in 24 hours from Jaipur Atelier</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </main>

      {/* Order Success Confetti Modal */}
      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => {
            setCompletedOrder(null);
            router.push('/');
          }}
        />
      )}

    </div>
  );
}
