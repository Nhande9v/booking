import express from 'express';
import { deleteImage, getUploadSignature } from '../controllers/uploadController.js';
import { verifyToken } from '../utils/verifyToken.js';
import { verifyProvider } from "../utils/verifyProvider.js";

const router = express.Router();

router.get("/signature",verifyToken, verifyProvider, getUploadSignature);
router.delete("/image",verifyToken, verifyProvider, deleteImage);

export default router;