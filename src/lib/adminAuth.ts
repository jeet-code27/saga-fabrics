import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Admin session: after the passcode is checked on the server we set an httpOnly
// cookie holding an HMAC of the passcode. Changing ADMIN_PASSCODE logs everyone out.

export const ADMIN_COOKIE = 'saga_admin_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const passcode = () => process.env.ADMIN_PASSCODE || '';

const sessionToken = () => createHmac('sha256', passcode()).update('saga-admin-session-v1').digest('hex');

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
};

export const checkPasscode = (input: string): boolean => !!passcode() && safeEqual(input, passcode());

export async function isAdmin(): Promise<boolean> {
  if (!passcode()) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, sessionToken());
}

export function withSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE,
  });
  return res;
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}

export const unauthorized = () => NextResponse.json({ error: 'Not authorised' }, { status: 401 });
