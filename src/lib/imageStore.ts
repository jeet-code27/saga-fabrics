// Server-only: product photos uploaded from /admin are stored in MongoDB (GridFS),
// because the public/ folder is read-only once the site is deployed.
import { GridFSBucket, ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

const BUCKET = 'productImages';
export const UPLOADED_PREFIX = '/api/images/';

const bucket = async () => new GridFSBucket(await getDb(), { bucketName: BUCKET });

export async function saveImage(data: Buffer, contentType: string, filename: string): Promise<string> {
  const b = await bucket();
  const id = await new Promise<ObjectId>((resolve, reject) => {
    const stream = b.openUploadStream(filename, { metadata: { contentType } });
    stream.once('error', reject);
    stream.once('finish', () => resolve(stream.id as ObjectId));
    stream.end(data);
  });
  return `${UPLOADED_PREFIX}${id.toHexString()}`;
}

export async function readImage(id: string): Promise<{ data: Buffer; contentType: string } | null> {
  if (!ObjectId.isValid(id)) return null;
  const b = await bucket();
  const _id = new ObjectId(id);
  const file = await b.find({ _id }).next();
  if (!file) return null;
  const chunks: Buffer[] = [];
  for await (const chunk of b.openDownloadStream(_id)) chunks.push(chunk as Buffer);
  return {
    data: Buffer.concat(chunks),
    contentType: (file.metadata?.contentType as string) || 'image/webp',
  };
}

/** Deletes uploaded images. Paths under /public can't be removed on the live server, so they are only unlinked. */
export async function deleteImages(urls: string[]): Promise<void> {
  const b = await bucket();
  for (const url of urls) {
    if (!url.startsWith(UPLOADED_PREFIX)) continue;
    const id = url.slice(UPLOADED_PREFIX.length);
    if (!ObjectId.isValid(id)) continue;
    try {
      await b.delete(new ObjectId(id));
    } catch (err) {
      console.warn(`[images] Could not delete ${url}:`, err);
    }
  }
}
