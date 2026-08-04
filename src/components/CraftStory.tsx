'use client';

import React, { useState } from 'react';
import { Palette, Scissors, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export const CraftStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Teak Block Carving',
      subtitle: 'Precision Hand-Chiseling',
      description: 'Master sculptors in Sanganer carve intricate paisley and floral motifs into seasoned Sheesham wood blocks with microscopic precision.',
      icon: Scissors,
      tag: '100% Hand Carved',
      image: '/images/craft/step-1-block-carving.png',
    },
    {
      num: '02',
      title: 'Eco Vegetable Dyeing',
      subtitle: 'Natural Botanical Pigments',
      description: 'We use non-toxic, eco-friendly dye baths prepared from organic indigo leaves, turmeric, and dried marigold petals for color depth.',
      icon: Palette,
      tag: 'Skin Safe & Non-Toxic',
      image: '/images/craft/step-2-eco-dyeing.png',
    },
    {
      num: '03',
      title: 'Chikankari Threadwork',
      subtitle: '18+ Hours Per Garment',
      description: 'Talented female artisans meticulously hand-embroider delicate Bakhiya and Phanda stitches along necklines and sleeve borders.',
      icon: Sparkles,
      tag: 'Artisan Empowered',
      image: '/images/craft/step-3-chikankari-threadwork.png',
    },
    {
      num: '04',
      title: 'Pre-Shrunk Comfort',
      subtitle: 'Cloud-Soft Hand Feel',
      description: 'Every completed Kurti is pre-washed with bio-softeners to guarantee zero shrinkage, color fastness, and effortless breathability.',
      icon: ShieldCheck,
      tag: 'Zero Shrinkage',
      image: '/images/craft/step-4-preshrunk-comfort.png',
    },
  ];

  return (
    <section id="craft-story" className="py-16 md:py-24 bg-[#EDE6DC] relative overflow-hidden border-b border-[#DCD3C7]">
      {/* Background Micro Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7FA79A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E88DAE]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#65897D] bg-[#7FA79A]/15 px-4 py-1.5 rounded-full border border-[#7FA79A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#E88DAE]" /> Artisanal Legacy
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2B2723] tracking-tight">
            The Making of a Sage Fabrics Masterpiece
          </h2>
          <p className="text-sm sm:text-base text-[#8A8178] leading-relaxed">
            Take a glimpse into our Jaipur atelier, where traditional techniques meet contemporary elegance.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-[#7FA79A] shadow-md scale-102'
                    : 'bg-white/60 hover:bg-white border-[#DCD3C7] text-[#8A8178]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#65897D]' : 'text-[#8A8178]'}`}>
                    STEP {step.num}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#65897D]' : 'text-[#8A8178]'}`} />
                </div>
                <h4 className={`text-sm font-serif font-semibold ${isActive ? 'text-[#2B2723]' : 'text-[#8A8178]'}`}>
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#DCD3C7] shadow-xl overflow-hidden max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7FA79A]/15 text-[#65897D] text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{steps[activeStep].tag}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif font-medium text-[#2B2723]">
                {steps[activeStep].title}: <span className="text-[#65897D] font-normal italic">{steps[activeStep].subtitle}</span>
              </h3>
              <p className="text-sm sm:text-base text-[#8A8178] leading-relaxed">
                {steps[activeStep].description}
              </p>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EDE6DC]">
              <div>
                <p className="text-xs text-[#8A8178] font-medium uppercase tracking-wider">Fabric Base</p>
                <p className="text-sm font-serif font-semibold text-[#2B2723] mt-0.5">100% Pure Organic Cotton</p>
              </div>
              <div>
                <p className="text-xs text-[#8A8178] font-medium uppercase tracking-wider">Origin</p>
                <p className="text-sm font-serif font-semibold text-[#2B2723] mt-0.5">Atelier Jaipur, Rajasthan</p>
              </div>
            </div>
          </div>

          {/* Right Image Visual */}
          <div className="lg:col-span-5 relative h-72 lg:h-auto overflow-hidden bg-[#FAF6F1]">
            <img
              src={steps[activeStep].image}
              alt={steps[activeStep].title}
              className="w-full h-full object-cover object-center transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs uppercase tracking-widest text-[#E88DAE] font-bold">Jaipur Craft Studio</p>
              <p className="text-sm font-serif font-bold">Crafted with Love & Precision</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
