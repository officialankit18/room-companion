import multer from "multer";

import { LISTING_IMAGE_LIMITS } from "../constants/listing.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new Error("Only jpg, jpeg, png, and webp images are allowed"));
  }

  return callback(null, true);
};

export const uploadListingImages = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: LISTING_IMAGE_LIMITS.MAX_SIZE_BYTES,
    files: LISTING_IMAGE_LIMITS.MAX_COUNT,
  },
});

