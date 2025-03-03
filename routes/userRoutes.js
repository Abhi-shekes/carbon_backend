import express from "express";
import { getPoints } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/points", authenticateToken, getPoints);

export default router;
