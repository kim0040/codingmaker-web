import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireTier } from "../middleware/permission.js";

const router = Router();

// Tier 1, 2만 접근 가능
router.get(
  "/attendance",
  authMiddleware,
  requireTier([1, 2]),
  analyticsController.getAttendanceStatsHandler
);

router.get(
  "/community",
  authMiddleware,
  requireTier([1, 2]),
  analyticsController.getCommunityStatsHandler
);

router.get(
  "/users",
  authMiddleware,
  requireTier([1, 2]),
  analyticsController.getUserStatsHandler
);

router.get(
  "/dashboard",
  authMiddleware,
  requireTier([1, 2]),
  analyticsController.getDashboardStatsHandler
);

export default router;
