import api from './axios';

export const uploadImage = async (file) => {
    const signatureResponse = await api.get("/uploads/signature");
    const {apiKey, cloudName, folder, signature, timestamp, uploadPreset} = signatureResponse.data;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("api_key", apiKey);
    uploadData.append("timestamp", timestamp);
    uploadData.append("signature", signature);
    uploadData.append("folder", folder);
    uploadData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
        method: "POST",
        body: uploadData,
        }
    );
    
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error?.message || "Upload ảnh thất bại");
    }

    return {
        url: result.secure_url,
        storageKey: result.public_id,
        provider: "cloudinary",
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
    };
};

export const deleteUploadedImage = async (image)=>{
    if (image?.provider !== "cloudinary" || !image?.storageKey){
        return;
    }
    await api.delete("/uploads/image", {
        data: {
            storageKey: image.storageKey,
        }
    })
};
