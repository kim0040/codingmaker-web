import { Router } from "express";
import * as communityController from "../controllers/community.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/posts", authMiddleware, communityController.getPostsHandler);
router.get("/posts/:id", authMiddleware, communityController.getPostHandler);
router.post("/posts", authMiddleware, communityController.createPostHandler);
router.delete("/posts/:id", authMiddleware, communityController.deletePostHandler);
router.put("/posts/:id/like", authMiddleware, communityController.likePostHandler);
router.post("/posts/:id/comments", authMiddleware, communityController.createCommentHandler);
router.delete("/posts/:postId/comments/:commentId", authMiddleware, communityController.deleteCommentHandler);

export default router;
