export const AUTH_MESSAGES = {
  REGISTRATION_SUCCESSFUL: "Account created successfully. Please verify your email",
  EMAIL_VERIFIED: "Email verified successfully",
  OTP_SENT: "OTP sent successfully",
  LOGIN_SUCCESSFUL: "Login successful",
  LOGOUT_SUCCESSFUL: "Logout successful",
  CURRENT_USER_FETCHED: "Current user fetched successfully",
  EMAIL_ALREADY_EXISTS: "Email is already registered",
  INVALID_CREDENTIALS: "Invalid credentials",
  EMAIL_VERIFICATION_REQUIRED: "Please verify your email first",
  INVALID_OTP: "Invalid OTP",
  OTP_EXPIRED: "OTP has expired",
  OTP_COOLDOWN: "Please wait before requesting another OTP",
  ACCOUNT_INACTIVE: "Account is inactive",
};

export const VALIDATION_MESSAGES = {
  INVALID_REQUEST: "Invalid request data",
  INVALID_ID: "Invalid resource id",
};

export const SECURITY_MESSAGES = {
  FORBIDDEN: "You do not have permission to perform this action",
  TOO_MANY_REQUESTS: "Too many requests. Please try again later",
};

export const LISTING_MESSAGES = {
  CREATED: "Listing created successfully",
  UPDATED: "Listing updated successfully",
  FETCHED: "Listings fetched successfully",
  DETAILS_FETCHED: "Listing details fetched successfully",
  DELETED: "Listing removed successfully",
  MARKED_FILLED: "Listing marked as filled successfully",
  NOT_FOUND: "Listing not found",
  OWNER_ONLY: "Only the listing owner can perform this action",
  IMAGES_REQUIRED: "At least one listing image is required",
  IMAGE_LIMIT_EXCEEDED: "Maximum 5 images are allowed",
};
