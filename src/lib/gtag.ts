export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-DWH0GR71YF';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Send standard GA4 event
 */
export const gaEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track PageView on route change (SPA navigation in Next.js)
 */
export const gaPageView = (url: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// ==========================================
// GA4 Enhanced E-Commerce User Journey Events
// ==========================================

export interface GAProductParams {
  id: string;
  title: string;
  price: number;
  category?: string;
  tags?: string[];
  size?: string;
}

/**
 * 1. view_item: When customer views a product page or detail modal
 */
export const trackGAViewItem = (product: GAProductParams) => {
  const price = parseFloat(Number(product.price).toFixed(2));
  gaEvent('view_item', {
    currency: 'INR',
    value: price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category || (product.tags ? product.tags.join(', ') : 'Suits & Kurtis'),
        item_variant: product.size || 'Unstitched',
        price: price,
        quantity: 1,
      },
    ],
  });
};

/**
 * 2. add_to_cart: When customer clicks "Buy Now" or opens checkout for a product
 */
export const trackGAAddToCart = (
  product: GAProductParams,
  quantity: number = 1,
  size?: string
) => {
  const itemPrice = parseFloat(Number(product.price).toFixed(2));
  const totalVal = parseFloat(Number(product.price * quantity).toFixed(2));
  gaEvent('add_to_cart', {
    currency: 'INR',
    value: totalVal,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category || (product.tags ? product.tags.join(', ') : 'Suits & Kurtis'),
        item_variant: size || product.size || 'Unstitched',
        price: itemPrice,
        quantity: quantity,
      },
    ],
  });
};

/**
 * 3. begin_checkout: When customer enters the checkout drawer
 */
export const trackGABeginCheckout = (
  product: GAProductParams,
  quantity: number = 1,
  size?: string,
  totalAmount?: number
) => {
  const itemPrice = parseFloat(Number(product.price).toFixed(2));
  const totalVal = parseFloat(Number(totalAmount ?? (product.price * quantity)).toFixed(2));
  gaEvent('begin_checkout', {
    currency: 'INR',
    value: totalVal,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category || (product.tags ? product.tags.join(', ') : 'Suits & Kurtis'),
        item_variant: size || product.size || 'Unstitched',
        price: itemPrice,
        quantity: quantity,
      },
    ],
  });
};

/**
 * 4. add_payment_info: When customer submits shipping details and launches Razorpay gateway
 */
export const trackGAAddPaymentInfo = (
  product: GAProductParams,
  totalAmount: number,
  quantity: number = 1,
  size?: string
) => {
  const itemPrice = parseFloat(Number(product.price).toFixed(2));
  const totalVal = parseFloat(Number(totalAmount).toFixed(2));
  gaEvent('add_payment_info', {
    currency: 'INR',
    value: totalVal,
    payment_type: 'Razorpay Online',
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category || (product.tags ? product.tags.join(', ') : 'Suits & Kurtis'),
        item_variant: size || product.size || 'Unstitched',
        price: itemPrice,
        quantity: quantity,
      },
    ],
  });
};

/**
 * 5. purchase: When payment is verified and order is finalized
 */
export const trackGAPurchase = (params: {
  orderId: string;
  product: GAProductParams;
  totalAmount: number;
  quantity: number;
  size?: string;
}) => {
  const cleanTotal = parseFloat(Number(params.totalAmount).toFixed(2));
  const cleanItemPrice = parseFloat(Number(params.product.price).toFixed(2));

  gaEvent('purchase', {
    transaction_id: params.orderId,
    value: cleanTotal,
    currency: 'INR',
    tax: 0,
    shipping: 0,
    items: [
      {
        item_id: params.product.id,
        item_name: params.product.title,
        item_category: params.product.category || (params.product.tags ? params.product.tags.join(', ') : 'Suits & Kurtis'),
        item_variant: params.size || params.product.size || 'Unstitched',
        price: cleanItemPrice,
        quantity: params.quantity,
      },
    ],
  });
};

/**
 * 6. Contact / Lead: When customer taps WhatsApp or calls
 */
export const trackGAContact = (channel: string = 'WhatsApp Support') => {
  gaEvent('generate_lead', {
    currency: 'INR',
    value: 0,
    contact_method: channel,
  });
};

/**
 * 7. search: When customer searches or filters products
 */
export const trackGASearch = (searchTerm: string) => {
  gaEvent('search', {
    search_term: searchTerm,
  });
};
