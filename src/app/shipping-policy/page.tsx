import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Truck, Package, MapPin, Clock, CheckCircle2, Mail, Phone } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy — Saga Fabrics',
  description: 'Shipping and Delivery Policy for Saga Fabrics. Read about our dispatch timelines, nationwide courier delivery across India, and free shipping benefits.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723] selection:bg-[#9E6962] selection:text-white">
      {/* Header Navigation */}
      <Navbar cartCount={0} />

      <main className="flex-1 py-12 md:py-20 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9E6962] hover:text-[#2B2723] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12 border-b border-[#E4D9CC] pb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#9E6962] bg-[#9E6962]/10 px-4 py-1.5 rounded-full border border-[#9E6962]/20">
            <Truck className="w-3.5 h-3.5 text-[#B59757]" /> Express Shipping
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2B2723] tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8178] max-w-xl mx-auto">
            Last Updated: August 2026 • Complimentary express shipping across 26,000+ PIN codes in India.
          </p>
        </div>

        {/* Highlight Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-5 bg-white rounded-3xl border border-[#EDE7E1] shadow-sm text-center space-y-2">
            <Clock className="w-6 h-6 text-[#9E6962] mx-auto" />
            <h3 className="font-serif font-bold text-xs">Dispatch Time</h3>
            <p className="text-xs text-[#5C554E]">24 to 48 Business Hours</p>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-[#EDE7E1] shadow-sm text-center space-y-2">
            <Truck className="w-6 h-6 text-[#7D8F85] mx-auto" />
            <h3 className="font-serif font-bold text-xs">Delivery Time</h3>
            <p className="text-xs text-[#5C554E]">3 to 7 Business Days</p>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-[#EDE7E1] shadow-sm text-center space-y-2">
            <Package className="w-6 h-6 text-[#B59757] mx-auto" />
            <h3 className="font-serif font-bold text-xs">Shipping Fee</h3>
            <p className="text-xs text-emerald-800 font-bold">100% FREE Shipping</p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="space-y-8 text-xs sm:text-sm text-[#5C554E] leading-relaxed">
          
          {/* Section 1 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#9E6962]" /> 1. Order Processing & Packaging
            </h2>
            <p>
              Once your payment is verified via Razorpay, our fulfillment team in Lucknow carefully inspects, folds, and packages your unstitched suit fabric sets in protective tamper-evident polybags.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#9E6962]" /> 2. Logistics & Courier Partners
            </h2>
            <p>
              We partner with India's leading express logistics networks to ensure fast, reliable delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#2B2723]">
              <li><strong>Courier Partners:</strong> BlueDart, Delhivery, DTDC, ExpressBees, and India Post.</li>
              <li><strong>Tracking Updates:</strong> Instant Airway Bill (AWB) tracking numbers are dispatched to your registered email and WhatsApp number upon dispatch.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#9E6962]" /> 3. Address Accuracy & Re-Delivery
            </h2>
            <p>
              Please ensure your shipping address, pincode, and WhatsApp phone number are correctly filled at checkout. In case of non-delivery due to incorrect address, 3 delivery attempts will be made by our courier partner before returning the package to our atelier.
            </p>
          </section>

          {/* Contact Box */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723]">Shipping Support & Tracking Inquiries</h2>
            <div className="space-y-1.5 text-xs text-[#2B2723]">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#9E6962]" /> Email Support: <strong>saga.fabricss@gmail.com</strong></p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#9E6962]" /> WhatsApp / Phone: <strong>+91 70233 52132</strong></p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
