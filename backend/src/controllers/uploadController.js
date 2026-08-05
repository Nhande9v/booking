import { createUploadSignature, deleteStoredImage } from "../services/storage/cloudinaryStorage.js";

export const getUploadSignature = (req, res, next) => {
    try {
        const uploadData = createUploadSignature(req.user.id);
        res.status(200).json(uploadData);
    } catch (error) {
        next(error);
    }
};

export const deleteImage = async (req, res, next) => {
    try {
        const { storageKey } = req.body;

        if(!storageKey) {
            return res.status(400).json({
            message: "storageKey là bắt buộc",
            });
        }

        const result = await deleteStoredImage(storageKey, req.user.id);
        res.status(200).json({
            success: true,
            result: result.result,
        });
    } catch (error) {
        next(error);
    }
};