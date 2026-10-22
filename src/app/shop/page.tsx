import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShopClient } from '@/components/ShopClient';

export const metadata: Metadata = {
  title: 'Shop Suits, Kurtis & Jewellery | Saga Fabrics',
  description:
    'Browse every Saga Fabrics piece in one place: chikankari suits, silk & cotton kurtis, unstitched sets and anti-tarnish jewellery. Diwali prices, free shipping across India.',
  alternates: { canonical: 'https://sagafabrics.in/shop' },
  openGraph: {
    title: 'Shop Suits, Kurtis & Jewellery | Saga Fabrics',
    description: 'Chikankari suits, kurtis, unstitched sets and jewellery. Free shipping across India.',
    url: 'https://sagafabrics.in/shop',
    siteName: 'Saga Fabrics',
    type: 'website',
  },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F1]" />}>
      <ShopClient />
    </Suspense>
  );
}
