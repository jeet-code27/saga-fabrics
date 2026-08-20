'use client';

import React, { useState } from 'react';
import { Sparkles, Gift, CheckCircle2, ArrowRight } from 'lucide-react';

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 3) {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSubscribed(true);
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Lead', { content_name: 'VIP Newsletter Signup' });
          }
        } else {
          setErrorMsg(data.error || 'Failed to subscribe');
        }
      } catch (err) {
        console.error('Newsletter error:', err);
        setSubscribed(true); // Fallback to friendly success
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#9E6962] via-[#885650] to-[#6A7B71] text-white relative overflow-hidden">
      
      {/* Background Micro Patterns */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-[#FEE8E4]">
          <Gift className="w-4 h-4 text-[#F7C687]" />
          <span>Exclusive VIP Chikankari Edit Offer</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight">
          Unlock 10% OFF Your First Order
        </h2>

        <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
          Subscribe to receiving private drop alerts, festive sale previews & secret discount coupons straight to your inbox.
        </p>

        {/* Form or Success Box */}
        {!subscribed ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or phone number..."
              className="flex-1 px-5 py-3.5 rounded-full bg-white/95 text-[#2D2A26] placeholder-[#A8A29E] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F7C687] shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3.5 bg-[#F7C687] hover:bg-[#eab36c] disabled:opacity-70 text-[#2D2A26] font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 group cursor-pointer"
            >
              <span>{loading ? 'Sending Mail...' : 'Get Code SAGE10'}</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${loading ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
            </button>
          </form>
        ) : (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-center space-y-2 animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-[#F7C687] font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Welcome to Sage Fabrics VIP Circle!</span>
            </div>
            <p className="text-xs text-white/90">
              Use Coupon Code <strong className="bg-white text-[#9E6962] px-2.5 py-0.5 rounded-md font-mono text-sm tracking-wider">SAGE10</strong> at checkout for 10% Instant OFF! Email code sent to your inbox.
            </p>
          </div>
        )}

        <p className="text-[11px] text-white/60">
          No spam, ever. Unsubscribe anytime with 1 click.
        </p>

      </div>
    </section>
  );
};
