import { Request, Response } from "express";
import prisma from "../config/database.js";
import { decrypt } from "../services/crypto.service.js";
import { AuthRequest } from "../types/express.js";

export async function checkinHandler(req: Request, res: Response) {
  try {
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({
        success: false,
        error: "태그를 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    const user = await prisma.user.findFirst({
      where: { tag },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "등록되지 않은 태그입니다.",
        code: "ATTENDANCE_TAG_NOT_FOUND",
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        status: "ATTENDED",
        date: new Date(),
      },
    });

    res.json({
      success: true,
      data: {
        studentName: decrypt(user.name) ?? "사용자",
        time: attendance.date,
        status: attendance.status,
      },
      message: "출석 완료!",
    });
  } catch (error) {
    console.error("Attendance check error:", error);
    res.status(500).json({
      success: false,
      error: "출석 처리 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function getUserAttendanceHandler(req: AuthRequest, res: Response) {
  try {
    const { userId } = req.params;
    const { month } = req.query;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    // 본인 또는 관리자만 조회 가능
    if (req.user.id !== userId && req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    const records = await prisma.attendance.findMany({
      where: {
        userId,
        ...(month && {
          date: {
            gte: new Date(`${month}-01`),
            lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)),
          },
        }),
      },
      orderBy: { date: "desc" },
    });

    const stats = {
      attended: records.filter((r: { status: string }) => r.status === "ATTENDED").length,
      late: records.filter((r: { status: string }) => r.status === "LATE").length,
      absent: records.filter((r: { status: string }) => r.status === "ABSENT").length,
      rate: records.length > 0 
        ? ((records.filter((r: { status: string }) => r.status === "ATTENDED" || r.status === "LATE").length / records.length) * 100).toFixed(1)
        : "0.0",
    };

    res.json({
      success: true,
      data: {
        userId,
        month: month || "all",
        records,
        stats,
      },
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({
      success: false,
      error: "출석 내역을 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}
