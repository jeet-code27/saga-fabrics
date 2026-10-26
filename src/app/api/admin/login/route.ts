import { NextResponse } from 'next/server';
import { checkPasscode, withSessionCookie } from '@/lib/adminAuth';

export async function POST(request: Request) {
  const { passcode } = await request.json().catch(() => ({ passcode: '' }));
  if (!process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: 'ADMIN_PASSCODE is not set on the server' }, { status: 500 });
  }
  if (typeof passcode !== 'string' || !checkPasscode(passcode)) {
    // Small delay slows down guessing.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: 'Incorrect passcode' }, { status: 401 });
  }
  return withSessionCookie(NextResponse.json({ success: true }));
}
