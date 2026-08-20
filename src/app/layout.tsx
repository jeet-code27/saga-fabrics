import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Script from 'next/script';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { MetaPixel } from '@/components/MetaPixel';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = 'https://sagafabrics.in';
const LOGO_URL = 'https://res.cloudinary.com/dnd8u5sll/image/upload/v1787209605/saga-fabrics-logo-new_skmnli.png';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Saga Fabrics — Handcrafted Chikankari & Handblock Suit Sets',
    template: '%s — Saga Fabrics',
  },
  description: 'Shop 100% authentic Lucknowi Chikankari & Handblock unstitched suit fabric sets. Pure cotton dupattas, free express shipping in India & 256-bit secure Razorpay checkout.',
  keywords: [
    'Saga Fabrics',
    'Chikankari Suit Set',
    'Unstitched Suit Material',
    'Lucknow Chikankari',
    'Handblock Print Fabric',
    'Pure Cotton Suit Set',
    'Pastel Ethnic Wear',
    'Online Suit Fabrics India',
  ],
  authors: [{ name: 'Saga Fabrics', url: SITE_URL }],
  creator: 'Saga Fabrics',
  publisher: 'Saga Fabrics',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Saga Fabrics',
    title: 'Saga Fabrics — Handcrafted Chikankari & Handblock Suit Sets',
    description: 'Authentic 100% pure cotton unstitched suit fabric sets with Lucknowi Chikankari & Handblock thread embroidery.',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: 'Saga Fabrics Authentic Chikankari Suit Sets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saga Fabrics — Handcrafted Chikankari Suit Sets',
    description: 'Authentic 100% pure cotton unstitched suit fabric sets with free express shipping across India.',
    images: [LOGO_URL],
  },
  icons: {
    icon: '/favicon.ico',
    apple: LOGO_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <JsonLdSchema />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF6F1] text-[#2B2723] font-sans selection:bg-[#9E6962] selection:text-white">
        <MetaPixel />
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
