'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ExternalLink,
  RefreshCw,
  X,
} from 'lucide-react';
import { Product } from '@/types';
import { ALL_SIZES, productTypeOf } from '@/lib/productInput';
import { ProductForm } from '@/components/admin/ProductForm';

type Filter = 'all' | 'in' | 'out';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  const notify = (text: string, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load products');
      setProducts(data.products);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const patch = async (p: Product, body: Partial<Product>, message: string) => {
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts((list) => list.map((x) => (x.id === p.id ? data.product : x)));
      notify(message);
    } catch (e) {
      notify(e instanceof Error && e.message ? e.message : 'Could not save', false);
    } finally {
      setBusyId(null);
    }
  };

  const toggleSize = (p: Product, size: string) => {
    const has = p.sizes?.includes(size);
    const sizes = has ? (p.sizes || []).filter((s) => s !== size) : [...(p.sizes || []), size];
    if (sizes.length === 0) {
      notify('At least one size must stay available — mark the product out of stock instead', false);
      return;
    }
    const ordered = ALL_SIZES.filter((s) => sizes.includes(s));
    patch(p, { sizes: ordered }, `${size} ${has ? 'marked sold out' : 'available again'}`);
  };

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.title}" permanently?\n\nIt will disappear from the website. Photos uploaded from this panel are deleted too.`)) return;
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts((list) => list.filter((x) => x.id !== p.id));
      notify('Product deleted');
    } catch (e) {
      notify(e instanceof Error && e.message ? e.message : 'Could not delete', false);
    } finally {
      setBusyId(null);
    }
  };

  const move = async (p: Product, to: 'up' | 'down' | 'top') => {
    const i = products.findIndex((x) => x.id === p.id);
    const next = [...products];
    next.splice(i, 1);
    const j = to === 'top' ? 0 : to === 'up' ? Math.max(0, i - 1) : Math.min(products.length - 1, i + 1);
    next.splice(j, 0, p);
    const previous = products;
    setProducts(next);
    try {
      const res = await fetch('/api/admin/products/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: next.map((x) => x.id) }),
      });
      if (!res.ok) throw new Error();
      if (to === 'top') notify('Moved to the top of the shop');
    } catch {
      setProducts(previous);
      notify('Could not change the order', false);
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (filter === 'all' || (filter === 'in' ? p.inStock : !p.inStock)) &&
        (!q || `${p.title} ${p.id} ${p.color}`.toLowerCase().includes(q))
    );
  }, [products, query, filter]);

  const canReorder = filter === 'all' && !query.trim();
  const counts = { all: products.length, in: products.filter((p) => p.inStock).length, out: products.filter((p) => !p.inStock).length };

  return (
    <main className="max-w-5xl mx-auto w-full px-3 sm:px-6 py-5 sm:py-8 pb-28">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-serif text-[#2D2A26]">Products</h2>
          <p className="text-xs text-[#78716C]">Changes show on the website within a few seconds.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            aria-label="Reload products"
            className="p-2.5 rounded-full border border-[#EDE7E1] bg-white cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#7A1B38] text-white text-sm font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add product
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
        {([
          ['all', 'All'],
          ['in', 'In stock'],
          ['out', 'Out of stock'],
        ] as [Filter, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm border cursor-pointer ${
              filter === key ? 'bg-[#2D2A26] border-[#2D2A26] text-white' : 'bg-white border-[#EDE7E1]'
            }`}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      <label className="relative block mb-4">
        <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or colour"
          className="w-full pl-9 pr-3 py-3 rounded-xl border border-[#EDE7E1] bg-white text-sm focus:outline-none focus:border-[#7A1B38]"
        />
      </label>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800 mb-4">
          {error}
        </div>
      )}

      {loading && products.length === 0 ? (
        <p className="text-sm text-[#78716C] py-10 text-center">Loading products…</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((p) => {
            const type = productTypeOf(p);
            const busy = busyId === p.id;
            const index = products.findIndex((x) => x.id === p.id);
            return (
              <li
                key={p.id}
                className={`bg-white rounded-2xl border border-[#EDE7E1] p-3 ${busy ? 'opacity-60' : ''} ${
                  p.inStock ? '' : 'bg-[#FAF8F5]'
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative w-20 h-[106px] shrink-0 rounded-lg overflow-hidden bg-[#F3ECE2]">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt="" fill sizes="80px" unoptimized className="object-cover object-top" />
                    )}
                    {!p.inStock && (
                      <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[10px] text-center py-0.5">
                        Out of stock
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-[#78716C]">
                      {type} · {p.id}
                    </p>
                    <p className="text-sm font-semibold text-[#2D2A26] leading-snug line-clamp-2">{p.title}</p>
                    <p className="text-sm mt-0.5">
                      <span className="font-semibold">{inr(p.price)}</span>
                      {p.originalPrice > p.price && (
                        <span className="ml-1.5 text-xs text-[#78716C] line-through">{inr(p.originalPrice)}</span>
                      )}
                    </p>

                    {/* Stock switch */}
                    <label className="mt-2 inline-flex items-center gap-2 cursor-pointer select-none">
                      <span
                        className={`relative w-10 h-6 rounded-full transition-colors ${p.inStock ? 'bg-emerald-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                            p.inStock ? 'left-[18px]' : 'left-0.5'
                          }`}
                        />
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={p.inStock}
                        disabled={busy}
                        onChange={() =>
                          patch(
                            p,
                            { inStock: !p.inStock },
                            p.inStock ? 'Hidden from the website (out of stock)' : 'Back on the website'
                          )
                        }
                      />
                      <span className={`text-xs font-medium ${p.inStock ? 'text-emerald-700' : 'text-[#78716C]'}`}>
                        {p.inStock ? 'In stock · on website' : 'Out of stock · hidden'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Size availability (tap to mark a size sold out) */}
                {type === 'Stitched' && (
                  <div className="mt-3">
                    <p className="text-[11px] text-[#78716C] mb-1.5">Sizes available — tap to switch</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_SIZES.map((s) => {
                        const on = p.sizes?.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={busy}
                            onClick={() => toggleSize(p, s)}
                            className={`min-w-10 px-2 py-1.5 rounded-md text-xs border cursor-pointer ${
                              on
                                ? 'bg-[#2D2A26] border-[#2D2A26] text-white'
                                : 'bg-white border-[#E5DED6] text-[#B5ACA3] line-through'
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-[#F3EEE8] flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setEditing(p)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#7A1B38] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  {canReorder && (
                    <>
                      <button
                        type="button"
                        onClick={() => move(p, 'top')}
                        disabled={index === 0}
                        aria-label="Move to top"
                        className="p-2 rounded-lg border border-[#EDE7E1] disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronsUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(p, 'up')}
                        disabled={index === 0}
                        aria-label="Move up"
                        className="p-2 rounded-lg border border-[#EDE7E1] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(p, 'down')}
                        disabled={index === products.length - 1}
                        aria-label="Move down"
                        className="p-2 rounded-lg border border-[#EDE7E1] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <a
                    href={`/products/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on website"
                    className="p-2 rounded-lg border border-[#EDE7E1]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(p)}
                    aria-label="Delete product"
                    className="ml-auto p-2 rounded-lg border border-rose-200 text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
          {!loading && visible.length === 0 && (
            <li className="text-sm text-[#78716C] text-center py-10">No products match.</li>
          )}
        </ul>
      )}

      {!canReorder && products.length > 0 && (
        <p className="mt-4 text-xs text-[#78716C] text-center">Clear search and pick “All” to change the order.</p>
      )}

      {/* Floating add button for phones */}
      <button
        type="button"
        onClick={() => setEditing('new')}
        className="sm:hidden fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#7A1B38] text-white text-sm font-semibold shadow-xl cursor-pointer"
      >
        <Plus className="w-5 h-5" /> Add product
      </button>

      {editing && (
        <ProductForm
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(saved, isNew) => {
            setProducts((list) => (isNew ? [saved, ...list] : list.map((x) => (x.id === saved.id ? saved : x))));
            setEditing(null);
            notify(isNew ? 'Product added to the top of the shop' : 'Product updated');
          }}
        />
      )}

      {toast && (
        <div
          role="status"
          className={`fixed z-[70] bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 max-w-[92vw] px-4 py-3 rounded-xl text-sm shadow-xl flex items-center gap-3 ${
            toast.ok ? 'bg-[#2D2A26] text-white' : 'bg-rose-700 text-white'
          }`}
        >
          {toast.text}
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </main>
  );
}
