'use client';

import React, { useState } from 'react';
import { Ruler, Sparkles, Check, HelpCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Size } from '@/types';
import {
  WOMENS_SIZES_CM,
  WOMENS_SIZES_INCH,
  MEASURING_GUIDE,
  MeasurementUnit,
  SizeMeasurement,
} from '@/lib/sizeChart';

interface ProductSizeChartProps {
  selectedSize?: Size;
  availableSizes?: Size[];
  onSelectSize?: (size: Size) => void;
  className?: string;
  defaultExpanded?: boolean;
}

export const ProductSizeChart: React.FC<ProductSizeChartProps> = ({
  selectedSize = 'M',
  availableSizes,
  onSelectSize,
  className = '',
  defaultExpanded = true,
}) => {
  const [unit, setUnit] = useState<MeasurementUnit>('inch');
  const [mobileActiveSize, setMobileActiveSize] = useState<string>(
    selectedSize && selectedSize !== 'Unstitched' ? selectedSize : 'M'
  );
  const [showFullTableMobile, setShowFullTableMobile] = useState<boolean>(false);
  const [showMeasuringGuide, setShowMeasuringGuide] = useState<boolean>(false);

  React.useEffect(() => {
    if (selectedSize && selectedSize !== 'Unstitched') {
      setMobileActiveSize(selectedSize);
    }
  }, [selectedSize]);

  const currentSizes = unit === 'inch' ? WOMENS_SIZES_INCH : WOMENS_SIZES_CM;
  const activeMeasure: SizeMeasurement =
    currentSizes.find((s) => s.size === mobileActiveSize) || currentSizes[2];

  const handleSizeClick = (sz: Size) => {
    setMobileActiveSize(sz);
    // If availableSizes is specified and this size is NOT available,
    // only update the chart preview, do NOT select it for purchase!
    if (availableSizes && availableSizes.length > 0 && !availableSizes.includes(sz)) {
      return;
    }
    if (onSelectSize) {
      onSelectSize(sz);
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-[#DCD3C7] shadow-xs overflow-hidden ${className}`}>
      
      {/* Header Banner */}
      <div className="bg-[#FAF6F1] px-4 sm:px-6 py-4 border-b border-[#E4D9CC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] flex items-center justify-center shrink-0">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#2B2723]">
              Women's Size & Fitting Chart
            </h3>
            <p className="text-[11px] text-[#8A8178]">
              Standard Regular Fit Sizing (XS to XXL)
            </p>
          </div>
        </div>

        {/* Unit Toggle Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8178]">Unit:</span>
          <div className="inline-flex p-1 bg-white rounded-xl border border-[#DCD3C7] shadow-2xs">
            <button
              type="button"
              onClick={() => setUnit('inch')}
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
              onClick={() => setUnit('cm')}
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
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        
        {/* ======================================================== */}
        {/* MOBILE VIEW (Screens < 640px): Card & Tabs for 100% Fit  */}
        {/* ======================================================== */}
        <div className="block sm:hidden space-y-4">
          
          {/* Size Selector Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B2723]">
                Tap to View Size:
              </span>
              <span className="text-[11px] text-[#7A1B38] font-bold bg-[#7A1B38]/10 px-2.5 py-0.5 rounded-full">
                Size {mobileActiveSize} Active
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {currentSizes.map((item) => {
                const isActive = mobileActiveSize === item.size;
                const isSelected = selectedSize === item.size;
                const isAvailable = !availableSizes || availableSizes.length === 0 || availableSizes.includes(item.size);
                return (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => handleSizeClick(item.size)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#7A1B38] text-white border-[#7A1B38] shadow-md scale-105'
                        : isActive
                        ? 'bg-[#7A1B38]/15 text-[#7A1B38] border-[#7A1B38]/30'
                        : isAvailable
                        ? 'bg-[#FAF6F1] text-[#2B2723] border-[#DCD3C7] hover:border-[#7A1B38]'
                        : 'bg-stone-100 text-stone-400 border-stone-200'
                    }`}
                  >
                    <span className={!isAvailable && !isSelected ? 'line-through opacity-60' : ''}>{item.size}</span>
                    {!isAvailable && (
                      <span className="text-[8px] text-stone-400 font-normal">Out</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Size Measurement Breakdown Card */}
          <div className="p-4 bg-[#FAF6F1] rounded-2xl border border-[#DCD3C7] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E4D9CC] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif font-bold text-[#7A1B38]">
                  Size {activeMeasure.size}
                </span>
                <span className="text-[11px] bg-[#65897D]/10 text-[#65897D] font-bold px-2 py-0.5 rounded-full">
                  Standard Fit
                </span>
              </div>
              <span className="text-[11px] text-[#8A8178]">
                {unit === 'inch' ? 'Values in Inches' : 'Values in CM'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-[#E4D9CC]">
                <span className="text-[11px] text-[#8A8178] block">Bust / Chest</span>
                <span className="text-base font-serif font-bold text-[#2B2723]">
                  {activeMeasure.bust} {unit === 'inch' ? 'in' : 'cm'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-[#E4D9CC]">
                <span className="text-[11px] text-[#8A8178] block">Waist</span>
                <span className="text-base font-serif font-bold text-[#2B2723]">
                  {activeMeasure.waist} {unit === 'inch' ? 'in' : 'cm'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-[#E4D9CC]">
                <span className="text-[11px] text-[#8A8178] block">Hips</span>
                <span className="text-base font-serif font-bold text-[#2B2723]">
                  {activeMeasure.hips} {unit === 'inch' ? 'in' : 'cm'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-[#E4D9CC]">
                <span className="text-[11px] text-[#8A8178] block">Front Length</span>
                <span className="text-base font-serif font-bold text-[#2B2723]">
                  {activeMeasure.frontLength} {unit === 'inch' ? 'in' : 'cm'}
                </span>
              </div>
            </div>

            {onSelectSize && selectedSize !== activeMeasure.size && (
              <button
                type="button"
                onClick={() => onSelectSize(activeMeasure.size)}
                className="w-full py-2.5 bg-[#7A1B38] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Select Size {activeMeasure.size} for Order</span>
              </button>
            )}
          </div>

          {/* Toggle Full Matrix Table on Mobile */}
          <button
            type="button"
            onClick={() => setShowFullTableMobile(!showFullTableMobile)}
            className="w-full py-2 text-xs font-bold text-[#7A1B38] hover:text-[#5C142A] flex items-center justify-center gap-1.5 border border-[#DCD3C7] rounded-xl bg-white cursor-pointer"
          >
            <span>{showFullTableMobile ? 'Hide Full Comparison Table' : 'View Full Sizing Table (All Sizes)'}</span>
            {showFullTableMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP VIEW + EXPANDED MOBILE: Full Matrix Table        */}
        {/* ======================================================== */}
        <div className={`${showFullTableMobile ? 'block' : 'hidden sm:block'}`}>
          <div className="overflow-x-auto rounded-2xl border border-[#DCD3C7] shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-[#FAF6F1] border-b border-[#DCD3C7]">
                  <th className="p-3 sm:p-3.5 font-serif font-bold uppercase tracking-wider text-[#2B2723] bg-[#FAF6F1]">
                    Metric
                  </th>
                  {currentSizes.map((item) => {
                    const isSelected = selectedSize === item.size;
                    const isInspecting = mobileActiveSize === item.size && !isSelected;
                    const isAvailable = !availableSizes || availableSizes.length === 0 || availableSizes.includes(item.size);
                    return (
                      <th
                        key={item.size}
                        onClick={() => handleSizeClick(item.size)}
                        className={`p-3 sm:p-3.5 font-serif font-bold text-center transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#7A1B38] text-white shadow-xs'
                            : isInspecting
                            ? 'bg-[#7A1B38]/15 text-[#7A1B38]'
                            : isAvailable
                            ? 'hover:bg-[#EDE6DC] text-[#2B2723]'
                            : 'bg-stone-100/70 text-[#8A8178]'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className={`text-sm sm:text-base font-bold ${!isAvailable && !isSelected ? 'line-through opacity-60' : ''}`}>
                            {item.size}
                          </span>
                          {isSelected ? (
                            <span className="text-[9px] uppercase tracking-wide bg-white/25 text-white px-2 py-0.5 rounded-full mt-1 font-sans font-bold">
                              Selected
                            </span>
                          ) : isAvailable ? (
                            <span className="text-[9px] uppercase tracking-wide text-[#65897D] font-bold mt-1 font-sans">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase tracking-wide text-rose-500 font-medium mt-1 font-sans">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4D9CC] text-[#2B2723]">
                {/* Bust */}
                <tr className="hover:bg-[#FAF6F1]/50 transition-colors">
                  <td className="p-3 sm:p-3.5 font-bold text-[#65897D] bg-white border-r border-[#E4D9CC]">
                    Bust ({unit === 'inch' ? 'in' : 'cm'})
                  </td>
                  {currentSizes.map((item) => (
                    <td
                      key={item.size}
                      onClick={() => handleSizeClick(item.size)}
                      className={`p-3 sm:p-3.5 text-center font-medium transition-colors cursor-pointer ${
                        selectedSize === item.size
                          ? 'bg-[#7A1B38]/10 font-bold text-[#7A1B38]'
                          : mobileActiveSize === item.size
                          ? 'bg-[#B59757]/10 font-semibold text-[#2B2723]'
                          : ''
                      }`}
                    >
                      {item.bust}
                      {unit === 'inch' ? '″' : ''}
                    </td>
                  ))}
                </tr>

                {/* Waist */}
                <tr className="hover:bg-[#FAF6F1]/50 transition-colors">
                  <td className="p-3 sm:p-3.5 font-bold text-[#65897D] bg-white border-r border-[#E4D9CC]">
                    Waist ({unit === 'inch' ? 'in' : 'cm'})
                  </td>
                  {currentSizes.map((item) => (
                    <td
                      key={item.size}
                      onClick={() => handleSizeClick(item.size)}
                      className={`p-3 sm:p-3.5 text-center font-medium transition-colors cursor-pointer ${
                        selectedSize === item.size
                          ? 'bg-[#7A1B38]/10 font-bold text-[#7A1B38]'
                          : mobileActiveSize === item.size
                          ? 'bg-[#B59757]/10 font-semibold text-[#2B2723]'
                          : ''
                      }`}
                    >
                      {item.waist}
                      {unit === 'inch' ? '″' : ''}
                    </td>
                  ))}
                </tr>

                {/* Hips */}
                <tr className="hover:bg-[#FAF6F1]/50 transition-colors">
                  <td className="p-3 sm:p-3.5 font-bold text-[#65897D] bg-white border-r border-[#E4D9CC]">
                    Hips ({unit === 'inch' ? 'in' : 'cm'})
                  </td>
                  {currentSizes.map((item) => (
                    <td
                      key={item.size}
                      onClick={() => handleSizeClick(item.size)}
                      className={`p-3 sm:p-3.5 text-center font-medium transition-colors cursor-pointer ${
                        selectedSize === item.size
                          ? 'bg-[#7A1B38]/10 font-bold text-[#7A1B38]'
                          : mobileActiveSize === item.size
                          ? 'bg-[#B59757]/10 font-semibold text-[#2B2723]'
                          : ''
                      }`}
                    >
                      {item.hips}
                      {unit === 'inch' ? '″' : ''}
                    </td>
                  ))}
                </tr>

                {/* Front Length */}
                <tr className="hover:bg-[#FAF6F1]/50 transition-colors">
                  <td className="p-3 sm:p-3.5 font-bold text-[#65897D] bg-white border-r border-[#E4D9CC]">
                    Front Length ({unit === 'inch' ? 'in' : 'cm'})
                  </td>
                  {currentSizes.map((item) => (
                    <td
                      key={item.size}
                      onClick={() => handleSizeClick(item.size)}
                      className={`p-3 sm:p-3.5 text-center font-medium transition-colors cursor-pointer ${
                        selectedSize === item.size
                          ? 'bg-[#7A1B38]/10 font-bold text-[#7A1B38]'
                          : mobileActiveSize === item.size
                          ? 'bg-[#B59757]/10 font-semibold text-[#2B2723]'
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
        </div>

        {/* How to Measure Accordion */}
        <div className="pt-2 border-t border-[#E4D9CC]">
          <button
            type="button"
            onClick={() => setShowMeasuringGuide(!showMeasuringGuide)}
            className="w-full flex items-center justify-between text-xs sm:text-sm font-serif font-bold text-[#2B2723] hover:text-[#7A1B38] py-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#7A1B38]" />
              <span>How to Measure Body for Best Fit</span>
            </span>
            {showMeasuringGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMeasuringGuide && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              {MEASURING_GUIDE.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FAF6F1] rounded-xl border border-[#DCD3C7] text-xs space-y-1"
                >
                  <div className="font-bold text-[#7A1B38] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#7A1B38] text-white text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <p className="text-[#8A8178] leading-relaxed">{step.description}</p>
                  <p className="text-[11px] text-[#65897D] font-medium">Tip: {step.tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unstitched Note */}
        <div className="p-3.5 bg-[#FAF6F1] rounded-2xl border border-[#DCD3C7] flex items-start gap-3">
          <Info className="w-4 h-4 text-[#7A1B38] shrink-0 mt-0.5" />
          <p className="text-xs text-[#8A8178] leading-relaxed">
            <strong className="text-[#2B2723]">Looking for Unstitched Suit Sets?</strong> Unstitched sets include ample fabric (~2.5m top, ~2.5m bottom, ~2.25m dupatta) suitable for tailoring into any custom silhouette from XS up to 5XL.
          </p>
        </div>

      </div>
    </div>
  );
};
