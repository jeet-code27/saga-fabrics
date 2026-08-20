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
      isMock,
    } = body;

    // Validate request data
    if (!customer || !items || !items.length || !totalAmount) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    let isValidSignature = true;

    // If not mock and real keys exist, verify HMAC SHA256 signature
    const keySecret = getRazorpayKeySecret();
    if (!isMock && razorpay_order_id && razorpay_payment_id && razorpay_signature && !keySecret.includes('DemoSecret')) {
      const generated_signature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValidSignature = generated_signature === razorpay_signature;
    }

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid payment signature verification failed' }, { status: 400 });
    }

    // Save order in Database
    const newOrder = await saveOrder({
      razorpayOrderId: razorpay_order_id || `order_sim_${Date.now()}`,
      razorpayPaymentId: razorpay_payment_id || `pay_sim_${Date.now()}`,
      customer: customer as CustomerInfo,
      items: items as OrderItem[],
      totalAmount: Number(totalAmount),
      status: 'Processing',
    });

    // Trigger automated emails asynchronously
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
