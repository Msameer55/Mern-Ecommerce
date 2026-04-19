import express from "express"
import { subscribe } from "../controllers/subscriberController.js";

const subscriberRoutes = express.Router();

subscriberRoutes.post("/", subscribe);

export default subscriberRoutes;