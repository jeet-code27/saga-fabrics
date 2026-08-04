import fs from 'fs';
import path from 'path';
import { Order, OrderStatus } from '@/types';

const DATA_DIR = path.join(process.cwd(), '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and orders file exist
function ensureDbExists(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    // Populate initial sample order so Admin Panel has demo data right away
    const sampleOrders: Order[] = [
      {
        id: 'SAGA-ORD-9821',
        razorpayOrderId: 'order_Nx829410A',
        razorpayPaymentId: 'pay_Nx829555B',
        customer: {
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91 98765 43210',
          address: '42, Royal Residency, C-Scheme',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302001',
          notes: 'Please dispatch via BlueDart express courier',
        },
        items: [
          {
            productId: 'saga-001',
            productTitle: 'Gulabi Baugh Powder Blue Chikankari Kurti Set',
            image: '/images/products/powder-blue-kurti.jpg',
            size: 'M',
            price: 2299,
            quantity: 1,
          },
        ],
        totalAmount: 2299,
        status: 'Processing',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'SAGA-ORD-9822',
        razorpayOrderId: 'order_Nx992211C',
        razorpayPaymentId: 'pay_Nx992288D',
        customer: {
          name: 'Ananya Verma',
          email: 'ananya.v@example.com',
          phone: '+91 98112 33445',
          address: 'B-104, Malviya Nagar',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302017',
        },
        items: [
          {
            productId: 'saga-003',
            productTitle: 'Rani Pink Royalty Kurti & Dupatta Set',
            image: '/images/products/rani-pink-kurti.jpg',
            size: 'L',
            price: 2699,
            quantity: 1,
          },
        ],
        totalAmount: 2699,
        status: 'Delivered',
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      },
    ];

    fs.writeFileSync(ORDERS_FILE, JSON.stringify(sampleOrders, null, 2), 'utf-8');
  }
}

export async function getOrders(): Promise<Order[]> {
  ensureDbExists();
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders file:', error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) || null;
}

export async function saveOrder(orderData: Omit<Order, 'id' | 'createdAt'> & { id?: string }): Promise<Order> {
  ensureDbExists();
  const orders = await getOrders();
  
  const newOrder: Order = {
    id: orderData.id || `SAGA-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    razorpayOrderId: orderData.razorpayOrderId,
    razorpayPaymentId: orderData.razorpayPaymentId,
    customer: orderData.customer,
    items: orderData.items,
    totalAmount: orderData.totalAmount,
    status: orderData.status || 'Pending',
    createdAt: new Date().toISOString(),
  };

  // Add at top of list
  orders.unshift(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return newOrder;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  ensureDbExists();
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) return null;

  orders[index].status = status;
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return orders[index];
}

export async function deleteOrder(id: string): Promise<boolean> {
  ensureDbExists();
  const orders = await getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;

  fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
