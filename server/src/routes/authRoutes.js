import express from "express";
import {
  changePassword,
  getCurrentUser,
  login,
  register,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.patch("/profile", protect, updateProfile);
router.patch("/password", protect, changePassword);

export default router;
