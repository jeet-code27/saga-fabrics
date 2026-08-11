'use client';

import React, { useState } from 'react';
import { Product, Size, CustomerInfo, Order } from '@/types';
import { X, Lock, ShieldCheck, CreditCard, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

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
  onRemoveProduct?: () => void;
  onSuccess: (order: Order) => void;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  product,
  size,
  onClose,
  onRemoveProduct,
  onSuccess,
}) => {
  if (!isOpen) return null;

  // Empty Cart View when product is removed
  if (!product) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
        <div className="relative bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between border-l border-[#EDE7E1] animate-slideLeft">
          <div className="p-5 bg-[#FAF6F1] border-b border-[#DCD3C7] flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-[#2B2723]">Your Cart</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-[#EDE6DC] text-[#2B2723] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#FAF6F1] border border-[#DCD3C7] flex items-center justify-center text-[#7A1B38] shadow-inner">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-serif font-bold text-[#2B2723]">Your Shopping Cart is Empty</h4>
            <p className="text-xs text-[#8A8178] max-w-xs leading-relaxed">
              You have removed the item from your cart. Browse our Jaipur unstitched collection to add items.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#7A1B38] hover:bg-[#5C142A] text-white text-xs font-bold rounded-full shadow-md transition-colors cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [quantity, setQuantity] = useState<number>(1);
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

  const totalAmount = product.price * quantity;

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
          amount: totalAmount,
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
        size: size || 'Unstitched',
        price: product.price,
        quantity: quantity,
      };

      // 2. Setup Razorpay Modal options
      const options = {
        key: orderData.key || 'rzp_test_TONWjBcoyCwxN0',
        amount: orderData.amount,
        currency: 'INR',
        name: 'SAGA FABRICS',
        description: `${product.title} (${quantity} Set${quantity > 1 ? 's' : ''})`,
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
                totalAmount: totalAmount,
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
            className="p-2 rounded-full hover:bg-[#EDE6DC] text-[#2B2723] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* Order Summary Card with Quantity Controls & Remove Option */}
          <div className="p-4 bg-[#FAF6F1] rounded-2xl border border-[#DCD3C7] space-y-3">
            <div className="flex items-start gap-4 relative">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-16 h-20 object-cover object-top rounded-xl border border-[#DCD3C7]"
              />
              <div className="flex-1 min-w-0 pr-8">
                <span className="text-[10px] font-bold uppercase text-[#65897D] tracking-wider">Order Item</span>
                <h4 className="text-sm font-serif font-bold text-[#2B2723] truncate">{product.title}</h4>
                <div className="flex items-center gap-2 text-xs text-[#8A8178] mt-0.5">
                  <span>Type: <strong className="text-[#7A1B38] font-bold">Unstitched Fabric Set</strong></span>
                </div>
                <div className="text-xs text-[#8A8178] mt-0.5">
                  Unit Price: <strong className="text-[#2B2723]">₹{product.price.toLocaleString('en-IN')}</strong>
                </div>
              </div>
              
              {/* Trash Remove Button */}
              <button
                type="button"
                onClick={() => {
                  if (onRemoveProduct) {
                    onRemoveProduct();
                  } else {
                    onClose();
                  }
                }}
                className="absolute top-0 right-0 p-1.5 rounded-xl text-rose-700 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="Remove Item from Cart"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>

            {/* Interactive Quantity Selector Bar */}
            <div className="flex items-center justify-between pt-2.5 border-t border-[#E4D9CC]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#2B2723]">Quantity:</span>
                <div className="flex items-center border border-[#DCD3C7] rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="p-1.5 text-xs font-bold text-[#2B2723] hover:bg-[#FAF6F1] disabled:opacity-30 transition-colors cursor-pointer"
                    title="Decrease Quantity"
                  >
                    <Minus className="w-3.5 h-3.5 text-[#7A1B38]" />
                  </button>
                  <span className="px-3 py-1 text-xs font-bold font-mono text-[#7A1B38] bg-[#FAF6F1]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="p-1.5 text-xs font-bold text-[#2B2723] hover:bg-[#FAF6F1] transition-colors cursor-pointer"
                    title="Increase Quantity"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#7A1B38]" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#8A8178]">Total</span>
                <p className="text-base font-serif font-bold text-[#7A1B38]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
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
            <span className="text-[#8A8178]">Total Payable ({quantity} Set{quantity > 1 ? 's' : ''}):</span>
            <span className="text-2xl font-serif font-bold text-[#7A1B38]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full py-4 bg-[#7A1B38] hover:bg-[#5C142A] disabled:opacity-50 text-white font-medium rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting Razorpay...
              </span>
            ) : (
              <>
                <CreditCard className="w-5 h-5 text-[#B59757]" />
                <span>Pay ₹{totalAmount.toLocaleString('en-IN')} via Razorpay</span>
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
