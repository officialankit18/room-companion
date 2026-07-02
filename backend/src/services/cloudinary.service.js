import { cloudinary } from "../config/cloudinary.config.js";

export const uploadImageBuffer = (file, folder = "room-companion/listings") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
};

export const uploadMultipleImages = async (files) => {
  return Promise.all(files.map((file) => uploadImageBuffer(file)));
};

