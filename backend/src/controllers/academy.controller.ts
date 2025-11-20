import { Request, Response } from "express";
import prisma from "../config/database.js";
import { AuthRequest } from "../types/express.js";

export async function getAcademyInfoHandler(req: Request, res: Response) {
  try {
    const info = await prisma.academyInfo.findMany();

    const infoObject = info.reduce((acc: Record<string, string>, item: { key: string; value: string }) => {
      const key = item.key.replace("INFO_", "").toLowerCase();
      acc[key] = item.value;
      return acc;
    }, {} as Record<string, string>);

    res.json({
      success: true,
      data: infoObject,
    });
  } catch (error) {
    console.error("Get academy info error:", error);
    res.status(500).json({
      success: false,
      error: "학원 정보를 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function updateAcademyInfoHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user || req.user.tier !== 1) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    const updates = req.body;
    const updatePromises = Object.entries(updates).map(([key, value]) => {
      const dbKey = `INFO_${key.toUpperCase()}`;
      return prisma.academyInfo.upsert({
        where: { key: dbKey },
        update: { value: value as string },
        create: { key: dbKey, value: value as string },
      });
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: "학원 정보가 수정되었습니다.",
    });
  } catch (error) {
    console.error("Update academy info error:", error);
    res.status(500).json({
      success: false,
      error: "학원 정보 수정 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}
