import { NextResponse } from 'next/server';
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const { amount, receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const keyId = getRazorpayKeyId();
    const razorpay = getRazorpayInstance();

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      // Note: payment_capture is configured in Razorpay Dashboard → Settings
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      ...order,
      key: keyId,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Payment gateway temporarily unavailable. Please try again in a moment.' },
      { status: 503 }
    );
  }
}
