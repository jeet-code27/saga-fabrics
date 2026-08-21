import Razorpay from 'razorpay';

export const getRazorpayKeyId = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
  if (!keyId) throw new Error('RAZORPAY_KEY_ID environment variable is not set');
  return keyId;
};

export const getRazorpayKeySecret = () => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET environment variable is not set');
  return secret;
};

export function getRazorpayInstance() {
  const key_id = getRazorpayKeyId();
  const key_secret = getRazorpayKeySecret();

  return new Razorpay({
    key_id,
    key_secret,
  });
}
