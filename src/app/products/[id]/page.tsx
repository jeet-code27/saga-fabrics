import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts, getProductById, getStoreProducts } from '@/lib/productStore';
import { Product } from '@/types';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { productKind, isJewellery } from '@/lib/catalog';
import { isSaleProduct } from '@/lib/sale';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return (await getAllProducts()).map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

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
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Suggestions: same kind of piece first (kurti → kurtis), then shared craft and tags.
  const others = (await getStoreProducts()).filter((p) => p.id !== product.id);
  const kind = productKind(product);
  const score = (p: Product) =>
    (productKind(p) === kind ? 10 : 0) +
    (isJewellery(p) === isJewellery(product) ? 4 : 0) +
    (p.craft === product.craft ? 2 : 0) +
    p.tags.filter((t) => product.tags.includes(t)).length;
  const relatedProducts = [...others].sort((a, b) => score(b) - score(a)).slice(0, 8);

  // Cross-sell: jewellery with clothing, festive clothing with jewellery.
  const pairProducts = isJewellery(product)
    ? others.filter((p) => !isJewellery(p) && isSaleProduct(p)).slice(0, 6)
    : others.filter(isJewellery).slice(0, 6);

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
    <>
      {/* Product JSON-LD Rich Snippet for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        pairProducts={pairProducts}
      />
    </>
  );
}
