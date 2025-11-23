import { Response } from "express";
import prisma from "../config/database.js";
import { AuthRequest } from "../types/express.js";
import { decrypt, encrypt } from "../services/crypto.service.js";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

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

// 사용자 목록 조회 (Tier 1,2만 가능)
export async function getUsersListHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user || req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "FORBIDDEN",
      });
    }

    const { role, search, page = "1", limit = "50" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.UserWhereInput = {};
    
    if (role && typeof role === "string") {
      where.role = role;
    }
    
    if (search && typeof search === "string") {
      where.OR = [
        { username: { contains: search } },
        // name은 암호화되어 있어서 검색 불가
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        phone: true,
        tag: true,
        tier: true,
        role: true,
        createdAt: true,
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count({ where });

    // 암호화된 필드 복호화
    const decryptedUsers = users.map((user: (typeof users)[number]) => ({
      id: user.id,
      username: user.username,
      name: decrypt(user.name) ?? "알 수 없음",
      phone: user.phone ? decrypt(user.phone) : null,
      tag: user.tag,
      tier: user.tier,
      role: user.role,
      createdAt: user.createdAt,
    }));

    res.json({
      success: true,
      data: decryptedUsers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get users list error:", error);
    res.status(500).json({
      success: false,
      error: "사용자 목록을 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}

// 사용자 생성 (Tier 1,2만 가능)
export async function createUserHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user || req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "FORBIDDEN",
      });
    }

    const { username, password, name, phone, tag, role, tier } = req.body;

    // 필수 필드 검증
    if (!username || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "필수 필드가 누락되었습니다.",
        code: "MISSING_FIELDS",
      });
    }

    // 중복 확인
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          tag ? { tag } : { username: "IMPOSSIBLE_USERNAME" }, // tag가 없으면 무시
        ],
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "이미 존재하는 사용자명 또는 태그입니다.",
        code: "USER_EXISTS",
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 개인정보 암호화
    const encryptedName = encrypt(name) ?? "";
    const encryptedPhone = phone ? encrypt(phone) : null;

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name: encryptedName,
        phone: encryptedPhone,
        tag: tag || null,
        role: role || "STUDENT",
        tier: tier || 3,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        name: decrypt(newUser.name),
        role: newUser.role,
        tier: newUser.tier,
      },
      message: "사용자가 생성되었습니다.",
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      error: "사용자 생성 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

// 사용자 수정 (Tier 1,2만 가능)
export async function updateUserHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user || req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "FORBIDDEN",
      });
    }

    const { userId } = req.params;
    const { name, phone, tag, role, tier, password } = req.body;

    const updateData: any = {};

    if (name) updateData.name = encrypt(name);
    if (phone !== undefined) updateData.phone = phone ? encrypt(phone) : null;
    if (tag !== undefined) updateData.tag = tag || null;
    if (role) updateData.role = role;
    if (tier !== undefined) updateData.tier = tier;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: decrypt(updatedUser.name),
        role: updatedUser.role,
        tier: updatedUser.tier,
      },
      message: "사용자 정보가 수정되었습니다.",
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      error: "사용자 정보 수정 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

// 사용자 삭제 (Tier 1만 가능)
export async function deleteUserHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user || req.user.tier > 1) {
      return res.status(403).json({
        success: false,
        error: "최고 관리자만 사용자를 삭제할 수 있습니다.",
        code: "FORBIDDEN",
      });
    }

    const { userId } = req.params;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: "사용자가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      error: "사용자 삭제 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}
