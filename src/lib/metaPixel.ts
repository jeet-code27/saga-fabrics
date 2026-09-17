export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1808895900248579';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Track PageView on route change
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Track standard Meta Pixel event
 */
export const trackEvent = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};

/**
 * Track custom Meta Pixel event
 */
export const trackCustomEvent = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', name, options);
  }
};

/**
 * Advanced Matching: sends customer attributes to Meta Pixel for superior ad attribution and ROAS
 */
export const setUserData = (userData: {
  email?: string;
  phone?: string;
  name?: string;
  city?: string;
  state?: string;
  pincode?: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const data: Record<string, string> = {};
    if (userData.email) data.em = userData.email.trim().toLowerCase();
    if (userData.phone) {
      const cleaned = userData.phone.replace(/\D/g, '');
      data.ph = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
    }
    if (userData.name) {
      const parts = userData.name.trim().split(' ');
      data.fn = parts[0]?.toLowerCase() || '';
      if (parts.length > 1) {
        data.ln = parts.slice(1).join(' ').toLowerCase();
      }
    }
    if (userData.city) data.ct = userData.city.trim().toLowerCase();
    if (userData.state) data.st = userData.state.trim().toLowerCase();
    if (userData.pincode) data.zp = userData.pincode.trim();
    data.country = 'in';

    window.fbq('setUserProperties', FB_PIXEL_ID, data);
  }
};

// ==========================================
// Standard Meta Pixel E-Commerce Events
// ==========================================

export interface TrackProductParams {
  id: string;
  title: string;
  price: number;
  category?: string;
  tags?: string[];
}

/**
 * 1. ViewContent: When user views a product page or detail modal
 */
export const trackViewContent = (product: TrackProductParams) => {
  trackEvent('ViewContent', {
    content_name: product.title,
    content_category: product.category || (product.tags ? product.tags.join(', ') : 'Suits & Kurtis'),
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'INR',
  });
};

/**
 * 2. AddToCart: When user clicks "Buy Now" or adds product to shopping bag
 */
export const trackAddToCart = (product: TrackProductParams, quantity: number = 1) => {
  trackEvent('AddToCart', {
    content_name: product.title,
    content_category: product.category || (product.tags ? product.tags.join(', ') : 'Suits & Kurtis'),
    content_ids: [product.id],
    content_type: 'product',
    value: product.price * quantity,
    currency: 'INR',
    num_items: quantity,
  });
};

/**
 * 3. InitiateCheckout: When user enters checkout drawer / flow
 */
export const trackInitiateCheckout = (product: TrackProductParams, quantity: number = 1, totalAmount?: number) => {
  trackEvent('InitiateCheckout', {
    content_name: product.title,
    content_category: product.category || (product.tags ? product.tags.join(', ') : 'Suits & Kurtis'),
    content_ids: [product.id],
    content_type: 'product',
    value: totalAmount ?? (product.price * quantity),
    currency: 'INR',
    num_items: quantity,
  });
};

/**
 * 4. AddPaymentInfo: When customer submits form and initiates Razorpay gateway
 */
export const trackAddPaymentInfo = (product: TrackProductParams, totalAmount: number, quantity: number = 1) => {
  trackEvent('AddPaymentInfo', {
    content_name: product.title,
    content_category: product.category || (product.tags ? product.tags.join(', ') : 'Suits & Kurtis'),
    content_ids: [product.id],
    content_type: 'product',
    value: totalAmount,
    currency: 'INR',
    num_items: quantity,
  });
};

/**
 * 5. Purchase: When order payment is verified successfully
 */
export const trackPurchase = (params: {
  orderId: string;
  product: TrackProductParams;
  totalAmount: number;
  quantity: number;
}) => {
  trackEvent('Purchase', {
    content_name: params.product.title,
    content_category: params.product.category || (params.product.tags ? params.product.tags.join(', ') : 'Suits & Kurtis'),
    content_ids: [params.product.id],
    content_type: 'product',
    value: params.totalAmount,
    currency: 'INR',
    num_items: params.quantity,
    order_id: params.orderId,
  });
};

/**
 * 6. Contact: When customer clicks WhatsApp support button
 */
export const trackContact = (channel: string = 'WhatsApp Support', detail?: string) => {
  trackEvent('Contact', {
    content_name: channel,
    content_category: 'Customer Inquiry',
    value: detail,
  });
};

/**
 * 7. Search: When user selects product category or searches
 */
export const trackSearch = (query: string) => {
  trackEvent('Search', {
    search_string: query,
    content_category: 'Product Filter',
  });
};
