'use client';

import React from 'react';
import { MapPin, Navigation, Clock, ShieldCheck, Phone, Video } from 'lucide-react';
import { GoogleIcon } from '@/components/GoogleIcon';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { trackContact } from '@/lib/metaPixel';
import { trackGAContact } from '@/lib/gtag';

export const AtelierLocation: React.FC = () => {
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Saga+Fabrics+Ashadeep+Green+Avenue+Jagatpura+Jaipur';

  const appointmentMessage = encodeURIComponent(
    'Hello Gaurav & Sonica! I would like to schedule a visit to the Saga Fabrics Jaipur atelier / request a live fabric video call.'
  );

  return (
    <section id="location" className="py-20 bg-[#FAF6F1] border-t border-[#E4D9CC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] text-xs font-bold uppercase tracking-widest border border-[#7A1B38]/20">
            <MapPin className="w-3.5 h-3.5" />
            <span>Authentic Jaipur Workshop Presence</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2B2723] tracking-tight">
            Visit Our Atelier & Workshop in Jaipur
          </h2>

          <p className="text-xs sm:text-sm text-[#8A8178] leading-relaxed">
            Rooted in the royal craft capital of Rajasthan. Every handcrafted suit and kurti is tailored, inspected, and dispatched directly from our Jaipur workshop. We are 100% transparent and proud of our heritage roots.
          </p>
        </div>

        {/* Main Grid: Details on Left, Interactive Google Map on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Workshop Details & Reassurance (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Location Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D9CC] shadow-sm space-y-6 flex-1 flex flex-col justify-between">
              
              <div className="space-y-5">
                {/* Google Verified Banner */}
                <div className="p-3.5 rounded-2xl bg-[#FAF6F1] border border-[#E4D9CC] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <GoogleIcon className="w-5 h-5 shrink-0" size="20px" />
                    <div>
                      <h4 className="text-xs font-bold text-[#2B2723] flex items-center gap-1.5">
                        <span>Saga Fabrics</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-semibold">
                          Verified Business
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#8A8178]">
                        4.9 ★ on Google Maps • Real Workshop
                      </p>
                    </div>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#7A1B38] hover:underline flex items-center gap-1"
                  >
                    <span>View Profile</span>
                  </a>
                </div>

                {/* Atelier Address */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1B38]">
                    Official Workshop Address
                  </span>
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#FAF6F1] text-[#7A1B38] shrink-0 mt-0.5 border border-[#E4D9CC]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2B2723] leading-relaxed">
                        A305, Ashadeep Green Avenue Apartment, Jagatpura, Jaipur, Rajasthan – 302017
                      </p>
                      <p className="text-xs text-[#8A8178] mt-1">
                        Landmark: Near Bombay Hospital Road, Jagatpura
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visiting Hours & Video Call */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#2B2723] font-bold">
                      <Clock className="w-4 h-4 text-[#B59757]" />
                      <span>Atelier Timings</span>
                    </div>
                    <p className="text-[11px] text-[#8A8178]">
                      Mon – Sat: 10:00 AM – 7:00 PM
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#E4D9CC] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#2B2723] font-bold">
                      <Video className="w-4 h-4 text-[#1B4D3E]" />
                      <span>Live Video Call</span>
                    </div>
                    <p className="text-[11px] text-[#8A8178]">
                      Request fabric close-up call
                    </p>
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Direct Atelier Fulfillment: No third-party middlemen. Dispatched directly from here.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#F3ECE2] space-y-2.5">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#7A1B38] hover:bg-[#5C142A] text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Navigation className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Get Directions on Google Maps</span>
                </a>

                <a
                  href={`https://wa.me/917023352132?text=${appointmentMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackContact('Atelier Visit Inquiry', 'Jaipur Map Section');
                    trackGAContact('Atelier Visit Inquiry');
                  }}
                  className="w-full py-3 px-4 bg-white hover:bg-emerald-50 text-[#25D366] border border-[#25D366]/40 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" size="16px" />
                  <span>Book Atelier Visit / Video Call (+91 70233 52132)</span>
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Google Maps Interactive Embed (7 cols) */}
          <div className="lg:col-span-7 flex">
            <div className="w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-[#E4D9CC] shadow-md bg-white relative flex flex-col">
              
              {/* Map Card Header Bar */}
              <div className="px-5 py-3.5 bg-[#FAF6F1] border-b border-[#E4D9CC] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <GoogleIcon className="w-4 h-4" size="18px" />
                  <span className="font-serif font-bold text-[#2B2723]">
                    Saga Fabrics — Jaipur Atelier & Packaging Hub
                  </span>
                </div>
                <span className="text-[10px] text-[#1B4D3E] font-bold bg-[#1B4D3E]/10 px-2 py-0.5 rounded-full">
                  Live Location
                </span>
              </div>

              {/* The Provided Google Maps Embed Iframe */}
              <div className="relative flex-1 w-full min-h-[380px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.126683411296!2d75.8684352!3d26.8040946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9bd3a9bcaef%3A0x45076e95fa1c6b28!2sSaga%20Fabrics!5e0!3m2!1sen!2sin!4v1791030365006!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Saga Fabrics Jaipur Atelier Map"
                  className="w-full h-full absolute inset-0"
                />
              </div>

              {/* Map Footer Bar with Direct Link */}
              <div className="px-5 py-2.5 bg-white border-t border-[#E4D9CC] flex items-center justify-between text-[11px] text-[#8A8178]">
                <span>26.8041° N, 75.8684° E • Jagatpura, Jaipur</span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#7A1B38] hover:underline flex items-center gap-1"
                >
                  <span>Open Full Screen Map</span>
                  <span>↗</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
