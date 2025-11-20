import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/:userId/profile", authMiddleware, userController.getUserProfileHandler);

export default router;
