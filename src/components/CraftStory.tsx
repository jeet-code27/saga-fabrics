'use client';

import React from 'react';
import Image from 'next/image';
import { trackContact } from '@/lib/metaPixel';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

const STEPS = [
  {
    title: 'Drawn by hand',
    text: 'Each motif is traced onto the fabric before a single stitch goes in.',
    image: '/images/craft/step-1-motif-design.jpg',
  },
  {
    title: 'Embroidered by karigars',
    text: 'Necklines, borders and jaal are worked by hand — that is why no two pieces are exactly alike.',
    image: '/images/craft/step-3-chikankari-threadwork.png',
  },
  {
    title: 'Washed, checked, packed',
    text: 'We wash, check and fold every piece ourselves in Jaipur before it ships to you.',
    image: '/images/craft/step-4-preshrunk-comfort.png',
  },
];

export const CraftStory: React.FC = () => {
  return (
    <section id="craft-story" className="py-14 md:py-24 bg-[#F3ECE2] border-y border-[#E4D9CC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Founders */}
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 items-center">
          <div className="relative mx-auto w-[78%] max-w-[300px] sm:max-w-sm lg:w-full lg:max-w-none">
            <div className="relative aspect-[4/5] rounded-t-full overflow-hidden ring-1 ring-[#D9C7AE]">
              <Image
                src="/images/products/stitched-suit-ivory-cream.jpeg"
                alt="Ivory cream hand-embroidered suit from Saga Fabrics"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-4 right-2 sm:-right-4 bg-white rounded-xl px-4 py-3 shadow-lg border border-[#E4D9CC] rotate-[-2deg]">
              <p className="font-serif italic text-lg text-[#7A1B38] leading-none">Gaurav & Sonica</p>
              <p className="text-[10px] uppercase tracking-wider text-[#8A8178] mt-1">Founders · Jaipur</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#A08350]">Our story</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-serif text-[#2B2723] leading-tight">
              Two people, one small studio in Jaipur
            </h2>
            <div className="mt-5 space-y-4 text-[15px] text-[#5A524B] leading-relaxed">
              <p>
                Saga Fabrics is run by Gaurav Misra and Sonica. Gaurav spent years in a corporate job; Sonica was a
                teacher. Every time we shopped for suits for a family function, it was the same story — “cotton” that
                turned out to be polyester, prints that faded after two washes, or designer prices we couldn’t justify.
              </p>
              <p>
                So we left our jobs and started Saga. We pick the fabric ourselves, work directly with embroidery
                karigars, and check every piece before it is packed at our studio in Jagatpura.
              </p>
              <p className="font-serif italic text-xl text-[#2B2723]">
                Not sure about a size or a colour? Message us — one of us will reply.
              </p>
            </div>
            <a
              href="https://wa.me/917023352132"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact('WhatsApp Support', 'Founders Story Section')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2B2723] hover:bg-black text-white text-sm font-medium transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366]" size="16px" />
              Chat with us on WhatsApp
            </a>
          </div>
        </div>

        {/* How it's made */}
        <div className="mt-16 sm:mt-24">
          <div className="flex items-end justify-between gap-4 mb-5">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#2B2723]">How a Saga piece is made</h3>
          </div>
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {STEPS.map((s, i) => (
              <figure key={s.title} className="snap-start shrink-0 w-[78%] sm:w-auto bg-white rounded-xl overflow-hidden border border-[#E4D9CC]">
                <div className="relative aspect-[4/3] bg-[#EDE4D8]">
                  <Image src={s.image} alt={s.title} fill sizes="(max-width: 640px) 78vw, 33vw" className="object-cover" />
                  <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 text-[#7A1B38] font-serif text-lg flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <figcaption className="p-4">
                  <p className="font-serif text-xl text-[#2B2723]">{s.title}</p>
                  <p className="mt-1 text-sm text-[#6F665E] leading-relaxed">{s.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
