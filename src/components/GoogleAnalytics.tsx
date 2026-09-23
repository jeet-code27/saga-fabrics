'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_MEASUREMENT_ID, gaPageView } from '@/lib/gtag';

const GoogleAnalyticsContent: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // First mount is already tracked by the initial config script
      isFirstRender.current = false;
      return;
    }
    const query = searchParams?.toString();
    const url = pathname + (query ? `?${query}` : '');
    gaPageView(url);
  }, [pathname, searchParams]);

  return null;
};

export const GoogleAnalytics: React.FC = () => {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GoogleAnalyticsContent />
      </Suspense>
    </>
  );
};
