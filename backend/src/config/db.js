import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const connectDB = async () => {
    try {
       const uri = process.env.MONGODB_CONNECTIONSTRING;
       const caFilePath = path.join(process.cwd(), "global-bundle.pem");
       
        await mongoose.connect(uri, {
            tlsCAFile: caFilePath, // QUAN TRỌNG: Chỉ định file pem ở đây
            tls: true,
            retryWrites: false // DocumentDB không hỗ trợ retryWrites như Atlas
        });
        console.log("MongoDB connected successfully ✅");
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error.message);
    }
}