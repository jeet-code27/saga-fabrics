import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ShieldCheck, Lock, Eye, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Saga Fabrics',
  description: 'Privacy policy for Saga Fabrics. Learn how we handle your personal data, secure Razorpay checkout, and enforce our strict no-return policy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723] selection:bg-[#7A1B38] selection:text-white">
      {/* Header Navigation */}
      <Navbar cartCount={0} />

      <main className="flex-1 py-12 md:py-20 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A1B38] hover:text-[#2B2723] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12 border-b border-[#E4D9CC] pb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#7A1B38] bg-[#7A1B38]/10 px-4 py-1.5 rounded-full border border-[#7A1B38]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B59757]" /> Data Security & Trust
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2B2723] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8178] max-w-xl mx-auto">
            Last Updated: August 2026 • Your privacy is deeply important to us at Saga Fabrics.
          </p>
        </div>

        {/* Highlight Notice: NO RETURN POLICY & DATA PROTECTION */}
        <div className="mb-10 p-6 bg-[#FAF6F1] rounded-3xl border border-[#E4D9CC] shadow-sm space-y-3">
          <div className="flex items-center gap-3 text-[#7A1B38]">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <h3 className="text-base font-serif font-bold">Policy Summary & Sales Disclaimer</h3>
          </div>
          <p className="text-xs text-[#8A8178] leading-relaxed">
            Saga Fabrics collects customer shipping details solely for delivering your handcrafted unstitched fabric suit sets via courier. We never sell or lease your personal information. Please note that all sales on Saga Fabrics are <strong>final and non-returnable</strong> once dispatched.
          </p>
        </div>

        {/* Detailed Content */}
        <div className="space-y-8 text-xs sm:text-sm text-[#8A8178] leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#7A1B38]" /> 1. Information We Collect
            </h2>
            <p>
              When you order unstitched fabrics on Saga Fabrics, we collect the necessary information required for processing and delivering your package:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#2B2723]">
              <li><strong>Contact Details:</strong> Full name, mobile phone number (for SMS/WhatsApp tracking updates), and email address.</li>
              <li><strong>Shipping Address:</strong> Street address, city, state, and PIN code for BlueDart / Delhivery courier dispatch.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#7A1B38]" /> 2. Secure Payment Gateway (Razorpay)
            </h2>
            <p>
              We integrate with <strong>Razorpay Payment Gateway</strong> using 256-bit bank-grade SSL encryption.
            </p>
            <p className="text-xs text-[#2B2723]">
              Saga Fabrics <strong>does NOT store or record</strong> your Credit Card numbers, Debit Card CVVs, NetBanking passwords, or UPI PINs on our servers. All financial transactions are securely processed directly by PCI-DSS compliant payment gateways.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#7A1B38]" /> 3. No Return Policy Reminder
            </h2>
            <p className="text-xs text-[#2B2723]">
              As outlined in our Terms & Conditions, all unstitched suit fabric materials sold by Saga Fabrics are strictly <strong>non-returnable and non-refundable</strong> due to fabric cut customization. Please double-check product descriptions and fabric measurements before placing your order.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723]">4. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#2B2723]">
              <li>To fulfill and dispatch your unstitched suit fabric order.</li>
              <li>To send order confirmation and live courier tracking links.</li>
              <li>To respond to customer support inquiries on WhatsApp (+91 70233 52132).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723]">5. Customer Support Contact</h2>
            <p>
              If you have any questions regarding your order status or privacy policy, please contact our customer support atelier:
            </p>
            <div className="space-y-2 pt-2 text-xs text-[#2B2723]">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7A1B38]" /> WhatsApp Support: <strong>+91 70233 52132</strong>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7A1B38]" /> Email Support: <strong>support@sagafabrics.com</strong>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7A1B38] shrink-0 mt-0.5" /> Studio: <strong>Customer Care & Dispatch Atelier</strong>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
