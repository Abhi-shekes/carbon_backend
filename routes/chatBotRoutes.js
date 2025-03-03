import express from "express";
import { chatBot } from "../controllers/chatbotController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", chatBot);

export default router;
