'use client';

import React from 'react';
import { MapPin, Phone, Mail, Globe, Share2, ShieldCheck, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
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
              Celebrating timeless artisanal elegance, <strong>Saga Fabrics</strong> curates handcrafted Chikankari suits, kurtis & unstitched fabric sets with pure cotton dupattas. Every garment represents centuries of Indian thread embroidery craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-serif font-semibold text-[#7FA79A] uppercase tracking-wider">Store Navigation</h4>
            <ul className="space-y-2 text-[#8A8178]">
              <li><a href="#collection" className="hover:text-[#FAF6F1] transition-colors">Suits & Kurtis Collection</a></li>
              <li><a href="#categories" className="hover:text-[#FAF6F1] transition-colors">Chikankari Collections</a></li>
              <li><a href="#craft-story" className="hover:text-[#FAF6F1] transition-colors">The Chikankari Process</a></li>
              <li><a href="#faq" className="hover:text-[#FAF6F1] transition-colors">Fabric Care & FAQs</a></li>
            </ul>
          </div>

          {/* Merchant Policies (Razorpay Mandatory) */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-serif font-semibold text-[#F7C687] uppercase tracking-wider">Merchant Policies</h4>
            <ul className="space-y-2 text-[#8A8178]">
              <li><Link href="/terms-and-conditions" className="hover:text-[#FAF6F1] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#FAF6F1] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#FAF6F1] transition-colors">Cancellation & Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#FAF6F1] transition-colors">Shipping & Delivery Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-serif font-semibold text-[#E88DAE] uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-2 text-[#8A8178]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7FA79A] shrink-0 mt-0.5" />
                <span>A305, Ashadeep Green Avenue Apartment, Jagatpura, Jaipur, Rajasthan - 302017</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7FA79A] shrink-0" />
                <a href="https://wa.me/917023352132" target="_blank" rel="noopener noreferrer" className="hover:text-[#FAF6F1] transition-colors">
                  +91 70233 52132 / WhatsApp Support
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7FA79A] shrink-0" />
                <a href="mailto:saga.fabricss@gmail.com" className="hover:text-[#FAF6F1] transition-colors">
                  saga.fabricss@gmail.com
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
