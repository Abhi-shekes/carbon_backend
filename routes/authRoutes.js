import express from "express";
import {
  login,
  googleLogin,
  signup,
  verifyEmail,
  logout,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/googl-login", googleLogin);
router.post("/signup", signup);
router.get("/verify/:hash", verifyEmail);
router.post("/logout", logout);
router.post("/resetpass", resetPassword);
router.post("/updatepass", updatePassword);

export default router;
