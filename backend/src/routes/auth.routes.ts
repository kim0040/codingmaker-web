import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/login", loginLimiter, authController.loginHandler);
router.post("/register", authController.registerHandler);
router.get("/me", authMiddleware, authController.getMeHandler);

export default router;
