import express from "express"
import { getAllSubscribers, subscribe } from "../controllers/subscriberController.js";

const subscriberRoutes = express.Router();

subscriberRoutes.get("/", getAllSubscribers);
subscriberRoutes.post("/", subscribe);

export default subscriberRoutes;