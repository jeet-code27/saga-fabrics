import { NextResponse } from 'next/server';
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const { amount, receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const keyId = getRazorpayKeyId();

    // Check if using placeholder demo keys vs real Razorpay credentials
    if (!keyId || keyId.includes('DemoKey')) {
      // Mock order creation for smooth sandbox testing
      const mockOrderId = `order_sim_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      return NextResponse.json({
        id: mockOrderId,
        entity: 'order',
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        isMock: true,
        key: keyId,
      });
    }

    const razorpay = getRazorpayInstance();
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      ...order,
      key: keyId,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    // Fallback to mock order if Razorpay credentials are not yet authorized
    const mockOrderId = `order_sim_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    return NextResponse.json({
      id: mockOrderId,
      amount: 100,
      currency: 'INR',
      isMock: true,
      key: getRazorpayKeyId(),
    });
  }
}
