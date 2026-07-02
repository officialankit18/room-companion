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
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  loginValidator,
  registerValidator,
  resendOtpValidator,
  verifyEmailValidator,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/verify-email", verifyEmailValidator, validateRequest, verifyUserEmail);
router.post("/resend-otp", resendOtpValidator, validateRequest, resendVerificationOtp);
router.post("/login", loginValidator, validateRequest, login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;

