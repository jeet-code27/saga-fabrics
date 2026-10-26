// Server-only: imported by route handlers and server components, never by client components.
import { unstable_cache } from 'next/cache';
import { Product } from '@/types';
import { PRODUCTS } from '@/lib/products';
import { getDb } from '@/lib/mongodb';

// Products live in MongoDB so they can be managed from /admin.
// The first time the collection is empty it is seeded from src/lib/products.ts,
// and if the database is unreachable the site falls back to that same list.

export const PRODUCTS_TAG = 'products';

type ProductDoc = Product & { sortOrder: number; createdAt: string; updatedAt: string };

const collection = async () => (await getDb()).collection<ProductDoc>('products');

let seeded = false;

async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  const col = await collection();
  if ((await col.estimatedDocumentCount()) === 0) {
    const now = new Date().toISOString();
    await col.insertMany(
      PRODUCTS.map((p, i) => ({ ...p, sortOrder: i, createdAt: now, updatedAt: now }))
    );
    await col.createIndex({ id: 1 }, { unique: true });
    console.log(`[products] Seeded ${PRODUCTS.length} products into MongoDB`);
  }
  seeded = true;
}

const strip = ({ sortOrder: _s, createdAt: _c, updatedAt: _u, ...p }: ProductDoc): Product => p;

// Every product, in display order, including out-of-stock ones (admin + product pages).
export async function getAllProductsFresh(): Promise<Product[]> {
  await ensureSeeded();
  const docs = await (await collection())
    .find({}, { projection: { _id: 0 } })
    .sort({ sortOrder: 1 })
    .toArray();
  return docs.map(strip);
}

const cachedAll = unstable_cache(
  async () => {
    try {
      return await getAllProductsFresh();
    } catch (err) {
      console.error('[products] MongoDB read failed, using built-in product list:', err);
      return PRODUCTS;
    }
  },
  ['all-products-v2'],
  { tags: [PRODUCTS_TAG] }
);

/** All products incl. sold out — cached, for product pages. */
export const getAllProducts = (): Promise<Product[]> => cachedAll();

/** Only in-stock products — what the storefront lists. */
export async function getStoreProducts(): Promise<Product[]> {
  return (await cachedAll()).filter((p) => p.inStock);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return (await cachedAll()).find((p) => p.id === id);
}

// ---- Admin writes -------------------------------------------------------

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  await ensureSeeded();
  const col = await collection();
  // Next id in the existing saga-0NN series.
  const ids = await col.find({}, { projection: { id: 1 } }).toArray();
  const max = ids.reduce((m, d) => Math.max(m, Number(/^saga-(\d+)$/.exec(d.id)?.[1] ?? 0)), 0);
  const id = `saga-${String(max + 1).padStart(3, '0')}`;
  // New products go to the top of the list.
  await col.updateMany({}, { $inc: { sortOrder: 1 } });
  const now = new Date().toISOString();
  const doc: ProductDoc = { ...data, id, sortOrder: 0, createdAt: now, updatedAt: now };
  await col.insertOne(doc);
  return strip(doc);
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | null> {
  await ensureSeeded();
  const { id: _ignored, ...rest } = patch;
  const res = await (await collection()).findOneAndUpdate(
    { id },
    { $set: { ...rest, updatedAt: new Date().toISOString() } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return res ? strip(res) : null;
}

export async function deleteProduct(id: string): Promise<Product | null> {
  await ensureSeeded();
  const res = await (await collection()).findOneAndDelete({ id }, { projection: { _id: 0 } });
  return res ? strip(res) : null;
}

export async function reorderProducts(ids: string[]): Promise<void> {
  await ensureSeeded();
  const col = await collection();
  await col.bulkWrite(ids.map((id, i) => ({ updateOne: { filter: { id }, update: { $set: { sortOrder: i } } } })));
}
