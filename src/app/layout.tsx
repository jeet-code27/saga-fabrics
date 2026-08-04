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
  title: 'Saga Fabrics — Artisanal Ethnic Wear',
  description: 'Handcrafted Chikankari & Jaipur Handblock print Kurtis. Authentic ethnic fashion in soft Jaipuri pastels.',
  keywords: ['Saga Fabrics', 'Jaipur Kurtis', 'Chikankari Kurti', 'Handblock Print Kurti', 'Women Ethnic Wear Jaipur'],
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
