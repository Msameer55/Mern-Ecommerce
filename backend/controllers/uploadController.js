import cloudinary from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// @route POST /api/upload
// @desc Upload an image to Cloudinary
// @access Private (or Public depending on use case)
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream((error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
                streamifier.createReadStream(fileBuffer).pipe(uploadStream);
            });
        };

        const result = await streamUpload(req.file.buffer);
        res.status(200).json({ success: true, message: "Image uploaded successfully", imageUrl: result.secure_url });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ success: false, message: "Error uploading image" });
    }
};
