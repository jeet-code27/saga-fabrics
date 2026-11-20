import React from 'react';

// Soft snowfall for the winter sections. Positions are fixed so server and client render alike.
// [left %, size px, fall duration s, delay s, opacity]
const FLAKES: [number, number, number, number, number][] = [
  [4, 3, 14, 0, 0.5], [11, 2, 18, 4, 0.35], [17, 4, 16, 9, 0.45], [24, 2, 20, 2, 0.3],
  [31, 3, 15, 11, 0.5], [38, 2, 19, 6, 0.35], [45, 4, 17, 1, 0.4], [52, 2, 21, 13, 0.3],
  [58, 3, 14, 7, 0.5], [64, 2, 18, 3, 0.35], [70, 4, 16, 12, 0.45], [76, 2, 20, 5, 0.3],
  [82, 3, 15, 10, 0.5], [88, 2, 19, 0, 0.35], [93, 4, 17, 8, 0.4], [97, 2, 22, 14, 0.3],
];

export const Snowfall: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
    {FLAKES.map(([left, size, duration, delay, opacity], i) => (
      <span
        key={i}
        className="snowflake absolute -top-3 rounded-full bg-white"
        style={{
          left: `${left}%`,
          width: size,
          height: size,
          opacity,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    ))}
  </div>
);
