import Razorpay from 'razorpay';

export const getRazorpayKeyId = () => {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_live_TRxGmPWR0N7rQk';
};

export const getRazorpayKeySecret = () => {
  return process.env.RAZORPAY_KEY_SECRET || 'ih4VZPk98LEeTO1ISN4gc3jE';
};

export function getRazorpayInstance() {
  const key_id = getRazorpayKeyId();
  const key_secret = getRazorpayKeySecret();

  return new Razorpay({
    key_id,
    key_secret,
  });
}
