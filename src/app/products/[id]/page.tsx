import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/products';
import { Product } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductDetailClient } from '@/components/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Product Not Found | Saga Fabrics',
      description: 'The requested handcrafted artisanal suit or kurti could not be found.',
    };
  }

  const primaryImage = product.images[0].startsWith('http')
    ? product.images[0]
    : `https://sagafabrics.in${product.images[0]}`;

  const descText = `${product.subtitle}. Handcrafted pure cotton. Free express delivery in India.`;
  const cleanDescription = descText.length > 160 ? descText.slice(0, 157) + '...' : descText;

  return {
    title: `${product.title} | Saga Fabrics`,
    description: cleanDescription,
    keywords: [
      product.title,
      product.fabric,
      product.craft,
      product.color,
      'Saga Fabrics',
      'pure cotton kurti',
      'stitched suit set',
      'unstitched suits',
      'Jaipur ethnic wear',
      'Lucknowi Chikankari',
    ],
    openGraph: {
      title: `${product.title} | Saga Fabrics`,
      description: cleanDescription,
      url: `https://sagafabrics.in/products/${product.id}`,
      siteName: 'Saga Fabrics',
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 1067,
          alt: product.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | Saga Fabrics`,
      description: cleanDescription,
      images: [primaryImage],
    },
    alternates: {
      canonical: `https://sagafabrics.in/products/${product.id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Related products from similar craft or tag
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.craft === product.craft || p.tags.some((t) => product.tags.includes(t)))
  ).slice(0, 4);

  // Fallback if not enough related
  if (relatedProducts.length < 4) {
    const additional = PRODUCTS.filter(
      (p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id)
    ).slice(0, 4 - relatedProducts.length);
    relatedProducts.push(...additional);
  }

  const primaryImage = product.images[0].startsWith('http')
    ? product.images[0]
    : `https://sagafabrics.in${product.images[0]}`;

  // Structured Data Schema for Google Product Rich Results
  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((img) =>
      img.startsWith('http') ? img : `https://sagafabrics.in${img}`
    ),
    description: product.description,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Saga Fabrics',
    },
    offers: {
      '@type': 'Offer',
      url: `https://sagafabrics.in/products/${product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Saga Fabrics',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723] selection:bg-[#7A1B38] selection:text-white">
      {/* Product JSON-LD Rich Snippet for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Header Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 w-full">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
