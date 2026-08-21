import { NextResponse } from 'next/server';
import { sendWelcomeNewsletterEmail, sendAdminNewsletterAlertEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    // Trigger newsletter emails
    Promise.allSettled([
      sendWelcomeNewsletterEmail(email, 'SAGA10'),
      sendAdminNewsletterAlertEmail(email),
    ]).then((results) => {
      console.log(`[Newsletter API] Subscription emails result for ${email}:`, results.map(r => r.status));
    });

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully! Check your inbox for code SAGA10.',
      couponCode: 'SAGA10',
    });
  } catch (error: any) {
    console.error('Error processing newsletter subscription:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
