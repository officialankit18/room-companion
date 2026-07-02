import { OTP_CONFIG } from "../constants/auth.js";

export const generateOtp = () => {
  const min = 10 ** (OTP_CONFIG.LENGTH - 1);
  const max = 10 ** OTP_CONFIG.LENGTH - 1;

  return String(Math.floor(min + Math.random() * (max - min + 1)));
};

