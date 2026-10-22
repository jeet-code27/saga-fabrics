import React from 'react';

// Marigold toran: swags of genda phool with small brass bells at each joint.
const SWAG_W = 150;
const SWAGS = 8;
const MARIGOLD = ['#F59E0B', '#EA580C', '#FBBF24', '#F97316'];

const flowers: { x: number; y: number; c: string }[] = [];
for (let s = 0; s < SWAGS; s++) {
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    flowers.push({
      x: s * SWAG_W + t * SWAG_W,
      y: 6 + 26 * 4 * t * (1 - t),
      c: MARIGOLD[(s + i) % MARIGOLD.length],
    });
  }
}

export const Toran: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox={`0 0 ${SWAG_W * SWAGS} 64`}
    preserveAspectRatio="xMidYMin slice"
    className={`block w-full h-10 sm:h-14 pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <line x1="0" y1="4" x2={SWAG_W * SWAGS} y2="4" stroke="#B8862E" strokeWidth="2" />
    {Array.from({ length: SWAGS + 1 }, (_, s) => (
      <g key={`j${s}`} transform={`translate(${s * SWAG_W} 0)`}>
        <ellipse cx="-7" cy="10" rx="7" ry="3" fill="#3F7D3A" transform="rotate(-30 -7 10)" />
        <ellipse cx="7" cy="10" rx="7" ry="3" fill="#2F6B2C" transform="rotate(30 7 10)" />
        <line x1="0" y1="8" x2="0" y2="40" stroke="#B8862E" strokeWidth="1" />
        <path d="M-5 40 Q0 30 5 40 Z" fill="#D9B871" />
        <circle cx="0" cy="42" r="1.6" fill="#D9B871" />
      </g>
    ))}
    {flowers.map((f, i) => (
      <circle key={i} cx={f.x} cy={f.y} r="5.2" fill={f.c} stroke="#C2410C" strokeOpacity="0.35" strokeWidth="1" />
    ))}
  </svg>
);

// A single clay diya with a flickering flame.
export const Diya: React.FC<{ className?: string; delay?: number }> = ({ className = '', delay = 0 }) => (
  <svg viewBox="0 0 60 48" className={`pointer-events-none ${className}`} aria-hidden="true">
    <defs>
      <radialGradient id="diya-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="diya-clay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    <g className="diya-flame" style={{ animationDelay: `${delay}s` }}>
      <circle cx="30" cy="16" r="14" fill="url(#diya-glow)" />
      <path d="M30 4 C35 12 35 20 30 23 C25 20 25 12 30 4 Z" fill="#FBBF24" />
      <path d="M30 10 C32.5 15 32.5 19 30 21 C27.5 19 27.5 15 30 10 Z" fill="#FFF7D6" />
    </g>
    <path d="M6 26 Q30 50 54 26 Q30 32 6 26 Z" fill="url(#diya-clay)" />
    <path d="M6 26 Q30 32 54 26" fill="none" stroke="#FCD34D" strokeWidth="1.2" />
    <circle cx="20" cy="33" r="1.3" fill="#FCD34D" />
    <circle cx="30" cy="35.5" r="1.3" fill="#FCD34D" />
    <circle cx="40" cy="33" r="1.3" fill="#FCD34D" />
  </svg>
);

export const DiyaRow: React.FC<{ count?: number; className?: string }> = ({ count = 7, className = '' }) => (
  <div className={`flex items-end justify-around pointer-events-none ${className}`} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <Diya key={i} delay={i * 0.37} className={`w-8 sm:w-11 ${i % 2 ? 'mb-1' : ''}`} />
    ))}
  </div>
);
