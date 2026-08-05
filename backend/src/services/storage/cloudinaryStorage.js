import cloudinary from "../../config/cloudinary.js";

const getUserFolder = (userId) => `booking/users/${userId}`;

export const createUploadSignature = (userId) => {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = getUserFolder(userId);
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    const parametersToSign = {
    folder,
    timestamp,
    upload_preset: uploadPreset,
    };
    
    const signature = cloudinary.utils.api_sign_request(
    parametersToSign,
    process.env.CLOUDINARY_API_SECRET
    );

    return {
    timestamp,
    folder,
    uploadPreset,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    };
};

export const deleteStoredImage = async (storageKey, userId) => {
  const allowedPrefix = `${getUserFolder(userId)}/`;

  if (!storageKey?.startsWith(allowedPrefix)) {
    const error = new Error("Bạn không có quyền xóa ảnh này");
    error.status = 403;
    throw error;
  }

  return cloudinary.uploader.destroy(storageKey, {
    resource_type: "image",
    invalidate: true,
  });
};