'use client';

import React, { useEffect, useState } from 'react';
import { SALE } from '@/lib/sale';

const getParts = () => {
  const ms = Math.max(0, new Date(SALE.endsAt).getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
};

const pad = (n: number) => String(n).padStart(2, '0');

// Renders nothing on the server so the ticking clock never causes a hydration mismatch.
export const SaleCountdown: React.FC<{ variant?: 'inline' | 'blocks'; className?: string }> = ({
  variant = 'inline',
  className = '',
}) => {
  const [t, setT] = useState<ReturnType<typeof getParts> | null>(null);

  useEffect(() => {
    const tick = () => setT(getParts());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (!t) return <span className={className} aria-hidden="true" />;

  if (variant === 'inline') {
    return (
      <span className={`tabular-nums ${className}`}>
        {t.d > 0 ? `${t.d}d ` : ''}
        {pad(t.h)}h {pad(t.m)}m {pad(t.s)}s
      </span>
    );
  }

  const units: [number, string][] = [
    [t.d, 'Days'],
    [t.h, 'Hrs'],
    [t.m, 'Min'],
    [t.s, 'Sec'],
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`} role="timer" aria-label="Time left in sale">
      {units.map(([v, label]) => (
        <div
          key={label}
          className="w-14 sm:w-16 py-2 rounded-lg bg-black/20 border border-[#D9B871]/30 text-center"
        >
          <div className="text-xl sm:text-2xl font-serif font-semibold tabular-nums text-[#F6E7C1] leading-none">
            {pad(v)}
          </div>
          <div className="text-[9px] uppercase tracking-[0.15em] text-[#F6E7C1]/70 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
};
