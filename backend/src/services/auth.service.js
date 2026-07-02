import bcrypt from "bcryptjs";

import { OTP_CONFIG } from "../constants/auth.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { EmailVerification } from "../models/EmailVerification.model.js";
import { User } from "../models/User.model.js";
import { sendVerificationEmail } from "../emails/email.service.js";
import { AppError } from "../utils/AppError.js";
import { generateOtp } from "../utils/generateOtp.js";
import { generateToken } from "../utils/generateToken.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  phone: user.phone,
  isVerified: user.isVerified,
  isActive: user.isActive,
});

const createVerificationOtp = async (user) => {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_CONFIG.EXPIRES_IN_MINUTES * 60 * 1000);

  await EmailVerification.findOneAndUpdate(
    { email: user.email },
    {
      email: user.email,
      otpHash,
      expiresAt,
      attemptCount: 0,
      lastSentAt: now,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      otp,
    });
  } catch (error) {
    console.error("Verification email failed", error.message);
  }
};

export const registerUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser?.isVerified) {
    throw new AppError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }

  if (existingUser && !existingUser.isVerified) {
    await createVerificationOtp(existingUser);
    return sanitizeUser(existingUser);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    isVerified: false,
  });

  await createVerificationOtp(user);
  return sanitizeUser(user);
};

export const verifyEmail = async ({ email, otp }) => {
  const normalizedEmail = email.toLowerCase();
  const verification = await EmailVerification.findOne({ email: normalizedEmail });

  if (!verification) {
    throw new AppError(AUTH_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
  }

  if (verification.expiresAt < new Date()) {
    await EmailVerification.deleteOne({ _id: verification._id });
    throw new AppError(AUTH_MESSAGES.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const isOtpValid = await bcrypt.compare(otp, verification.otpHash);

  if (!isOtpValid) {
    verification.attemptCount += 1;

    if (verification.attemptCount >= OTP_CONFIG.MAX_ATTEMPTS) {
      await EmailVerification.deleteOne({ _id: verification._id });
    } else {
      await verification.save();
    }

    throw new AppError(AUTH_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
  }

  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { isVerified: true },
    { new: true }
  );

  await EmailVerification.deleteOne({ _id: verification._id });
  return sanitizeUser(user);
};

export const resendOtp = async ({ email }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || user.isVerified) {
    throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.BAD_REQUEST);
  }

  const existingOtp = await EmailVerification.findOne({ email: normalizedEmail });
  const cooldownMs = OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000;

  if (existingOtp && Date.now() - existingOtp.lastSentAt.getTime() < cooldownMs) {
    throw new AppError(AUTH_MESSAGES.OTP_COOLDOWN, HTTP_STATUS.BAD_REQUEST);
  }

  await createVerificationOtp(user);
  return true;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  if (!user.isVerified) {
    throw new AppError(AUTH_MESSAGES.EMAIL_VERIFICATION_REQUIRED, HTTP_STATUS.FORBIDDEN);
  }

  if (!user.isActive) {
    throw new AppError(AUTH_MESSAGES.ACCOUNT_INACTIVE, HTTP_STATUS.FORBIDDEN);
  }

  const token = generateToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  return sanitizeUser(user);
};
