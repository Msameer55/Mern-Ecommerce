import express from "express";
import { getAiResponse } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/get", getAiResponse);

export default aiRouter;