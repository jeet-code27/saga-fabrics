import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';
import {
  sendCustomerOrderConfirmationEmail,
  sendAdminOrderNotificationEmail,
  sendOrderStatusUpdateEmail,
} from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { orderId, type } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let emailSent = false;

    if (type === 'admin_alert') {
      emailSent = await sendAdminOrderNotificationEmail(order);
    } else if (type === 'status_update') {
      emailSent = await sendOrderStatusUpdateEmail(order);
    } else {
      // Default: Resend customer confirmation email
      emailSent = await sendCustomerOrderConfirmationEmail(order);
    }

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: `Email (${type || 'confirmation'}) sent successfully for order ${order.id}!`,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email. Please check server logs and email credentials.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error resending email:', error);
    return NextResponse.json({ error: 'Error processing email resend request' }, { status: 500 });
  }
}
