import express from "express";
import {
  bookAppointment,
  updateAppointment,
  getUserAppointments,
  getAppointmentById,
  getAllAppointments,
} from "../controllers/appointmentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", authenticateToken, bookAppointment);
router.patch("/:appointmentId", authenticateToken, updateAppointment);
router.get("/", authenticateToken, getUserAppointments);
router.get("/:appointmentId", authenticateToken, getAppointmentById);
router.get("/admin/all", authenticateToken, getAllAppointments);

export default router;
