import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Script from 'next/script';
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

export const metadata: Metadata = {
  title: 'Saga Fabrics — Handcrafted Chikankari Suit Sets',
  description: 'Handcrafted Chikankari Unstitched Suit Sets with Pure Cotton Dupattas. Authentic ethnic fashion in soft pastel hues.',
  keywords: ['Saga Fabrics', 'Chikankari Suit Set', 'Unstitched Suit Material', 'Lucknowi Chikankari', 'Cotton Dupatta Suit Set'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF6F1] text-[#2B2723] font-sans selection:bg-[#7FA79A] selection:text-white">
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
