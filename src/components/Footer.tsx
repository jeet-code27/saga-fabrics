'use client';

import React from 'react';
import { MapPin, Phone, Mail, Globe, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2B2723] text-[#FAF6F1] pt-16 pb-8 border-t border-[#DCD3C7]/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Intro Column */}
          <div className="space-y-4 md:col-span-2">
            <img
              src="/images/saga-fabrics-logo-new.png"
              alt="Saga Fabrics"
              className="h-16 sm:h-20 w-auto object-contain bg-[#FAF6F1] px-4 py-2 rounded-2xl shadow-sm border border-[#E4D9CC]"
            />
            <p className="text-xs text-[#8A8178] leading-relaxed max-w-md">
              Celebrating timeless artisanal elegance, <strong>Saga Fabrics</strong> curates handcrafted Chikankari unstitched suit sets with pure cotton dupattas in soft ethnic pastel hues. Every garment represents centuries of Indian thread embroidery craftsmanship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAF6F1] hover:bg-[#7FA79A] transition-colors cursor-pointer" title="Saga Fabrics Web">
                <Globe className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAF6F1] hover:bg-[#7FA79A] transition-colors cursor-pointer" title="Share Collection">
                <Share2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-serif font-semibold text-[#7FA79A] uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-[#8A8178]">
              <li><a href="#collection" className="hover:text-[#FAF6F1] transition-colors">Unstitched Suit Fabrics</a></li>
              <li><a href="#categories" className="hover:text-[#FAF6F1] transition-colors">Chikankari Collections</a></li>
              <li><a href="#craft-story" className="hover:text-[#FAF6F1] transition-colors">The Chikankari Process</a></li>
              <li><a href="#faq" className="hover:text-[#FAF6F1] transition-colors">Fabric Care & FAQs</a></li>
            </ul>
          </div>

          {/* Contact Workshop */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-serif font-semibold text-[#E88DAE] uppercase tracking-wider">Artisan Studio</h4>
            <ul className="space-y-2 text-[#8A8178]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7FA79A] shrink-0 mt-0.5" />
                <span>Customer Care & Dispatch Atelier</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7FA79A] shrink-0" />
                <a href="https://wa.me/917023352132" target="_blank" rel="noopener noreferrer" className="hover:text-[#FAF6F1] transition-colors">
                  +91 70233 52132 / WhatsApp Support
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7FA79A] shrink-0" />
                <span>care@sagafabrics.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8178] gap-4">
          <p>© {new Date().getFullYear()} Saga Fabrics. All Rights Reserved. (No Returns Policy)</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="/terms-and-conditions" className="hover:text-white transition-colors underline decoration-[#E88DAE]">Terms & Conditions</a>
            <span>•</span>
            <a href="/privacy-policy" className="hover:text-white transition-colors underline decoration-[#E88DAE]">Privacy Policy</a>
            <span>•</span>
            <span>Razorpay Safe</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
