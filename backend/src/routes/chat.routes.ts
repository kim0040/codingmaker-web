import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/rooms", authMiddleware, chatController.getChatRoomsHandler);
router.post("/rooms", authMiddleware, chatController.createChatRoomHandler);
router.get("/rooms/:roomId/messages", authMiddleware, chatController.getMessagesHandler);
router.post("/rooms/:roomId/messages", authMiddleware, chatController.sendMessageHandler);
router.delete("/messages/:messageId", authMiddleware, chatController.deleteMessageHandler);

export default router;
