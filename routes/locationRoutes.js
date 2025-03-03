import express from "express";
import {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",authenticateToken, createLocation);
router.get("/", getAllLocations);
router.get("/:id", getLocationById);
router.put("/:id",authenticateToken, updateLocation);
router.delete("/:id",authenticateToken, deleteLocation);

export default router;
