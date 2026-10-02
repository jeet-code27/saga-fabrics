'use client';

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { getDeliveryEstimate, DeliveryEstimate } from '@/lib/deliveryEstimator';

interface DeliveryEstimatorProps {
  initialPincode?: string;
  onPincodeChange?: (pin: string) => void;
  compact?: boolean;
}

const PINCODE_STORAGE_KEY = 'saga_fabrics_pincode';

export const DeliveryEstimator: React.FC<DeliveryEstimatorProps> = ({
  initialPincode = '',
  onPincodeChange,
  compact = false,
}) => {
  const [pincode, setPincode] = useState<string>(initialPincode);
  const [appliedPin, setAppliedPin] = useState<string>('');
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load remembered pincode from localStorage
  useEffect(() => {
    try {
      const saved = initialPincode || localStorage.getItem(PINCODE_STORAGE_KEY);
      if (saved && /^\d{6}$/.test(saved)) {
        setPincode(saved);
        setAppliedPin(saved);
        setEstimate(getDeliveryEstimate(saved));
        setIsEditing(false);
      }
    } catch (e) {}
  }, [initialPincode]);

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const clean = pincode.replace(/\D/g, '').slice(0, 6);
    if (clean.length !== 6) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    try {
      localStorage.setItem(PINCODE_STORAGE_KEY, clean);
    } catch (e) {}

    setAppliedPin(clean);
    setEstimate(getDeliveryEstimate(clean));
    setIsEditing(false);
    if (onPincodeChange) onPincodeChange(clean);
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#E4D9CC] overflow-hidden shadow-2xs ${compact ? 'p-3.5' : 'p-5'}`}>
      
      {/* Title & Subtitle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[#7A1B38]">
          <Truck className="w-4 h-4 shrink-0" />
          <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#2B2723]">
            Delivery & Pincode Checker
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#1B4D3E] bg-[#1B4D3E]/10 px-2.5 py-0.5 rounded-full">
          Free Delivery
        </span>
      </div>

      {isEditing ? (
        /* Pincode Input Form */
        <form onSubmit={handleCheck} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-[#8A8178] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPincode(val);
                  if (error) setError(null);
                }}
                placeholder="Enter 6-digit PIN code"
                maxLength={6}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DCD3C7] focus:border-[#7A1B38] focus:ring-2 focus:ring-[#7A1B38]/10 text-xs font-mono text-[#2B2723] outline-none transition-all placeholder:text-[#8A8178]/70"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#7A1B38] hover:bg-[#5C142A] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
            >
              Check
            </button>
          </div>

          {error ? (
            <p className="text-[11px] text-rose-600 font-medium pl-1">{error}</p>
          ) : (
            <p className="text-[11px] text-[#8A8178] pl-1">
              Enter your PIN to verify delivery date & courier availability.
            </p>
          )}
        </form>
      ) : (
        /* Active Delivery Estimate Display */
        estimate && (
          <div className="space-y-3 animate-fadeIn">
            {/* Delivery Date Highlight Box */}
            <div className="p-3 bg-[#FAF6F1] rounded-xl border border-[#E4D9CC] flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#2B2723]">
                  <span className="text-[#8A8178]">Estimated Delivery to</span>
                  <span className="font-mono font-bold text-[#7A1B38] bg-white px-2 py-0.5 rounded border border-[#E4D9CC]">
                    {appliedPin}
                  </span>
                </div>
                <div className="text-sm font-serif font-bold text-[#1B4D3E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1B4D3E]" />
                  <span>Expected by {estimate.dateRangeText}</span>
                </div>
                <p className="text-[11px] text-[#63584F] leading-relaxed">
                  (Estimated {estimate.minDays}–{estimate.maxDays} days • Free Express Air Shipping)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-bold text-[#7A1B38] hover:underline cursor-pointer shrink-0 pt-0.5"
              >
                Change
              </button>
            </div>

            {/* Courier & Dispatch Highlights */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-[#63584F]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B59757] shrink-0" />
                <span>Dispatched in 24–48h from Jaipur</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                <span>Delhivery / Bluedart Express</span>
              </div>
            </div>
          </div>
        )
      )}

    </div>
  );
};
