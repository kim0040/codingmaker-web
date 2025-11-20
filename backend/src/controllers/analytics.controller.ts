import { Response } from "express";
import prisma from "../config/database.js";
import { AuthRequest } from "../types/express.js";

// 출석 통계
export async function getAttendanceStatsHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    // Tier 1, 2만 접근 가능
    if (req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    const { days = "30" } = req.query;
    const daysNum = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // 일별 출석 통계
    const dailyStats = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE(date) as date,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'ATTENDED' THEN 1 ELSE 0 END) as attended,
        SUM(CASE WHEN status = 'LATE' THEN 1 ELSE 0 END) as late,
        SUM(CASE WHEN status = 'ABSENT' THEN 1 ELSE 0 END) as absent
      FROM Attendance
      WHERE date >= ${startDate.toISOString()}
      GROUP BY DATE(date)
      ORDER BY date DESC
    `;

    // 전체 통계
    const totalStats = await prisma.attendance.groupBy({
      by: ["status"],
      _count: { status: true },
      where: {
        date: { gte: startDate },
      },
    });

    // 학생별 출석률
    const studentStats = await prisma.user.findMany({
      where: {
        tier: { gte: 3 },
        role: "STUDENT",
      },
      select: {
        id: true,
        name: true,
        attendance: {
          where: { date: { gte: startDate } },
          select: { status: true },
        },
      },
      take: 10,
      orderBy: {
        attendance: { _count: "desc" },
      },
    });

    res.json({
      success: true,
      data: {
        dailyStats,
        totalStats,
        studentStats: studentStats.map((student: any) => ({
          id: student.id,
          name: student.name,
          totalDays: student.attendance.length,
          attendedDays: student.attendance.filter((a: any) => a.status === "ATTENDED")
            .length,
          rate:
            student.attendance.length > 0
              ? (
                  (student.attendance.filter((a: any) => a.status === "ATTENDED")
                    .length /
                    student.attendance.length) *
                  100
                ).toFixed(1)
              : "0.0",
        })),
      },
    });
  } catch (error) {
    console.error("Get attendance stats error:", error);
    res.status(500).json({
      success: false,
      error: "통계 조회 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

// 커뮤니티 통계
export async function getCommunityStatsHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    if (req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    // 전체 게시글/댓글 수
    const [totalPosts, totalComments, totalUsers] = await Promise.all([
      prisma.post.count(),
      prisma.comment.count(),
      prisma.user.count(),
    ]);

    // 카테고리별 게시글 수
    const postsByCategory = await prisma.post.groupBy({
      by: ["category"],
      _count: { category: true },
    });

    // 최근 활동 (최근 30일)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPosts = await prisma.post.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    const recentComments = await prisma.comment.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    // 인기 게시글 (조회수 기준)
    const popularPosts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        views: true,
        _count: {
          select: { comments: true, likes: true },
        },
      },
      orderBy: { views: "desc" },
      take: 5,
    });

    // 활동적인 사용자
    const activeUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { posts: true, comments: true },
        },
      },
      where: {
        OR: [
          { posts: { some: { createdAt: { gte: thirtyDaysAgo } } } },
          { comments: { some: { createdAt: { gte: thirtyDaysAgo } } } },
        ],
      },
      take: 10,
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalPosts,
          totalComments,
          totalUsers,
          recentPosts,
          recentComments,
        },
        postsByCategory,
        popularPosts,
        activeUsers,
      },
    });
  } catch (error) {
    console.error("Get community stats error:", error);
    res.status(500).json({
      success: false,
      error: "통계 조회 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

// 사용자 통계
export async function getUserStatsHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    if (req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    // 역할별 사용자 수
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    // 티어별 사용자 수
    const usersByTier = await prisma.user.groupBy({
      by: ["tier"],
      _count: { tier: true },
    });

    // 최근 가입자 (최근 30일)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    // 월별 가입자 추이 (최근 6개월)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySignups = await prisma.$queryRaw<any[]>`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as count
      FROM User
      WHERE createdAt >= ${sixMonthsAgo.toISOString()}
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month DESC
    `;

    res.json({
      success: true,
      data: {
        usersByRole,
        usersByTier,
        recentUsers,
        monthlySignups,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      error: "통계 조회 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

// 종합 대시보드 통계
export async function getDashboardStatsHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    if (req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 오늘 출석 현황
    const todayAttendance = await prisma.attendance.count({
      where: { date: { gte: today } },
    });

    // 전체 학생 수
    const totalStudents = await prisma.user.count({
      where: { role: "STUDENT" },
    });

    // 오늘 작성된 게시글
    const todayPosts = await prisma.post.count({
      where: { createdAt: { gte: today } },
    });

    // 활성 커리큘럼 수
    const activeCourses = await prisma.course.count({
      where: { isActive: true },
    });

    // 최근 7일 출석 추이
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyAttendance = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE(date) as date,
        COUNT(*) as count
      FROM Attendance
      WHERE date >= ${sevenDaysAgo.toISOString()}
      GROUP BY DATE(date)
      ORDER BY date ASC
    `;

    res.json({
      success: true,
      data: {
        overview: {
          todayAttendance,
          totalStudents,
          todayPosts,
          activeCourses,
          attendanceRate:
            totalStudents > 0
              ? ((todayAttendance / totalStudents) * 100).toFixed(1)
              : "0.0",
        },
        weeklyAttendance,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      error: "통계 조회 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}
