'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ArrowLeft, ArrowRight, ImagePlus, Loader2 } from 'lucide-react';
import { Product } from '@/types';
import {
  ALL_SIZES,
  CATEGORY_TAGS,
  OFFER_TAGS,
  ProductType,
  buildTagsAndSizes,
  productTypeOf,
} from '@/lib/productInput';

interface Props {
  product: Product | null;
  onClose: () => void;
  onSaved: (p: Product, isNew: boolean) => void;
}

interface FormState {
  title: string;
  subtitle: string;
  type: ProductType;
  sizes: string[];
  categories: string[];
  offers: string[];
  price: string;
  originalPrice: string;
  inStock: boolean;
  images: string[];
  description: string;
  fabric: string;
  craft: string;
  care: string;
  color: string;
  colorHex: string;
  rating: string;
  reviewsCount: string;
}

const SALE_TAGS = ['End of Season Sale', 'Season End Sale'];

const fromProduct = (p: Product | null): FormState => {
  if (!p) {
    return {
      title: '',
      subtitle: '',
      type: 'Stitched',
      sizes: ['M', 'L', 'XL', 'XXL'],
      categories: [],
      offers: ['New Arrival'],
      price: '',
      originalPrice: '',
      inStock: true,
      images: [],
      description: '',
      fabric: '',
      craft: '',
      care: 'Gentle hand wash in cold water',
      color: '',
      colorHex: '#7A1B38',
      rating: '5',
      reviewsCount: '0',
    };
  }
  const offers = OFFER_TAGS.map((o) => o.tag).filter((t) => p.tags.includes(t));
  if (p.tags.some((t) => SALE_TAGS.includes(t)) && !offers.includes('Special Offer')) offers.unshift('Special Offer');
  return {
    title: p.title,
    subtitle: p.subtitle,
    type: productTypeOf(p),
    sizes: (p.sizes || []).filter((s) => s !== 'Unstitched'),
    categories: CATEGORY_TAGS.filter((t) => p.tags.includes(t)),
    offers,
    price: String(p.price),
    originalPrice: String(p.originalPrice),
    inStock: p.inStock,
    images: p.images,
    description: p.description,
    fabric: p.fabric,
    craft: p.craft,
    care: p.care,
    color: p.color,
    colorHex: p.colorHex || '#7A1B38',
    rating: String(p.rating ?? 5),
    reviewsCount: String(p.reviewsCount ?? 0),
  };
};

// Shrinks phone photos (often 3–8 MB) to a ~1600px WebP/JPEG before upload.
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  const webp = await toBlob('image/webp');
  if (webp && webp.type === 'image/webp') return webp;
  const jpeg = await toBlob('image/jpeg');
  if (!jpeg) throw new Error('Could not read this photo');
  return jpeg;
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const inputCls =
  'w-full px-3 py-3 rounded-xl border border-[#E5DED6] bg-white text-[15px] focus:outline-none focus:border-[#7A1B38]';
const labelCls = 'block text-xs font-semibold text-[#5A524B] mb-1.5';

const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-2 rounded-full text-sm border cursor-pointer ${
      on ? 'bg-[#7A1B38] border-[#7A1B38] text-white' : 'bg-white border-[#E5DED6] text-[#2D2A26]'
    }`}
  >
    {children}
  </button>
);

export function ProductForm({ product, onClose, onSaved }: Props) {
  const [f, setF] = useState<FormState>(() => fromProduct(product));
  const [uploading, setUploading] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(!product);
  // Photos uploaded in this form session — deleted again if the form is cancelled.
  const freshUploads = useRef<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setF((s) => ({ ...s, [key]: value }));

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const deleteUploads = (urls: string[]) => {
    if (!urls.length) return;
    fetch('/api/admin/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    }).catch(() => {});
  };

  const cancel = () => {
    deleteUploads(freshUploads.current);
    onClose();
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setError('');
    const list = Array.from(files);
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const blob = await compressImage(file);
        const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
        const body = new FormData();
        body.append('file', new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.${ext}`, { type: blob.type }));
        const res = await fetch('/api/admin/images', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        freshUploads.current.push(data.url);
        setF((s) => ({ ...s, images: [...s.images, data.url] }));
      } catch (e) {
        setError(`${file.name}: ${e instanceof Error ? e.message : 'upload failed'}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (fileInput.current) fileInput.current.value = '';
  };

  const removePhoto = (url: string) => {
    set('images', f.images.filter((u) => u !== url));
    // A photo uploaded in this session can go right away; saved photos are deleted on Save.
    if (freshUploads.current.includes(url)) {
      freshUploads.current = freshUploads.current.filter((u) => u !== url);
      deleteUploads([url]);
    }
  };

  const movePhoto = (i: number, dir: -1 | 1) => {
    const imgs = [...f.images];
    const j = i + dir;
    if (j < 0 || j >= imgs.length) return;
    [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    set('images', imgs);
  };

  const price = Number(f.price);
  const mrp = Number(f.originalPrice);
  const off = price > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const save = async () => {
    setError('');
    if (!f.title.trim()) return setError('Product name is required');
    if (!(price > 0)) return setError('Enter the selling price');
    if (f.images.length === 0) return setError('Add at least one photo');
    if (f.type === 'Stitched' && f.sizes.length === 0) return setError('Pick at least one available size');

    const { tags, sizes } = buildTagsAndSizes(f.type, f.sizes, f.categories, f.offers, product?.tags);
    const body = {
      title: f.title,
      subtitle: f.subtitle,
      price,
      originalPrice: mrp > 0 ? mrp : price,
      description: f.description,
      fabric: f.fabric,
      craft: f.craft,
      care: f.care,
      color: f.color,
      colorHex: f.colorHex,
      images: f.images,
      sizes,
      tags,
      inStock: f.inStock,
      rating: Number(f.rating),
      reviewsCount: Number(f.reviewsCount),
    };

    setSaving(true);
    try {
      const res = await fetch(product ? `/api/admin/products/${product.id}` : '/api/admin/products', {
        method: product ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save');
      freshUploads.current = [];
      onSaved(data.product, !product);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-[#FDFBF7] w-full sm:max-w-2xl sm:rounded-2xl sm:max-h-[92vh] flex flex-col h-full sm:h-auto">
        <header className="flex items-center justify-between px-4 py-3.5 border-b border-[#EDE7E1] bg-white sm:rounded-t-2xl">
          <h3 className="font-serif text-xl text-[#2D2A26]">{product ? 'Edit product' : 'Add product'}</h3>
          <button type="button" onClick={cancel} aria-label="Close" className="p-1.5 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Photos */}
          <section>
            <p className={labelCls}>Photos · the first one is the main photo</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {f.images.map((url, i) => (
                <div key={url} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#F3ECE2] border border-[#EDE7E1]">
                  <Image src={url} alt="" fill sizes="160px" unoptimized className="object-cover object-top" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-[#7A1B38] text-white">Main</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-1 inset-x-1 flex justify-between">
                    <button
                      type="button"
                      onClick={() => movePhoto(i, -1)}
                      disabled={i === 0}
                      aria-label="Move photo left"
                      className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-0 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(i, 1)}
                      disabled={i === f.images.length - 1}
                      aria-label="Move photo right"
                      className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-0 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="aspect-[3/4] rounded-lg border-2 border-dashed border-[#D8CBBC] flex flex-col items-center justify-center gap-1 text-[#7A1B38] text-xs font-medium cursor-pointer"
              >
                {uploading > 0 ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
                {uploading > 0 ? `Uploading ${uploading}…` : 'Add photos'}
              </button>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={(e) => addPhotos(e.target.files)}
            />
          </section>

          <section className="space-y-4">
            <div>
              <label className={labelCls} htmlFor="pf-title">Product name</label>
              <input id="pf-title" className={inputCls} value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Hand Embroidered White & Pink Chikankari Short Kurti" />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-subtitle">Short line under the name</label>
              <input id="pf-subtitle" className={inputCls} value={f.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="e.g. Pure cotton stitched kurti • Free jhumkas included" />
            </div>
          </section>

          {/* Type & sizes */}
          <section>
            <p className={labelCls}>Type</p>
            <div className="grid grid-cols-3 gap-2">
              {(['Stitched', 'Unstitched', 'Jewellery'] as ProductType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('type', t)}
                  className={`py-3 rounded-xl border text-sm font-semibold cursor-pointer ${
                    f.type === t ? 'bg-[#2D2A26] border-[#2D2A26] text-white' : 'bg-white border-[#E5DED6]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {f.type === 'Stitched' ? (
              <div className="mt-4">
                <p className={labelCls}>Sizes available (selected = in stock)</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => (
                    <Chip key={s} on={f.sizes.includes(s)} onClick={() => set('sizes', toggle(f.sizes, s))}>
                      {s}
                    </Chip>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-[#78716C]">
                {f.type === 'Unstitched' ? 'Unstitched sets have no size — the customer gets it tailored.' : 'Jewellery is free size.'}
              </p>
            )}
          </section>

          {/* Price */}
          <section className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} htmlFor="pf-price">Selling price (₹)</label>
              <input id="pf-price" className={inputCls} inputMode="numeric" value={f.price} onChange={(e) => set('price', e.target.value.replace(/[^\d]/g, ''))} placeholder="1500" />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-mrp">MRP / original (₹)</label>
              <input id="pf-mrp" className={inputCls} inputMode="numeric" value={f.originalPrice} onChange={(e) => set('originalPrice', e.target.value.replace(/[^\d]/g, ''))} placeholder="2499" />
            </div>
            {off > 0 && <p className="col-span-2 text-xs text-emerald-700 -mt-1">Shows as {off}% off</p>}
          </section>

          {/* Category & offers */}
          <section>
            <p className={labelCls}>Category (pick all that fit)</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_TAGS.map((c) => (
                <Chip key={c} on={f.categories.includes(c)} onClick={() => set('categories', toggle(f.categories, c))}>
                  {c}
                </Chip>
              ))}
            </div>
          </section>
          <section>
            <p className={labelCls}>Offers & badges</p>
            <div className="flex flex-wrap gap-2">
              {OFFER_TAGS.map((o) => (
                <Chip key={o.tag} on={f.offers.includes(o.tag)} onClick={() => set('offers', toggle(f.offers, o.tag))}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </section>

          {/* Stock */}
          <section>
            <label className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white border border-[#E5DED6] cursor-pointer">
              <span>
                <span className="block text-sm font-semibold">In stock</span>
                <span className="block text-xs text-[#78716C]">Off = hidden from the website, kept here for later</span>
              </span>
              <input type="checkbox" checked={f.inStock} onChange={(e) => set('inStock', e.target.checked)} className="w-6 h-6 accent-emerald-600" />
            </label>
          </section>

          {/* Details */}
          <section>
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="text-sm font-semibold text-[#7A1B38] underline underline-offset-2 cursor-pointer"
            >
              {showDetails ? 'Hide' : 'Show'} description, fabric & care
            </button>
            {showDetails && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className={labelCls} htmlFor="pf-desc">Description</label>
                  <textarea id="pf-desc" rows={5} className={inputCls} value={f.description} onChange={(e) => set('description', e.target.value)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} htmlFor="pf-fabric">Fabric</label>
                    <input id="pf-fabric" className={inputCls} value={f.fabric} onChange={(e) => set('fabric', e.target.value)} placeholder="100% pure cotton" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="pf-craft">Work / craft</label>
                    <input id="pf-craft" className={inputCls} value={f.craft} onChange={(e) => set('craft', e.target.value)} placeholder="Hand embroidered chikankari" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="pf-care">Care</label>
                    <input id="pf-care" className={inputCls} value={f.care} onChange={(e) => set('care', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="pf-color">Colour name</label>
                    <div className="flex gap-2">
                      <input id="pf-color" className={inputCls} value={f.color} onChange={(e) => set('color', e.target.value)} placeholder="White & Royal Blue" />
                      <input
                        type="color"
                        aria-label="Colour swatch"
                        value={f.colorHex}
                        onChange={(e) => set('colorHex', e.target.value)}
                        className="w-12 h-[50px] rounded-xl border border-[#E5DED6] bg-white shrink-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="pf-rating">Rating shown (0–5)</label>
                    <input id="pf-rating" className={inputCls} inputMode="decimal" value={f.rating} onChange={(e) => set('rating', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="pf-reviews">Number of reviews</label>
                    <input id="pf-reviews" className={inputCls} inputMode="numeric" value={f.reviewsCount} onChange={(e) => set('reviewsCount', e.target.value.replace(/[^\d]/g, ''))} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <footer className="border-t border-[#EDE7E1] bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:rounded-b-2xl">
          {error && <p className="text-sm text-rose-700 mb-2">{error}</p>}
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <button type="button" onClick={cancel} className="px-5 py-3.5 rounded-xl border border-[#2D2A26] text-sm font-medium cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || uploading > 0}
              className="py-3.5 rounded-xl bg-[#7A1B38] text-white text-sm font-semibold disabled:opacity-60 cursor-pointer"
            >
              {saving ? 'Saving…' : uploading > 0 ? 'Wait for photos…' : product ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
