import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShopClient } from '@/components/ShopClient';

export const metadata: Metadata = {
  title: 'Shop Suits, Kurtis & Jewellery | Saga Fabrics',
  description:
    'Shop hand-embroidered chikankari suits, velvet suit sets, silk kurtis, unstitched sets and anti-tarnish jewellery from Jaipur. Free shipping across India.',
  alternates: { canonical: 'https://sagafabrics.in/shop' },
  openGraph: {
    title: 'Shop Suits, Kurtis & Jewellery | Saga Fabrics',
    description: 'Chikankari suits, velvet suit sets, kurtis, unstitched sets and jewellery. Free shipping across India.',
    url: 'https://sagafabrics.in/shop',
    siteName: 'Saga Fabrics',
    type: 'website',
  },
};

// Reading searchParams makes this page render on the server for each request, so the
// heading, text and product grid are in the HTML that search engines see.
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await searchParams;
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F1]" />}>
      <ShopClient />
    </Suspense>
  );
}
