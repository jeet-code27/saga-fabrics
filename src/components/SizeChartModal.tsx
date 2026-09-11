'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check, HelpCircle, Info, ChevronRight, Calculator } from 'lucide-react';
import { Size } from '@/types';
import {
  WOMENS_SIZES_CM,
  WOMENS_SIZES_INCH,
  MEASURING_GUIDE,
  MeasurementUnit,
  recommendSize,
} from '@/lib/sizeChart';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize?: Size;
  onSelectSize?: (size: Size) => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  selectedSize,
  onSelectSize,
}) => {
  const [unit, setUnit] = useState<MeasurementUnit>('inch');
  const [activeTab, setActiveTab] = useState<'chart' | 'calculator' | 'howToMeasure'>('chart');
  
  // Fit calculator state
  const [calcInput, setCalcInput] = useState<string>('38');

  if (!isOpen) return null;

  const currentSizes = unit === 'inch' ? WOMENS_SIZES_INCH : WOMENS_SIZES_CM;

  // Handle calculator recommendation
  const numericInput = parseFloat(calcInput);
  const recommendation =
    !isNaN(numericInput) && numericInput > 20 && numericInput < 150
      ? recommendSize(numericInput, unit)
      : null;

  const handleSizeClick = (sz: Size) => {
    if (onSelectSize) {
      onSelectSize(sz);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF6F1] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#DCD3C7] my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Royal Burgundy theme */}
        <div className="bg-gradient-to-r from-[#7A1B38] via-[#8E2142] to-[#7A1B38] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Size Chart"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#F7C687] text-xs font-semibold tracking-wider uppercase mb-1">
            <Ruler className="w-4 h-4" />
            <span>Saga Fabrics • Authentic Size & Fit Guide</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-tight">
            Women's Sizing Chart
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            Find your perfect fit for our handcrafted stitched kurtis, suits, and ensembles. Measured with standard regular-fit ease.
          </p>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/15 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('chart')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chart'
                  ? 'bg-white text-[#7A1B38] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Measurements Chart</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? 'bg-white text-[#7A1B38] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Find My Size</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('howToMeasure')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'howToMeasure'
                  ? 'bg-white text-[#7A1B38] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to Measure</span>
            </button>
          </div>
        </div>

        {/* Modal Body with smooth scrolling */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAF6F1]">
          
          {/* Unit Switcher & Quick Helper Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#DCD3C7]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B2723]">
                Measurement Unit:
              </span>
              <div className="inline-flex p-1 bg-[#FAF6F1] rounded-xl border border-[#DCD3C7]">
                <button
                  type="button"
                  onClick={() => {
                    setUnit('inch');
                    if (calcInput === '95') setCalcInput('38');
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    unit === 'inch'
                      ? 'bg-[#7A1B38] text-white shadow-xs'
                      : 'text-[#8A8178] hover:text-[#2B2723]'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnit('cm');
                    if (calcInput === '38') setCalcInput('95');
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    unit === 'cm'
                      ? 'bg-[#7A1B38] text-white shadow-xs'
                      : 'text-[#8A8178] hover:text-[#2B2723]'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#65897D]">
              <Sparkles className="w-4 h-4 text-[#B59757]" />
              <span className="font-medium">Regular Comfort Fit • Ready to Wear</span>
            </div>
          </div>

          {/* TAB 1: SIZING MATRIX CHART */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A1B38]">
                  Womens Sizes ({unit === 'inch' ? 'INCH' : 'CM'})
                </span>
                {selectedSize && (
                  <span className="text-xs bg-[#7A1B38]/10 text-[#7A1B38] px-2.5 py-1 rounded-full font-semibold">
                    Current Item Size: <strong>{selectedSize}</strong>
                  </span>
                )}
              </div>

              {/* Responsive Size Table */}
              <div className="overflow-x-auto rounded-2xl border border-[#DCD3C7] bg-white shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6F1] border-b border-[#DCD3C7] text-[#2B2723]">
                      <th className="p-3 sm:p-4 font-serif font-bold uppercase tracking-wider sticky left-0 bg-[#FAF6F1] z-10">
                        Size
                      </th>
                      {currentSizes.map((item) => {
                        const isCurrent = selectedSize === item.size;
                        return (
                          <th
                            key={item.size}
                            onClick={() => handleSizeClick(item.size)}
                            className={`p-3 sm:p-4 font-serif font-bold text-center transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-[#7A1B38] text-white'
                                : 'hover:bg-[#EDE6DC] text-[#2B2723]'
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-base sm:text-lg">{item.size}</span>
                              {isCurrent && (
                                <span className="text-[10px] uppercase font-sans tracking-wide bg-white/20 text-white px-1.5 py-0.5 rounded-full mt-0.5">
                                  Active
                                </span>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4D9CC] text-[#2B2723]">
                    {/* Bust Row */}
                    <tr className="hover:bg-[#FAF6F1]/50 transition-colors">
                      <td className="p-3 sm:p-4 font-bold text-[#65897D] sticky left-0 bg-white z-10 border-r border-[#E4D9CC]">
                        Bust ({unit === 'inch' ? 'in' : 'cm'})
                      </td>
                      {currentSizes.map((item) => (
                        <td
                          key={item.size}
                          onClick={() => handleSizeClick(item.size)}
                          className={`p-3 sm:p-4 text-center font-medium transition-colors cursor-pointer ${
                            selectedSize === item.size
                              ? 'bg-[#7A1B38]/5 font-bold text-[#7A1B38]'
                              : ''
                          }`}
                        >
                          {item.bust}
                          {unit === 'inch' ? '″' : ''}
                        </td>
                      ))}
                    </tr>

                    {/* Waist Row */}
                    <tr className="hover:bg-[#FAF6F1]/50 transition-colors">
                      <td className="p-3 sm:p-4 font-bold text-[#65897D] sticky left-0 bg-white z-10 border-r border-[#E4D9CC]">
                        Waist ({unit === 'inch' ? 'in' : 'cm'})
                      </td>
                      {currentSizes.map((item) => (
                        <td
                          key={item.size}
                          onClick={() => handleSizeClick(item.size)}
                          className={`p-3 sm:p-4 text-center font-medium transition-colors cursor-pointer ${
                            selectedSize === item.size
                              ? 'bg-[#7A1B38]/5 font-bold text-[#7A1B38]'
                              : ''
                          }`}
                        >
                          {item.waist}
                          {unit === 'inch' ? '″' : ''}
                        </td>
                      ))}
                    </tr>

                    {/* Hips Row */}
                    <tr className="hover:bg-[#FAF6F1]/50 transition-colors">
                      <td className="p-3 sm:p-4 font-bold text-[#65897D] sticky left-0 bg-white z-10 border-r border-[#E4D9CC]">
                        Hips ({unit === 'inch' ? 'in' : 'cm'})
                      </td>
                      {currentSizes.map((item) => (
                        <td
                          key={item.size}
                          onClick={() => handleSizeClick(item.size)}
                          className={`p-3 sm:p-4 text-center font-medium transition-colors cursor-pointer ${
                            selectedSize === item.size
                              ? 'bg-[#7A1B38]/5 font-bold text-[#7A1B38]'
                              : ''
                          }`}
                        >
                          {item.hips}
                          {unit === 'inch' ? '″' : ''}
                        </td>
                      ))}
                    </tr>

                    {/* Front Length Row */}
                    <tr className="hover:bg-[#FAF6F1]/50 transition-colors">
                      <td className="p-3 sm:p-4 font-bold text-[#65897D] sticky left-0 bg-white z-10 border-r border-[#E4D9CC]">
                        Front Length ({unit === 'inch' ? 'in' : 'cm'})
                      </td>
                      {currentSizes.map((item) => (
                        <td
                          key={item.size}
                          onClick={() => handleSizeClick(item.size)}
                          className={`p-3 sm:p-4 text-center font-medium transition-colors cursor-pointer ${
                            selectedSize === item.size
                              ? 'bg-[#7A1B38]/5 font-bold text-[#7A1B38]'
                              : ''
                          }`}
                        >
                          {item.frontLength}
                          {unit === 'inch' ? '″' : ''}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {onSelectSize && (
                <div className="flex items-center justify-between text-xs text-[#8A8178] px-1">
                  <span>💡 Tip: Click any size column above to quickly select it.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SMART FIT CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="bg-white p-5 rounded-2xl border border-[#DCD3C7] space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-[#2B2723] flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#7A1B38]" /> Find Your Recommended Fit
                </h3>
                <p className="text-xs text-[#8A8178]">
                  Enter your bust measurement below. We will instantly identify your ideal standard Indian stitched size.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#2B2723] block">
                    Your Bust Measurement ({unit === 'inch' ? 'Inches' : 'CM'})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      value={calcInput}
                      onChange={(e) => setCalcInput(e.target.value)}
                      placeholder={unit === 'inch' ? 'e.g. 38' : 'e.g. 95'}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DCD3C7] focus:outline-none focus:border-[#7A1B38] font-serif text-lg font-bold text-[#2B2723]"
                    />
                    <span className="font-bold text-sm text-[#8A8178] shrink-0">
                      {unit === 'inch' ? 'inches' : 'cm'}
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-[#8A8178]">Quick select:</span>
                    {(unit === 'inch' ? ['34', '36', '38', '40', '42', '44'] : ['85', '91', '95', '100', '105', '110']).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCalcInput(val)}
                        className={`px-2 py-0.5 text-xs rounded-md border transition-colors cursor-pointer ${
                          calcInput === val
                            ? 'bg-[#7A1B38] text-white border-[#7A1B38]'
                            : 'bg-[#FAF6F1] text-[#2B2723] border-[#DCD3C7] hover:border-[#7A1B38]'
                        }`}
                      >
                        {val}
                        {unit === 'inch' ? '″' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Recommendation Result */}
                {recommendation ? (
                  <div className="p-4 bg-[#7A1B38]/5 rounded-2xl border border-[#7A1B38]/20 space-y-2 text-center sm:text-left">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#7A1B38] block">
                      Recommended Size
                    </span>
                    <div className="flex items-baseline justify-center sm:justify-start gap-2">
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-[#7A1B38]">
                        Size {recommendation.recommendedSize}
                      </span>
                      <span className="text-xs text-[#65897D] font-bold bg-[#65897D]/10 px-2.5 py-0.5 rounded-full">
                        Best Fit
                      </span>
                    </div>
                    <p className="text-xs text-[#8A8178]">{recommendation.fitNote}</p>

                    {onSelectSize && (
                      <button
                        type="button"
                        onClick={() => handleSizeClick(recommendation.recommendedSize)}
                        className="mt-2 w-full sm:w-auto px-4 py-2 bg-[#7A1B38] hover:bg-[#5C142A] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Select Size {recommendation.recommendedSize}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-[#FAF6F1] rounded-2xl border border-[#DCD3C7] text-xs text-[#8A8178] text-center">
                    Enter a valid measurement between 28″ and 50″ (or 70 cm – 130 cm) to view your size recommendation.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HOW TO MEASURE GUIDE */}
          {activeTab === 'howToMeasure' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-[#2B2723]">
                  How to Take Accurate Body Measurements
                </h3>
                <p className="text-xs text-[#8A8178]">
                  For best results, take measurements over well-fitted undergarments. Keep the tape comfortably snug, not tight.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {MEASURING_GUIDE.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border border-[#DCD3C7] space-y-2 hover:border-[#7A1B38]/40 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#2B2723]">
                          {step.title}
                          {step.hindiTitle && (
                            <span className="text-xs font-sans font-normal text-[#8A8178] ml-1.5">
                              ({step.hindiTitle})
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>
                    <p className="text-xs text-[#8A8178] leading-relaxed">
                      {step.description}
                    </p>
                    <div className="text-[11px] text-[#65897D] bg-[#65897D]/5 p-2 rounded-xl border border-[#65897D]/15">
                      <strong>Pro-tip:</strong> {step.tip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unstitched Sets Notice Box */}
          <div className="p-4 bg-gradient-to-r from-[#FAF6F1] to-[#EDE6DC] rounded-2xl border border-[#DCD3C7] flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <h5 className="font-serif font-bold text-[#2B2723] text-sm">
                Ordering an Unstitched Suit Set?
              </h5>
              <p className="text-[#8A8178] leading-relaxed">
                You don't need to select a size! All unstitched suit sets come with ample premium fabric:
                <strong> ~2.5m Kurti top</strong>, <strong>~2.5m Bottom fabric</strong>, and <strong>~2.25m pure dupatta</strong>.
                Your local boutique tailor can customize it to any desired size from <strong>XS to 5XL</strong> and in your preferred neck/hem styling.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#DCD3C7] flex items-center justify-between">
          <div className="text-xs text-[#8A8178]">
            Need personal sizing assistance? WhatsApp our stylists at{' '}
            <a
              href="https://wa.me/917023352132"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7A1B38] font-bold underline hover:text-[#5C142A]"
            >
              +91 70233 52132
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#2B2723] hover:bg-[#403B35] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
