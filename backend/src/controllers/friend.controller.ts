import { Response } from "express";
import prisma from "../config/database.js";
import { AuthRequest } from "../types/express.js";
import { decrypt } from "../services/crypto.service.js";

export async function sendFriendRequestHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        error: "대상 사용자를 선택해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    if (targetUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: "자기 자신에게는 친구 요청을 보낼 수 없습니다.",
        code: "VALIDATION_ERROR",
      });
    }

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: req.user.id, friendId: targetUserId },
          { userId: targetUserId, friendId: req.user.id },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "이미 친구이거나 요청이 진행 중입니다.",
        code: "FRIENDSHIP_EXISTS",
      });
    }

    const friendship = await prisma.friendship.create({
      data: {
        userId: req.user.id,
        friendId: targetUserId,
        status: "PENDING",
      },
    });

    res.json({
      success: true,
      data: friendship,
      message: "친구 요청을 보냈습니다.",
    });
  } catch (error) {
    console.error("Send friend request error:", error);
    res.status(500).json({
      success: false,
      error: "친구 요청 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function acceptFriendRequestHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { friendshipId } = req.params;

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship || friendship.friendId !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: "친구 요청을 찾을 수 없습니다.",
        code: "FRIENDSHIP_NOT_FOUND",
      });
    }

    await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: "ACCEPTED" },
    });

    res.json({
      success: true,
      message: "친구 요청을 수락했습니다.",
    });
  } catch (error) {
    console.error("Accept friend request error:", error);
    res.status(500).json({
      success: false,
      error: "친구 요청 수락 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function getFriendsHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: req.user.id, status: "ACCEPTED" },
          { friendId: req.user.id, status: "ACCEPTED" },
        ],
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
        friend: { select: { id: true, name: true, role: true } },
      },
    });

    const friends = friendships.map((friendship: any) => {
      const friendData = friendship.userId === req.user!.id ? friendship.friend : friendship.user;
      return {
        id: friendship.id,
        name: decrypt(friendData.name) ?? "사용자",
        role: friendData.role,
        status: friendship.status,
        createdAt: friendship.createdAt,
      };
    });

    res.json({
      success: true,
      data: { friends },
    });
  } catch (error) {
    console.error("Get friends error:", error);
    res.status(500).json({
      success: false,
      error: "친구 목록을 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function deleteFriendHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { friendshipId } = req.params;

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (
      !friendship ||
      (friendship.userId !== req.user.id && friendship.friendId !== req.user.id)
    ) {
      return res.status(404).json({
        success: false,
        error: "친구 관계를 찾을 수 없습니다.",
        code: "FRIENDSHIP_NOT_FOUND",
      });
    }

    await prisma.friendship.delete({
      where: { id: friendshipId },
    });

    res.json({
      success: true,
      message: "친구가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Delete friend error:", error);
    res.status(500).json({
      success: false,
      error: "친구 삭제 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}
