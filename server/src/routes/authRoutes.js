import express from "express";
import {
  changePassword,
  getCurrentUser,
  login,
  register,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateRequest.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validation/authSchemas.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.get("/me", protect, getCurrentUser);

router.patch(
  "/profile",
  protect,
  validateBody(updateProfileSchema),
  updateProfile,
);

router.patch(
  "/password",
  protect,
  validateBody(changePasswordSchema),
  changePassword,
);

export default router;
