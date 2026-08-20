import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ShieldAlert, FileText, CheckCircle2, Lock, RefreshCw, Truck, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions — Saga Fabrics',
  description: 'Terms and Conditions for Saga Fabrics. Read our terms of service, payment processing terms via Razorpay, cancellation, and delivery policies.',
};

export default function TermsAndConditionsPage() {
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
            <FileText className="w-3.5 h-3.5 text-[#B59757]" /> Official Merchant Agreement
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2B2723] tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8178] max-w-xl mx-auto">
            Last Updated: August 2026 • Please read these terms carefully before placing an order on Saga Fabrics.
          </p>
        </div>

        {/* Highlight Summary Box */}
        <div className="mb-10 p-6 bg-white rounded-3xl border border-[#EDE7E1] shadow-sm space-y-3">
          <div className="flex items-center gap-3 text-[#9E6962]">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <h3 className="text-base font-serif font-bold">Store & Service Overview</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed">
            Welcome to <strong>Saga Fabrics</strong> (sagafabrics.com). By browsing or placing an order on our website, you agree to be bound by the following terms, conditions, and payment guidelines. All transactions are securely processed in Indian Rupees (INR) via PCI-DSS compliant payment gateway <strong>Razorpay</strong>.
          </p>
        </div>

        {/* Detailed Policy Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-[#5C554E] leading-relaxed">
          
          {/* Section 1 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#9E6962]/10 text-[#9E6962] text-xs font-mono font-bold flex items-center justify-center">1</span>
              Product Descriptions & Unstitched Fabric Specs
            </h2>
            <p>
              Saga Fabrics specializes in 100% premium unstitched suit fabrics, unstitched Chikankari dress materials, and handblock printed suit sets.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#2B2723]">
              <li>All products sold are <strong>100% Unstitched Fabric Sets (Free Size)</strong> customizable by your tailor to any size.</li>
              <li>Since our fabrics feature handcrafted embroidery and handblock motifs, slight variations in color tone or thread weave are natural artisanal characteristics.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#9E6962]/10 text-[#9E6962] text-xs font-mono font-bold flex items-center justify-center">2</span>
              Pricing & Razorpay Payment Terms
            </h2>
            <p>
              All prices listed on our store are in Indian Rupees (INR) and inclusive of all applicable taxes.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-[#7D8F85]">
              <Lock className="w-4 h-4 text-[#9E6962]" /> Payments are securely processed via Razorpay supporting UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking.
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#9E6962]/10 text-[#9E6962] text-xs font-mono font-bold flex items-center justify-center">3</span>
              Order Cancellation Policy
            </h2>
            <p>
              Customers can request an order cancellation within <strong>12 hours of placement</strong> or before the item has been dispatched by emailing <strong>saga.fabricss@gmail.com</strong>.
            </p>
            <p className="text-xs text-[#2B2723]">
              Upon successful cancellation, a 100% full refund will be initiated back to your original payment source (Bank/UPI/Card) within <strong>5 to 7 business days</strong>.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#9E6962]/10 text-[#9E6962] text-xs font-mono font-bold flex items-center justify-center">4</span>
              Damaged Product Replacement & Refunds
            </h2>
            <p>
              Due to the custom nature of unstitched fabric sets, we do not accept returns for change of mind. However, if you receive a damaged or incorrect product:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#2B2723]">
              <li>Please notify us within <strong>48 hours of delivery</strong> at saga.fabricss@gmail.com with unboxing photos/video.</li>
              <li>Approved claims will receive a free replacement or a full refund processed to your original payment mode within 5-7 working days.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#9E6962]/10 text-[#9E6962] text-xs font-mono font-bold flex items-center justify-center">5</span>
              Shipping & Delivery Timelines
            </h2>
            <p>
              Orders are dispatched within 24 to 48 business hours. Delivery timelines range from 3 to 7 business days across India via courier partners (BlueDart, Delhivery, DTDC). Shipping is complimentary on all orders.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#9E6962]/10 text-[#9E6962] text-xs font-mono font-bold flex items-center justify-center">6</span>
              Governing Law & Merchant Contact
            </h2>
            <p>
              These terms shall be governed by the laws of India. For any merchant inquiries or support:
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-[#2B2723]">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#9E6962]" /> Email: <strong>saga.fabricss@gmail.com</strong></p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#9E6962]" /> Phone / WhatsApp: <strong>+91 70233 52132</strong></p>
              <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#9E6962] shrink-0 mt-0.5" /> Address: <strong>Saga Fabrics Atelier, Hazratganj, Lucknow, Uttar Pradesh - 226001, India</strong></p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
