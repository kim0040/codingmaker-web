import { Router } from "express";
import * as friendController from "../controllers/friend.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/request", authMiddleware, friendController.sendFriendRequestHandler);
router.put("/:friendshipId/accept", authMiddleware, friendController.acceptFriendRequestHandler);
router.get("/", authMiddleware, friendController.getFriendsHandler);
router.delete("/:friendshipId", authMiddleware, friendController.deleteFriendHandler);

export default router;
