'use client';

import React from 'react';
import { MapPin, Phone, Mail, Globe, Share2, ShieldCheck, Lock, Ruler } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { trackContact } from '@/lib/metaPixel';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

interface FooterProps {
  onOpenSizeChart?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSizeChart }) => {
  const handleFooterSizeGuide = () => {
    if (onOpenSizeChart) {
      onOpenSizeChart();
      return;
    }
    const el = typeof document !== 'undefined' ? document.getElementById('size-chart-section') : null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/#faq';
    }
  };

  return (
    <footer className="bg-[#2B2723] text-[#FAF6F1] pt-16 pb-8 border-t border-[#DCD3C7]/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Intro Column */}
          <div className="space-y-4 md:col-span-1">
            <Image
              src="/images/saga-fabrics-new.png"
              alt="Saga Fabrics"
              width={180}
              height={64}
              className="max-h-14 w-auto object-contain bg-[#FAF6F1] px-4 py-2 rounded-2xl shadow-sm border border-[#E4D9CC]"
              style={{ height: '56px', width: 'auto' }}
            />
            <p className="text-xs text-[#8A8178] leading-relaxed">
              Hand-embroidered suits, kurtis and jewellery from a small studio in Jaipur, run by Gaurav &amp; Sonica.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-serif font-semibold text-[#D9B871] uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-[#8A8178]">
              <li><Link href="/shop" className="hover:text-[#FAF6F1] transition-colors">Shop all</Link></li>
              <li><Link href="/shop?category=sale" className="hover:text-[#FAF6F1] transition-colors">Diwali Sale</Link></li>
              <li><Link href="/shop?category=short-kurti" className="hover:text-[#FAF6F1] transition-colors">Short kurtis</Link></li>
              <li><Link href="/shop?category=unstitched" className="hover:text-[#FAF6F1] transition-colors">Unstitched suits</Link></li>
              <li><Link href="/shop?category=jewellery" className="hover:text-[#FAF6F1] transition-colors">Jewellery</Link></li>
              <li>
                <button
                  type="button"
                  onClick={handleFooterSizeGuide}
                  className="hover:text-[#FAF6F1] transition-colors text-left flex items-center gap-1.5 cursor-pointer text-[#FAF6F1]/90"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#F7C687]" />
                  <span>Size guide</span>
                </button>
              </li>
              <li><Link href="/#craft-story" className="hover:text-[#FAF6F1] transition-colors">Our story</Link></li>
              <li><Link href="/#faq" className="hover:text-[#FAF6F1] transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Merchant Policies (Razorpay Mandatory) */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-serif font-semibold text-[#D9B871] uppercase tracking-wider">Policies</h4>
            <ul className="space-y-2 text-[#8A8178]">
              <li><Link href="/terms-and-conditions" className="hover:text-[#FAF6F1] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#FAF6F1] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#FAF6F1] transition-colors">Cancellation & Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#FAF6F1] transition-colors">Shipping & Delivery Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-serif font-semibold text-[#D9B871] uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-[#8A8178]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7FA79A] shrink-0 mt-0.5" />
                <div>
                  <span>Jagatpura, Jaipur, Rajasthan - 302017</span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Saga+Fabrics+Jagatpura+Jaipur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[11px] text-[#F7C687] hover:underline mt-1 font-semibold"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" size="16px" />
                <a
                  href="https://wa.me/917023352132"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContact('WhatsApp Support', 'Footer Support Link')}
                  className="hover:text-[#FAF6F1] transition-colors"
                >
                  +91 70233 52132 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7FA79A] shrink-0" />
                <a href="mailto:support@sagafabrics.in" className="hover:text-[#FAF6F1] transition-colors">
                  support@sagafabrics.in
                </a>
              </li>
              <li className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#FAF6F1]/90 flex-wrap gap-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7FA79A] shrink-0" />
                  <span>MSME: <strong className="font-mono text-[#F7C687]">UDYAM-RJ-17-0677985</strong></span>
                </div>
                <a
                  href="/msme-certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#E88DAE] hover:text-white underline decoration-[#E88DAE] transition-colors"
                >
                  View Certificate ↗
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8178] gap-4">
          <p>© {new Date().getFullYear()} Saga Fabrics. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center">
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors underline decoration-[#E88DAE]">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors underline decoration-[#E88DAE]">Privacy Policy</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors underline decoration-[#E88DAE]">Refund Policy</Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-white transition-colors underline decoration-[#E88DAE]">Shipping Policy</Link>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[#7FA79A] font-semibold"><Lock className="w-3 h-3" /> Razorpay Secured</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
