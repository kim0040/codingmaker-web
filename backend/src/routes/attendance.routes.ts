import { Router } from "express";
import * as attendanceController from "../controllers/attendance.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { attendanceLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/checkin", attendanceLimiter, attendanceController.checkinHandler);
router.get("/user/:userId", authMiddleware, attendanceController.getUserAttendanceHandler);

export default router;
