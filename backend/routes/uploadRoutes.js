import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";
import { verifyToken } from "../middlewares/protectedRoutes.js";

const uploadRoutes = express.Router();

// Set up multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadRoutes.post("/", upload.single("image"), uploadImage);

export default uploadRoutes;
