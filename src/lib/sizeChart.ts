export interface SizeMeasurement {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  bust: number;
  waist: number;
  hips: number;
  frontLength: number;
}

export type MeasurementUnit = 'cm' | 'inch';

// Womens Sizes (CM) - Exactly matching brand specifications
export const WOMENS_SIZES_CM: SizeMeasurement[] = [
  { size: 'XS', bust: 85, waist: 80, hips: 90, frontLength: 115 },
  { size: 'S', bust: 91, waist: 86, hips: 96.5, frontLength: 117 },
  { size: 'M', bust: 95, waist: 90, hips: 100, frontLength: 115 },
  { size: 'L', bust: 100, waist: 95, hips: 105, frontLength: 115 },
  { size: 'XL', bust: 105, waist: 100, hips: 110, frontLength: 115 },
  { size: 'XXL', bust: 110, waist: 105, hips: 115, frontLength: 115 },
];

// Womens Sizes (INCH) - Exactly matching brand specifications
export const WOMENS_SIZES_INCH: SizeMeasurement[] = [
  { size: 'XS', bust: 34, waist: 32, hips: 36, frontLength: 46 },
  { size: 'S', bust: 36, waist: 34, hips: 38, frontLength: 46 },
  { size: 'M', bust: 38, waist: 36, hips: 40, frontLength: 46 },
  { size: 'L', bust: 40, waist: 38, hips: 42, frontLength: 46 },
  { size: 'XL', bust: 42, waist: 40, hips: 44, frontLength: 46 },
  { size: 'XXL', bust: 44, waist: 42, hips: 46, frontLength: 46 },
];

export interface MeasuringGuideStep {
  title: string;
  hindiTitle?: string;
  description: string;
  tip: string;
}

export const MEASURING_GUIDE: MeasuringGuideStep[] = [
  {
    title: 'Bust / Chest',
    hindiTitle: 'सीना',
    description: 'Measure around the fullest part of your bust, keeping the measuring tape comfortably snug and horizontal under your arms.',
    tip: 'Wear the bra style you plan to wear with this kurti or suit.',
  },
  {
    title: 'Waist',
    hindiTitle: 'कमर',
    description: 'Measure around your natural waistline, typically the narrowest point above your navel and below the rib cage.',
    tip: 'Keep one finger between the tape and your body for ease of movement.',
  },
  {
    title: 'Hips',
    hindiTitle: 'कूल्हे',
    description: 'Stand naturally with your feet together and wrap the tape around the fullest, widest part of your hips and seat.',
    tip: 'Ensure the tape stays parallel to the floor all the way around.',
  },
  {
    title: 'Front Length',
    hindiTitle: 'कुर्ती की लंबाई',
    description: 'Measured straight down along the front from the highest point of your shoulder seam near the collar down to the hemline.',
    tip: 'Standard stitched kurti length is ~46 inches (115–117 cm), providing elegant knee/calf coverage.',
  },
];

/**
 * Recommends size based on bust measurement in inches or cm
 */
export function recommendSize(measurement: number, unit: MeasurementUnit): {
  recommendedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  fitNote: string;
} {
  const chart = unit === 'inch' ? WOMENS_SIZES_INCH : WOMENS_SIZES_CM;
  
  if (unit === 'inch') {
    if (measurement <= 34.5) return { recommendedSize: 'XS', fitNote: 'True to regular fit for 34″ bust' };
    if (measurement <= 36.5) return { recommendedSize: 'S', fitNote: 'Comfortable regular fit for 36″ bust' };
    if (measurement <= 38.5) return { recommendedSize: 'M', fitNote: 'Graceful regular fit for 38″ bust' };
    if (measurement <= 40.5) return { recommendedSize: 'L', fitNote: 'Comfortable classic fit for 40″ bust' };
    if (measurement <= 42.5) return { recommendedSize: 'XL', fitNote: 'Relaxed elegant fit for 42″ bust' };
    return { recommendedSize: 'XXL', fitNote: 'Relaxed comfortable fit for 44″+ bust' };
  } else {
    if (measurement <= 87) return { recommendedSize: 'XS', fitNote: 'Regular fit for ~85 cm bust' };
    if (measurement <= 92) return { recommendedSize: 'S', fitNote: 'Regular fit for ~91 cm bust' };
    if (measurement <= 97) return { recommendedSize: 'M', fitNote: 'Regular fit for ~95 cm bust' };
    if (measurement <= 102) return { recommendedSize: 'L', fitNote: 'Regular fit for ~100 cm bust' };
    if (measurement <= 107) return { recommendedSize: 'XL', fitNote: 'Regular fit for ~105 cm bust' };
    return { recommendedSize: 'XXL', fitNote: 'Regular fit for ~110 cm bust' };
  }
}
