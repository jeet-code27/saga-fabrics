import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ShieldAlert, FileText, CheckCircle2, Lock } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions — Saga Fabrics',
  description: 'Terms and conditions for Saga Fabrics. Read our terms of service, payment terms, and strict no-return policy for unstitched suit fabrics.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B2723] selection:bg-[#7A1B38] selection:text-white">
      {/* Header Navigation */}
      <Navbar cartCount={0} onOpenCart={() => {}} />

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
            <FileText className="w-3.5 h-3.5 text-[#B59757]" /> Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2B2723] tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8178] max-w-xl mx-auto">
            Last Updated: August 2026 • Please read these terms carefully before placing an order with Saga Fabrics.
          </p>
        </div>

        {/* Important Notice Box: NO RETURN POLICY */}
        <div className="mb-10 p-6 bg-[#7A1B38]/5 rounded-3xl border-2 border-[#7A1B38]/30 shadow-sm space-y-3">
          <div className="flex items-center gap-3 text-[#7A1B38]">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <h3 className="text-lg font-serif font-bold">Important Notice: Strict No Return & No Refund Policy</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#2B2723] leading-relaxed">
            All items sold on <strong>Saga Fabrics</strong> are <strong>100% Authentic Premium Unstitched Suit Fabrics & Dress Materials</strong>. Due to the custom nature of unstitched fabrics, cut materials, and hygiene standards, <strong>WE DO NOT ACCEPT RETURNS, EXCHANGES, OR REFUNDS UNDER ANY CIRCUMSTANCES.</strong>
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 text-xs sm:text-sm text-[#8A8178] leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] text-xs font-mono font-bold flex items-center justify-center">1</span>
              Product Description & Fabric Specifications
            </h2>
            <p>
              Saga Fabrics specializes in handcrafted Jaipuri Chikankari, Handblock printed, Chanderi, and Mulmul unstitched suit fabric sets.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#2B2723]">
              <li>Each product listing specifies unstitched fabric dimensions (Top: ~2.5m, Bottom: ~2.5m, Dupatta: ~2.25m unless stated otherwise).</li>
              <li>Since our fabrics feature handcrafted hand-block motifs and manual thread embroidery, minor variations in print placement, color shade, or weave texture are natural craft characteristics and not defect items.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] text-xs font-mono font-bold flex items-center justify-center">2</span>
              Strict No Return & Replacement Conditions
            </h2>
            <p>
              By placing an order on our website, you expressly agree to our Non-Returnable policy:
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2.5 bg-[#FAF6F1] p-3 rounded-2xl border border-[#E4D9CC]">
                <CheckCircle2 className="w-4 h-4 text-[#7A1B38] shrink-0 mt-0.5" />
                <p className="text-xs text-[#2B2723]">
                  <strong>No Returns for Mind Change or Preference:</strong> We do not accept returns if you change your mind, dislike the color shade on your screen, or no longer require the fabric.
                </p>
              </div>
              <div className="flex items-start gap-2.5 bg-[#FAF6F1] p-3 rounded-2xl border border-[#E4D9CC]">
                <CheckCircle2 className="w-4 h-4 text-[#7A1B38] shrink-0 mt-0.5" />
                <p className="text-xs text-[#2B2723]">
                  <strong>Damaged/Wrong Item Exception:</strong> In the rare event of receiving a physically damaged or wrong product, you must inform us within <strong>24 hours of delivery</strong> with a mandatory continuous, unedited unboxing video. Claims without an unboxing video will not be entertained.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] text-xs font-mono font-bold flex items-center justify-center">3</span>
              Pricing & Razorpay Payment Terms
            </h2>
            <p>
              All prices listed on Saga Fabrics are in Indian Rupees (INR) and inclusive of all applicable taxes.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-[#5C7056]">
              <Lock className="w-4 h-4 text-[#7A1B38]" /> 256-Bit Encrypted Secure Checkout via Razorpay (UPI, GPay, PhonePe, Cards, NetBanking).
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] text-xs font-mono font-bold flex items-center justify-center">4</span>
              Shipping & Delivery
            </h2>
            <p>
              Orders are dispatched from our Jaipur studio within 24 to 48 business hours. Delivery timelines range between 2 to 5 business days depending on delivery location in India.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4D9CC] shadow-2xs space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#2B2723] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#7A1B38]/10 text-[#7A1B38] text-xs font-mono font-bold flex items-center justify-center">5</span>
              Governing Law & Jurisdiction
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with orders shall be subject to the exclusive jurisdiction of the courts in <strong>Jaipur, Rajasthan</strong>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
