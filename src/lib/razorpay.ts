import Razorpay from 'razorpay';

export const getRazorpayKeyId = () => {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_TRwu4q6Zyvp0f6';
};

export const getRazorpayKeySecret = () => {
  return process.env.RAZORPAY_KEY_SECRET || 'AoCurFJwio1kHOthfaIoMtia';
};

export function getRazorpayInstance() {
  const key_id = getRazorpayKeyId();
  const key_secret = getRazorpayKeySecret();

  return new Razorpay({
    key_id,
    key_secret,
  });
}
