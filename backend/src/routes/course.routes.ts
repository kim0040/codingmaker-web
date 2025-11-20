import { Router } from "express";
import * as courseController from "../controllers/course.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireTier } from "../middleware/permission.js";

const router = Router();

router.get("/", authMiddleware, courseController.getCoursesHandler);
router.post("/", authMiddleware, requireTier([1, 2]), courseController.createCourseHandler);
router.put("/:id", authMiddleware, requireTier([1, 2]), courseController.updateCourseHandler);
router.delete("/:id", authMiddleware, requireTier([1]), courseController.deleteCourseHandler);

export default router;
