import fs from 'fs';
import path from 'path';
import { Order, OrderStatus } from '@/types';
import { getDb } from '@/lib/mongodb';

const DATA_DIR = path.join(process.cwd(), '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Local fallback / file helpers
function ensureLocalDbExists(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Could not initialize local backup directory:', err);
  }
}

function getLocalOrders(): Order[] {
  ensureLocalDbExists();
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local orders file:', err);
  }
  return [];
}

function saveLocalOrders(orders: Order[]): void {
  ensureLocalDbExists();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local orders backup:', err);
  }
}

// Flag to track initial migration from local file to MongoDB
let isMigrated = false;

async function syncLocalToMongo(): Promise<void> {
  if (isMigrated) return;
  try {
    const db = await getDb();
    const ordersCollection = db.collection<Order>('orders');
    const count = await ordersCollection.countDocuments();

    if (count === 0) {
      const localOrders = getLocalOrders();
      if (localOrders.length > 0) {
        console.log(`[MongoDB Migration] Seeding ${localOrders.length} existing orders to MongoDB Atlas...`);
        // Insert without MongoDB _id conflict
        await ordersCollection.insertMany(localOrders.map((o) => ({ ...o })));
        console.log('[MongoDB Migration] Existing orders successfully synced to MongoDB Atlas!');
      }
    }
    isMigrated = true;
  } catch (err) {
    console.warn('[MongoDB Migration] Could not auto-sync local orders to MongoDB:', err);
  }
}

// 1. GET ALL ORDERS
export async function getOrders(): Promise<Order[]> {
  try {
    await syncLocalToMongo();
    const db = await getDb();
    const mongoOrders = await db
      .collection<Order>('orders')
      .find({})
      .sort({ createdAt: -1 })
      .project<Order>({ _id: 0 })
      .toArray();

    // Keep local backup synchronized
    if (mongoOrders.length > 0) {
      saveLocalOrders(mongoOrders);
    }
    return mongoOrders;
  } catch (error) {
    console.error('[MongoDB Error] Fetching orders failed, falling back to local storage:', error);
    return getLocalOrders();
  }
}

// 2. GET ORDER BY ID
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const db = await getDb();
    const order = await db
      .collection<Order>('orders')
      .findOne({ id }, { projection: { _id: 0 } });

    if (order) return order;
  } catch (error) {
    console.error('[MongoDB Error] getOrderById failed, checking local backup:', error);
  }

  // Fallback to local
  const localOrders = getLocalOrders();
  return localOrders.find((o) => o.id === id) || null;
}

// 3. SAVE NEW ORDER
export async function saveOrder(
  orderData: Omit<Order, 'id' | 'createdAt'> & { id?: string }
): Promise<Order> {
  const newOrder: Order = {
    id:
      orderData.id ||
      `SAGA-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`,
    razorpayOrderId: orderData.razorpayOrderId,
    razorpayPaymentId: orderData.razorpayPaymentId,
    customer: orderData.customer,
    items: orderData.items,
    totalAmount: orderData.totalAmount,
    status: orderData.status || 'Processing',
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await getDb();
    await db.collection<Order>('orders').insertOne({ ...newOrder });
    console.log(`[MongoDB Success] Order ${newOrder.id} saved to MongoDB Atlas!`);
  } catch (error) {
    console.error('[MongoDB Error] Failed to save order in MongoDB Atlas:', error);
  }

  // Also save to local backup
  const localOrders = getLocalOrders();
  localOrders.unshift(newOrder);
  saveLocalOrders(localOrders);

  return newOrder;
}

// 4. UPDATE ORDER STATUS
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  try {
    const db = await getDb();
    const result = await db
      .collection<Order>('orders')
      .findOneAndUpdate(
        { id },
        { $set: { status } },
        { returnDocument: 'after', projection: { _id: 0 } }
      );

    if (result) {
      // Sync local backup
      const localOrders = getLocalOrders();
      const idx = localOrders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        localOrders[idx].status = status;
        saveLocalOrders(localOrders);
      }
      return result;
    }
  } catch (error) {
    console.error('[MongoDB Error] updateOrderStatus failed:', error);
  }

  // Fallback update on local
  const localOrders = getLocalOrders();
  const index = localOrders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  localOrders[index].status = status;
  saveLocalOrders(localOrders);
  return localOrders[index];
}

// 5. DELETE ORDER
export async function deleteOrder(id: string): Promise<boolean> {
  let deletedFromMongo = false;
  try {
    const db = await getDb();
    const result = await db.collection<Order>('orders').deleteOne({ id });
    deletedFromMongo = result.deletedCount > 0;
  } catch (error) {
    console.error('[MongoDB Error] deleteOrder failed in MongoDB:', error);
  }

  // Sync local backup
  const localOrders = getLocalOrders();
  const filtered = localOrders.filter((o) => o.id !== id);
  const deletedFromLocal = filtered.length !== localOrders.length;
  if (deletedFromLocal) {
    saveLocalOrders(filtered);
  }

  return deletedFromMongo || deletedFromLocal;
}
