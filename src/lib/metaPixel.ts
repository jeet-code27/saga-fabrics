export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '2953910144968945';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

// Track pageview on route change
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track standard & custom Meta Ads events
// content_type: 'product' is required by Meta for e-commerce ROAS attribution
export const trackEvent = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};
