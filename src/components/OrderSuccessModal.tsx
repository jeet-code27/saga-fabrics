'use client';

import React, { useEffect } from 'react';
import { Order } from '@/types';
import confetti from 'canvas-confetti';
import { CheckCircle, Package, Truck, Download, Home, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B263E', '#C85A32', '#D4AF37', '#10B981'],
      });
    } catch (e) {
      console.log('Confetti trigger fallback');
    }
  }, [order]);

  const handlePrint = () => {
    window.print();
  };

  const item = order.items[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E7E0D6] animate-scaleUp">
        
        {/* Celebration Header */}
        <div className="bg-gradient-to-br from-[#8B263E] to-[#721E32] text-white p-6 text-center relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30">
            <CheckCircle className="w-10 h-10 text-[#FFD700]" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#FFD700] font-bold">Payment Verified</span>
          <h2 className="text-2xl font-bold font-serif mt-1">Order Placed Successfully!</h2>
          <p className="text-xs text-white/80 mt-1">Thank you for choosing SAGA FABRICS, Jaipur</p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Order ID & Payment Info */}
          <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E7E0D6] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#78716C] block">Order Number</span>
              <strong className="text-[#8B263E] text-sm font-bold">{order.id}</strong>
            </div>
            <div className="text-right">
              <span className="text-[#78716C] block">Razorpay ID</span>
              <strong className="text-[#1C1917] font-mono">{order.razorpayPaymentId || 'pay_verified'}</strong>
            </div>
          </div>

          {/* Product Bought Summary */}
          {item && (
            <div className="p-3.5 bg-white rounded-2xl border border-[#E7E0D6] flex items-center gap-3">
              <img
                src={item.image}
                alt={item.productTitle}
                className="w-14 h-18 object-cover object-top rounded-xl border border-[#E7E0D6]"
              />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#1C1917] font-serif">{item.productTitle}</h4>
                <div className="flex items-center gap-3 text-xs text-[#57534E] mt-1">
                  <span>Size: <strong className="text-[#8B263E]">{item.size}</strong></span>
                  <span>Total: <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Shipping Info */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E7E0D6] space-y-1.5 text-xs text-[#57534E]">
            <h5 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#8B263E]" /> Shipping Address
            </h5>
            <p className="font-bold text-[#1C1917]">{order.customer.name}</p>
            <p>{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
            <p className="text-[#78716C]">Phone: {order.customer.phone}</p>
          </div>

          {/* Tracking Timeline */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="font-bold">Dispatching in 24 Hours from Jaipur Workshop</p>
              <p className="text-[11px] text-emerald-800">You will receive SMS & WhatsApp tracking updates.</p>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-[#FAF7F2] border-t border-[#E7E0D6] flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-1/2 py-3 px-4 bg-white border border-[#E7E0D6] hover:bg-gray-100 text-[#1C1917] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-[#8B263E]" /> Save Receipt
          </button>
          
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-3 px-4 bg-[#8B263E] hover:bg-[#721E32] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
