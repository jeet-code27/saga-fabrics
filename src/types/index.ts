export type Size = 'Unstitched' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | string;

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  description: string;
  fabric: string;
  craft: string;
  care: string;
  color: string;
  colorHex: string;
  images: string[];
  sizes?: Size[];
  tags: string[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  image: string;
  size: Size;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}
