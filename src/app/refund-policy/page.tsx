import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Clock, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy — Saga Fabrics',
  description: 'Cancellation and Refund Policy for Saga Fabrics. Read about order cancellation timelines, refund processing via Razorpay, and damaged item replacements.',
};

export default function RefundPolicyPage() {
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
            <RefreshCw className="w-3.5 h-3.5 text-[#B59757]" /> Customer Satisfaction Guarantee
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2B2723] tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8178] max-w-xl mx-auto">
            Last Updated: August 2026 • Clear guidelines for order cancellations, replacements, and Razorpay refund timelines.
          </p>
        </div>

        {/* Highlight Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="p-6 bg-white rounded-3xl border border-[#EDE7E1] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-[#9E6962]">
              <Clock className="w-5 h-5" />
              <h3 className="font-serif font-bold text-sm">Order Cancellation</h3>
            </div>
            <p className="text-xs text-[#5C554E] leading-relaxed">
              Cancel within <strong>12 hours</strong> of order placement before dispatch for a <strong>100% Full Refund</strong>.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#EDE7E1] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-[#7D8F85]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-serif font-bold text-sm">Refund Processing Timeline</h3>
            </div>
            <p className="text-xs text-[#5C554E] leading-relaxed">
              Refunds are credited back to your original payment mode via Razorpay within <strong>5 to 7 working days</strong>.
            </p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="space-y-8 text-xs sm:text-sm text-[#5C554E] leading-relaxed">
          
          {/* Section 1 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#9E6962]" /> 1. How to Request an Order Cancellation
            </h2>
            <p>
              If you wish to cancel an order, please email our support team at <strong>saga.fabricss@gmail.com</strong> or message us on WhatsApp at <strong>+91 70233 52132</strong> with your Order ID.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#2B2723]">
              <li>Cancellations requested before order dispatch will be processed immediately.</li>
              <li>Once an order has been handed over to the courier partner, cancellation requests cannot be accepted.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#9E6962]" /> 2. Damaged or Defective Item Replacement Policy
            </h2>
            <p>
              Every unstitched fabric set undergoes strict quality checks prior to dispatch. However, if you receive a damaged or incorrect fabric set:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[#2B2723]">
              <li>Contact us within <strong>48 hours of delivery</strong> with unboxing photos or video evidence.</li>
              <li>Our team will verify the claim and arrange a free replacement or initiate a full refund.</li>
            </ol>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#9E6962]" /> 3. Razorpay Refund Credit Process
            </h2>
            <p>
              All approved refunds are automatically routed back to your original source of payment (UPI, Credit Card, Debit Card, Net Banking) via the Razorpay payment gateway.
            </p>
            <p className="text-xs text-[#2B2723]">
              Please allow <strong>5 to 7 business days</strong> for the refunded amount to reflect in your bank account or card statement after processing.
            </p>
          </section>

          {/* Contact Box */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE7E1] shadow-2xs space-y-3">
            <h2 className="text-lg font-serif font-bold text-[#2B2723]">Need Assistance? Contact Support</h2>
            <div className="space-y-1.5 text-xs text-[#2B2723]">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#9E6962]" /> Email Support: <strong>saga.fabricss@gmail.com</strong></p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#9E6962]" /> WhatsApp / Phone: <strong>+91 70233 52132</strong></p>
              <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#9E6962] shrink-0 mt-0.5" /> Address: <strong>A305, Ashadeep Green Avenue Apartment, Jagatpura, Jaipur, Rajasthan - 302017, India</strong></p>
              <p className="flex items-center justify-between gap-2 pt-1 border-t border-[#EDE7E1] flex-wrap">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#9E6962] shrink-0" />
                  <span>MSME Udyam Registration No.: <strong className="font-mono">UDYAM-RJ-17-0677985</strong></span>
                </span>
                <a
                  href="/msme-certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#9E6962] hover:underline font-semibold bg-[#FAF6F1] px-2.5 py-1 rounded-md border border-[#EDE7E1] inline-flex items-center gap-1"
                >
                  View Certificate ↗
                </a>
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
