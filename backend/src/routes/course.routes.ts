import { Router } from "express";
import * as courseController from "../controllers/course.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireTier } from "../middleware/permission.js";

const router = Router();

router.get("/", authMiddleware, courseController.getCoursesHandler);
router.get("/:id/structure", authMiddleware, courseController.getCourseStructureHandler);
router.post("/", authMiddleware, requireTier([1, 2]), courseController.createCourseHandler);
router.put("/:id", authMiddleware, requireTier([1, 2]), courseController.updateCourseHandler);
router.delete("/:id", authMiddleware, requireTier([1]), courseController.deleteCourseHandler);
router.post(
  "/:courseId/sections",
  authMiddleware,
  requireTier([1, 2]),
  courseController.createSectionHandler
);
router.post(
  "/sections/:sectionId/lessons",
  authMiddleware,
  requireTier([1, 2]),
  courseController.createLessonHandler
);
router.put(
  "/:courseId/reorder",
  authMiddleware,
  requireTier([1, 2]),
  courseController.reorderCurriculumHandler
);

export default router;
