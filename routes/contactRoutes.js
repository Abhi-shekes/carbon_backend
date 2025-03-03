import express from "express";
import {
  submitContactForm,
  getAllContacts,
} from "../controllers/contactController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitContactForm);
router.get("/", authenticateToken, getAllContacts);

export default router;
