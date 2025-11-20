import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireTier } from "../middleware/permission.js";

const router = Router();

// 사용자 목록 (Tier 1,2)
router.get("/", authMiddleware, requireTier([1, 2]), userController.getUsersListHandler);

// 사용자 생성 (Tier 1,2)
router.post("/", authMiddleware, requireTier([1, 2]), userController.createUserHandler);

// 사용자 프로필 조회
router.get("/:userId/profile", authMiddleware, userController.getUserProfileHandler);

// 사용자 수정 (Tier 1,2)
router.put("/:userId", authMiddleware, requireTier([1, 2]), userController.updateUserHandler);

// 사용자 삭제 (Tier 1)
router.delete("/:userId", authMiddleware, requireTier([1]), userController.deleteUserHandler);

export default router;
