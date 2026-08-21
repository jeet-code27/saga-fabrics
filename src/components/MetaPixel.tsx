'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { FB_PIXEL_ID, pageview } from '@/lib/metaPixel';

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
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
      <Suspense fallback={null}>
        <MetaPixelContent />
      </Suspense>
    </>
  );
};
