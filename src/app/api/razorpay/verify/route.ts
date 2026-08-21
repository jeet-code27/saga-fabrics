import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRazorpayKeySecret } from '@/lib/razorpay';
import { saveOrder } from '@/lib/db';
import { OrderItem, CustomerInfo } from '@/types';
import { sendCustomerOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      totalAmount,
    } = body;

    // Validate all required order fields
    if (!customer || !items || !items.length || !totalAmount) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    // Always require all three Razorpay fields — never trust a client-sent mock flag
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing Razorpay payment credentials' }, { status: 400 });
    }

    // Always verify HMAC SHA256 signature server-side — no bypasses
    const keySecret = getRazorpayKeySecret();
    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      console.warn(`[Verify] Signature mismatch for order ${razorpay_order_id}`);
      return NextResponse.json(
        { error: 'Payment signature verification failed. Unauthorized.' },
        { status: 400 }
      );
    }

    // Save order in Database
    const newOrder = await saveOrder({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      customer: customer as CustomerInfo,
      items: items as OrderItem[],
      totalAmount: Number(totalAmount),
      status: 'Processing',
    });

    // Trigger automated emails asynchronously — non-blocking
    Promise.allSettled([
      sendCustomerOrderConfirmationEmail(newOrder),
      sendAdminOrderNotificationEmail(newOrder),
    ]).then((results) => {
      console.log(`[Order Verification] Email dispatch status for ${newOrder.id}:`, results.map(r => r.status));
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Payment verified & order created successfully!',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
