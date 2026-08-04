'use client';

import React, { useState } from 'react';
import { Product, Size, CustomerInfo, Order } from '@/types';
import { X, Lock, ShieldCheck, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutDrawerProps {
  isOpen: boolean;
  product: Product | null;
  size: Size;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  product,
  size,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !product) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      setError('Please fill in your Name, Phone Number, Shipping Address, and Pincode.');
      return;
    }

    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay order on backend
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price,
          receipt: `saga_${Date.now()}`,
        }),
      });

      const orderData = await res.json();

      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || 'Could not initiate Razorpay checkout');
      }

      const orderItem = {
        productId: product.id,
        productTitle: product.title,
        image: product.images[0],
        size: size,
        price: product.price,
        quantity: 1,
      };

      // 2. Setup Razorpay Modal options
      const options = {
        key: orderData.key || 'rzp_test_SagaFabricsDemoKey',
        amount: orderData.amount,
        currency: 'INR',
        name: 'SAGA FABRICS',
        description: `${product.title} (Size: ${size})`,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=120&auto=format&fit=crop&q=80',
        order_id: orderData.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#9E6962',
        },
        handler: async function (response: any) {
          try {
            setLoading(true);
            // 3. Verify Payment & Create Order record in DB
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_sim_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'mock_signature',
                customer: form,
                items: [orderItem],
                totalAmount: product.price,
                isMock: orderData.isMock,
              }),
            });

            const verifyData = await verifyRes.json();
            setLoading(false);

            if (verifyRes.ok && verifyData.success) {
              onClose();
              onSuccess(verifyData.order);
            } else {
              setError(verifyData.error || 'Payment verification failed');
            }
          } catch (err: any) {
            setLoading(false);
            setError(err.message || 'Payment verification error');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // 3. Check if Razorpay script is present
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.warn('Razorpay SDK not loaded, using sandbox simulation handler.');
        setTimeout(async () => {
          options.handler({
            razorpay_order_id: orderData.id,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: 'demo_sig',
          });
        }, 1000);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Error processing checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div
        className="relative bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between border-l border-[#EDE7E1] animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-[#FAF6F1] border-b border-[#DCD3C7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#7FA79A]/15 flex items-center justify-center text-[#65897D]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#2B2B23]">Direct Order Checkout</h3>
              <p className="text-[11px] text-[#8A8178]">Razorpay 256-Bit Encrypted Checkout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EDE6DC] text-[#2B2723] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* Order Summary Card */}
          <div className="p-4 bg-[#FAF6F1] rounded-2xl border border-[#DCD3C7] flex items-center gap-4">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-16 h-20 object-cover object-top rounded-xl border border-[#DCD3C7]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase text-[#65897D] tracking-wider">Order Summary</span>
              <h4 className="text-sm font-serif font-bold text-[#2B2723] truncate">{product.title}</h4>
              <div className="flex items-center gap-2 text-xs text-[#8A8178] mt-1">
                <span>Size: <strong className="text-[#65897D] font-bold">{size}</strong></span>
                <span>•</span>
                <span>Qty: 1</span>
              </div>
              <div className="text-sm font-serif font-bold text-[#65897D] mt-1">
                ₹{product.price.toLocaleString('en-IN')}{' '}
                <span className="text-xs text-[#7FA79A] font-medium">Free Express Delivery</span>
              </div>
            </div>
          </div>

          {/* Customer Shipping Form */}
          <form id="checkout-form" onSubmit={handlePay} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] border-b border-[#EDE7E1] pb-2">
              Shipping & Delivery Details
            </h4>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#5C554E] mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ananya Sharma"
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#EDE7E1] rounded-xl text-sm focus:outline-none focus:border-[#9E6962]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5C554E] mb-1">
                  Mobile Number (WhatsApp) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#EDE7E1] rounded-xl text-sm focus:outline-none focus:border-[#9E6962]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5C554E] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ananya@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#EDE7E1] rounded-xl text-sm focus:outline-none focus:border-[#9E6962]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5C554E] mb-1">
                Complete Street Address <span className="text-rose-600">*</span>
              </label>
              <textarea
                name="address"
                required
                rows={2}
                value={form.address}
                onChange={handleChange}
                placeholder="House No, Street Name, Landmark"
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#EDE7E1] rounded-xl text-sm focus:outline-none focus:border-[#9E6962]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5C554E] mb-1">
                  City <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#EDE7E1] rounded-xl text-xs focus:outline-none focus:border-[#9E6962]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5C554E] mb-1">
                  State <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#EDE7E1] rounded-xl text-xs focus:outline-none focus:border-[#9E6962]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5C554E] mb-1">
                  Pincode <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="302001"
                  className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#EDE7E1] rounded-xl text-xs focus:outline-none focus:border-[#9E6962]"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Drawer Footer & Payment CTA */}
        <div className="p-5 bg-[#FAF6F1] border-t border-[#DCD3C7] space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#8A8178]">Total Payable Amount:</span>
            <span className="text-2xl font-serif font-bold text-[#65897D]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full py-4 bg-[#7FA79A] hover:bg-[#65897D] disabled:opacity-50 text-white font-medium rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting Razorpay...
              </span>
            ) : (
              <>
                <CreditCard className="w-5 h-5 text-[#E88DAE]" />
                <span>Pay ₹{product.price.toLocaleString('en-IN')} via Razorpay</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-[#8A8178] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7FA79A]" /> Supports UPI (GPay/PhonePe), Paytm, Credit/Debit Cards & NetBanking
          </p>
        </div>

      </div>
    </div>
  );
};
