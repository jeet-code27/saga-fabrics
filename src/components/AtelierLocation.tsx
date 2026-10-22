'use client';

import React from 'react';
import { MapPin, Clock, Navigation, Video } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { trackContact } from '@/lib/metaPixel';
import { trackGAContact } from '@/lib/gtag';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Saga+Fabrics+Jagatpura+Jaipur';

export const AtelierLocation: React.FC = () => {
  const visitMessage = encodeURIComponent(
    'Hi Saga Fabrics! I would like to visit the Jaipur studio / see some pieces on a video call.'
  );

  return (
    <section id="location" className="py-14 md:py-24 bg-[#FAF6F1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-stretch">
        <div className="flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#A08350]">Visit us</p>
          <h2 className="mt-1 text-3xl sm:text-5xl font-serif text-[#2B2723] leading-tight">Come see the fabric in person</h2>
          <p className="mt-4 text-[15px] text-[#5A524B] leading-relaxed">
            Every order is packed and shipped from our studio in Jagatpura. You’re welcome to drop by — or if you’re
            far from Jaipur, we’ll happily show you any piece on a WhatsApp video call.
          </p>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-[#7A1B38] shrink-0 mt-0.5" />
              <div>
                <dt className="font-semibold text-[#2B2723]">Jagatpura, Jaipur, Rajasthan 302017</dt>
                <dd className="text-[#8A8178]">Near Bombay Hospital Road</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-[#7A1B38] shrink-0 mt-0.5" />
              <div>
                <dt className="font-semibold text-[#2B2723]">Monday – Saturday</dt>
                <dd className="text-[#8A8178]">10:00 AM – 7:00 PM</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Video className="w-5 h-5 text-[#7A1B38] shrink-0 mt-0.5" />
              <div>
                <dt className="font-semibold text-[#2B2723]">Video call</dt>
                <dd className="text-[#8A8178]">See colours and embroidery up close before you order</dd>
              </div>
            </div>
          </dl>

          <div className="mt-7 grid sm:grid-cols-2 gap-3">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#7A1B38] hover:bg-[#5C1329] text-white text-sm font-medium transition-colors"
            >
              <Navigation className="w-4 h-4" /> Get directions
            </a>
            <a
              href={`https://wa.me/917023352132?text=${visitMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackContact('Atelier Visit Inquiry', 'Jaipur Map Section');
                trackGAContact('Atelier Visit Inquiry');
              }}
              className="inline-flex items-center justify-center gap-2 py-3 rounded-full border border-[#2B2723] hover:bg-[#2B2723] hover:text-white text-sm font-medium transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" size="16px" /> Book a visit or call
            </a>
          </div>
        </div>

        <div className="relative min-h-[320px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-[#E4D9CC] bg-white">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.126683411296!2d75.8684352!3d26.8040946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9bd3a9bcaef%3A0x45076e95fa1c6b28!2sSaga%20Fabrics!5e0!3m2!1sen!2sin!4v1791030365006!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Saga Fabrics studio on Google Maps"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};
