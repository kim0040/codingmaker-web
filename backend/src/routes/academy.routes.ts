import { Router } from "express";
import * as academyController from "../controllers/academy.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireTier } from "../middleware/permission.js";

const router = Router();

router.get("/info", academyController.getAcademyInfoHandler);
router.put("/info", authMiddleware, requireTier([1]), academyController.updateAcademyInfoHandler);

export default router;
