export function generateOtp() {
  if (process.env.NODE_ENV !== 'production') {
    return process.env.DEFAULT_OTP || '000000';
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}
