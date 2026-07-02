import { AUTH_MESSAGES } from "../constants/messages.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  resendOtp,
  verifyEmail,
} from "../services/auth.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  return sendSuccess(res, HTTP_STATUS.CREATED, AUTH_MESSAGES.REGISTRATION_SUCCESSFUL, {
    user,
  });
});

export const verifyUserEmail = asyncHandler(async (req, res) => {
  const user = await verifyEmail(req.body);

  return sendSuccess(res, HTTP_STATUS.OK, AUTH_MESSAGES.EMAIL_VERIFIED, { user });
});

export const resendVerificationOtp = asyncHandler(async (req, res) => {
  await resendOtp(req.body);

  return sendSuccess(res, HTTP_STATUS.OK, AUTH_MESSAGES.OTP_SENT);
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);

  return sendSuccess(res, HTTP_STATUS.OK, AUTH_MESSAGES.LOGIN_SUCCESSFUL, data);
});

export const logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, HTTP_STATUS.OK, AUTH_MESSAGES.LOGOUT_SUCCESSFUL);
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);

  return sendSuccess(res, HTTP_STATUS.OK, AUTH_MESSAGES.CURRENT_USER_FETCHED, { user });
});

