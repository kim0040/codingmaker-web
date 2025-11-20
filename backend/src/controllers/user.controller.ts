import { Response } from "express";
import prisma from "../config/database.js";
import { AuthRequest } from "../types/express.js";
import { decrypt } from "../services/crypto.service.js";

export async function getUserProfileHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        tier: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            enrolledCourses: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "사용자를 찾을 수 없습니다.",
        code: "USER_NOT_FOUND",
      });
    }

    // 친구 관계 확인
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: req.user.id, friendId: userId },
          { userId: userId, friendId: req.user.id },
        ],
      },
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        name: decrypt(user.name) ?? "사용자",
        role: user.role,
        tier: user.tier,
        createdAt: user.createdAt,
        friendStatus: friendship?.status ?? "NONE",
        stats: {
          enrolledClasses: user._count.enrolledCourses,
          posts: user._count.posts,
        },
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      error: "사용자 정보를 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}
