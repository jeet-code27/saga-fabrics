'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Palette,
  Scissors,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  Heart,
  Briefcase,
  GraduationCap,
  MessageCircle,
  Award,
  Compass,
  Check,
} from 'lucide-react';
import { trackContact } from '@/lib/metaPixel';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export const CraftStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Artisanal Motif Design',
      subtitle: 'Precision Motif Sketching',
      description:
        'Master artisans outline delicate paisley, floral, and traditional motifs onto pure cotton fabrics before hand embroidery begins.',
      icon: Scissors,
      tag: '100% Hand Designed',
      image: '/images/craft/step-1-motif-design.jpg',
    },
    {
      num: '02',
      title: 'Eco Vegetable Dyeing',
      subtitle: 'Natural Botanical Pigments',
      description:
        'We use non-toxic, eco-friendly dye baths prepared from organic indigo leaves, turmeric, and dried marigold petals for rich, skin-safe colors.',
      icon: Palette,
      tag: 'Skin Safe & Non-Toxic',
      image: '/images/craft/step-2-eco-dyeing.png',
    },
    {
      num: '03',
      title: 'Hand Embroidery & Needlework',
      subtitle: '18+ Hours Per Garment',
      description:
        'Talented female artisans meticulously hand-embroider delicate traditional stitches along necklines and sleeve borders.',
      icon: Sparkles,
      tag: 'Artisan Empowered',
      image: '/images/craft/step-3-chikankari-threadwork.png',
    },
    {
      num: '04',
      title: 'Pre-Shrunk Comfort',
      subtitle: 'Cloud-Soft Hand Feel',
      description:
        'Every completed suit set & kurti is pre-washed with bio-softeners to guarantee zero shrinkage, color fastness, and effortless breathability.',
      icon: ShieldCheck,
      tag: 'Zero Shrinkage',
      image: '/images/craft/step-4-preshrunk-comfort.png',
    },
  ];

  return (
    <section id="craft-story" className="py-16 md:py-24 bg-[#FAF6F1] relative overflow-hidden border-b border-[#E4D9CC]">
      {/* Background Micro Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B59757]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7A1B38]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 space-y-20">
        
        {/* ========================================================================= */}
        {/* PART 1: THE REAL FOUNDER STORY (GAURAV MISHRA & SONICA)                   */}
        {/* ========================================================================= */}
        <div>
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#7A1B38] bg-[#7A1B38]/10 px-4 py-1.5 rounded-full border border-[#7A1B38]/20">
              <Heart className="w-3.5 h-3.5 text-[#B59757] fill-[#B59757]" /> The Heart Behind Saga Fabrics
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2B2723] tracking-tight">
              Our Story: Meet Gaurav & Sonica
            </h2>
            <p className="text-sm sm:text-base text-[#8A8178] leading-relaxed">
              How a corporate professional and an educator left their careers behind to celebrate authentic Indian handlooms full-time.
            </p>
          </div>

          {/* Founders Story Showcase Card */}
          <div className="bg-white rounded-3xl border border-[#E4D9CC] shadow-xl overflow-hidden max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: The Journey Narrative */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                
                {/* Micro Badges for Corporate & Education Background */}
                <div className="flex flex-wrap gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F1] border border-[#E4D9CC] text-[#2B2723] text-xs font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-[#7A1B38]" /> Gaurav: Corporate Background
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F1] border border-[#E4D9CC] text-[#2B2723] text-xs font-semibold">
                    <GraduationCap className="w-3.5 h-3.5 text-[#B59757]" /> Sonica: Education & Academia
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B2723] leading-snug">
                    Two Secure Careers, One Bold Dream for Pure Handcrafted Indian Wear
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7A1B38]">
                    Based in Jaipur, Rajasthan • 100% Full-Time Founders
                  </p>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-[#615850] leading-relaxed">
                  <p>
                    Before Saga Fabrics came to life, our days looked very different. <strong>Gaurav Mishra</strong> was navigating the demanding corporate grind of deadlines and boardrooms, while <strong>Sonica</strong> was passionately shaping young minds in the education sector.
                  </p>
                  <p>
                    Whenever we went shopping for authentic ethnic suits and kurtis for family, celebrations, or daily comfort, we encountered the same heartbreaking reality: markets flooded with synthetic polyester blends masquerading as cotton, fast-fashion prints that washed away in two washes, and luxury designer labels with exorbitant middleman markups.
                  </p>
                  <p className="border-l-2 border-[#7A1B38] pl-4 italic text-[#2B2723] font-serif">
                    "We asked ourselves a simple question: Why should Indian women have to choose between cheap synthetic fast-fashion and ridiculously expensive designer wear? Why can't we offer genuine, breathable 100% pure cotton handcrafted by real artisans at fair, honest prices?"
                  </p>
                  <p>
                    That question changed everything. We took a leap of faith, <strong>quit our corporate and educational careers</strong>, and poured our hearts, savings, and souls into building <strong>Saga Fabrics</strong> full-time.
                  </p>
                  <p>
                    Today, we work 24/7 out of Jaipur, Rajasthan. We aren't a faceless corporate website or a dropshipping portal. We personally source raw fabrics, sit with traditional craft families, test every fabric for skin comfort and pre-shrunk durability, and personally inspect every suit before it gets packaged for your home.
                  </p>
                </div>
              </div>

              {/* Founder Pillars */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#F3ECE2]">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#2B2723] uppercase tracking-wide">Direct Artisan Pride</h5>
                    <p className="text-xs text-[#8A8178] mt-0.5">Fair wages directly to Rajasthani craft clusters.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#B59757]/15 text-[#B59757] flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#2B2723] uppercase tracking-wide">Zero Dropshipping</h5>
                    <p className="text-xs text-[#8A8178] mt-0.5">Hand-inspected & shipped directly by our team.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Founder's Personal Letter & Signature Card */}
            <div className="lg:col-span-5 bg-[#FAF6F1] p-8 sm:p-10 border-t lg:border-t-0 lg:border-l border-[#E4D9CC] flex flex-col justify-between relative">
              
              {/* Monogram Seal */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#E4D9CC] shadow-xs flex flex-col items-center justify-center text-[#7A1B38]">
                    <span className="font-serif font-black text-lg tracking-wider">G&S</span>
                    <span className="text-[8px] uppercase tracking-widest text-[#B59757] font-bold">Jaipur</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] border border-[#7A1B38]/20">
                    Founders' Pledge
                  </span>
                </div>

                {/* Personal Letter */}
                <div className="space-y-4">
                  <h4 className="text-xl font-serif font-semibold text-[#2B2723]">
                    "A Personal Letter to Every Saga Fabrics Customer"
                  </h4>
                  
                  <div className="text-xs sm:text-sm text-[#615850] space-y-3 leading-relaxed">
                    <p>
                      Dear Valued Customer,
                    </p>
                    <p>
                      When you order a suit set or kurti from Saga Fabrics, you're not receiving a mass-produced product from a giant automated assembly line.
                    </p>
                    <p>
                      You are wearing our dream—days of skilled artisan handwork, hours of hand embroidery, and pure, breathable cotton that will keep you cool and comfortable all day.
                    </p>
                    <p>
                      If you ever have any questions about size, fit, fabric care, or styling, please reach out to us directly. We are always here to help you personally.
                    </p>
                  </div>

                  {/* Signed by Founders */}
                  <div className="pt-4 border-t border-[#E4D9CC] space-y-1">
                    <p className="font-serif italic text-lg sm:text-xl text-[#7A1B38] font-bold">
                      Gaurav Mishra & Sonica
                    </p>
                    <p className="text-xs text-[#8A8178] font-medium uppercase tracking-wider">
                      Founders, Saga Fabrics • Jaipur, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Helpline for Trust */}
              <div className="mt-8 pt-6 border-t border-[#E4D9CC] space-y-2">
                <p className="text-xs font-semibold text-[#2B2723]">
                  Have a question before buying? Talk to our Jaipur team:
                </p>
                <a
                  href="https://wa.me/917023352132"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContact('WhatsApp Support', 'Founders Story Section')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BE5C] text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" size="18px" />
                  <span>Chat on WhatsApp: +91 70233 52132</span>
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* PART 2: THE 4-STEP ARTISANAL CRAFT PROCESS                                */}
        {/* ========================================================================= */}
        <div>
          {/* Subheading */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#7A1B38] bg-[#7A1B38]/10 px-3.5 py-1.5 rounded-full border border-[#7A1B38]/20">
              <Compass className="w-3.5 h-3.5 text-[#B59757]" /> Handcrafted Precision
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-medium text-[#2B2723] tracking-tight">
              How Every Saga Garment is Made
            </h3>
            <p className="text-xs sm:text-sm text-[#8A8178]">
              Step into the craft process that Gaurav and Sonica personally supervise in Rajasthan.
            </p>
          </div>

          {/* Step Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#7A1B38] shadow-md scale-102 ring-2 ring-[#7A1B38]/20'
                      : 'bg-white/60 hover:bg-white border-[#E4D9CC] text-[#8A8178]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#7A1B38]' : 'text-[#8A8178]'}`}>
                      STEP {step.num}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#7A1B38]' : 'text-[#8A8178]'}`} />
                  </div>
                  <h4 className={`text-xs sm:text-sm font-serif font-semibold ${isActive ? 'text-[#2B2723]' : 'text-[#8A8178]'}`}>
                    {step.title}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase Card */}
          <div className="bg-white rounded-3xl border border-[#E4D9CC] shadow-lg overflow-hidden max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Text Detail */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] text-xs font-bold uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{steps[activeStep].tag}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#2B2723]">
                  {steps[activeStep].title}: <span className="text-[#7A1B38] font-normal italic">{steps[activeStep].subtitle}</span>
                </h3>
                <p className="text-sm sm:text-base text-[#8A8178] leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Micro Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F3ECE2]">
                <div>
                  <p className="text-xs text-[#8A8178] font-medium uppercase tracking-wider">Fabric Base</p>
                  <p className="text-sm font-serif font-semibold text-[#2B2723] mt-0.5">100% Pure Organic Cotton</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8178] font-medium uppercase tracking-wider">Origin</p>
                  <p className="text-sm font-serif font-semibold text-[#2B2723] mt-0.5">Jaipur Artisan Workshop</p>
                </div>
              </div>
            </div>

            {/* Right Image Visual */}
            <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden bg-[#FAF6F1]">
              <Image
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <p className="text-xs uppercase tracking-widest text-[#B59757] font-bold">Artisanal Craft Studio</p>
                <p className="text-sm font-serif font-bold">Supervised by Gaurav & Sonica</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

