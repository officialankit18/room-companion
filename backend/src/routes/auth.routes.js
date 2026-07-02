import { Router } from "express";

import {
  login,
  logout,
  me,
  register,
  resendVerificationOtp,
  verifyUserEmail,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { createRateLimiter } from "../middleware/rateLimit.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { RATE_LIMITS } from "../constants/rateLimit.js";
import {
  loginValidator,
  registerValidator,
  resendOtpValidator,
  verifyEmailValidator,
} from "../validators/auth.validator.js";

const router = Router();
const authRateLimiter = createRateLimiter({
  windowMs: RATE_LIMITS.AUTH_WINDOW_MS,
  maxRequests: RATE_LIMITS.AUTH_MAX_REQUESTS,
});

router.post("/register", authRateLimiter, registerValidator, validateRequest, register);
router.post("/verify-email", authRateLimiter, verifyEmailValidator, validateRequest, verifyUserEmail);
router.post("/resend-otp", authRateLimiter, resendOtpValidator, validateRequest, resendVerificationOtp);
router.post("/login", authRateLimiter, loginValidator, validateRequest, login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
