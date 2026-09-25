'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/metaPixel';

/**
 * BUG FIX: MetaPixelContent tracks route changes ONLY.
 * The initial PageView is already fired inside the fbevents.js script snippet below.
 * Using `isFirstRender` ref to skip the duplicate PageView on component mount.
 * Without this fix, the very first page load fires PageView TWICE:
 *   1. from fbq('track', 'PageView') inside the Script tag
 *   2. from useEffect firing on initial mount
 */
const MetaPixelContent: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Skip: first mount PageView is already sent by the inline Script snippet
      isFirstRender.current = false;
      return;
    }
    // Subsequent route changes in SPA navigation (Next.js app router)
    pageview();
  }, [pathname, searchParams]);

  return null;
};

export const MetaPixel: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <MetaPixelContent />
    </Suspense>
  );
};
