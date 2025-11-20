import { Request, Response } from "express";
import prisma from "../config/database.js";
import { AuthRequest } from "../types/express.js";

export async function getCoursesHandler(req: Request, res: Response) {
  try {
    const { category } = req.query;

    const courses = await prisma.course.findMany({
      where: {
        ...(category && category !== "all" && { category: category as string }),
        isActive: true,
      },
      include: {
        _count: {
          select: { enrolledUsers: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedCourses = courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      category: course.category,
      description: course.description,
      instructor: course.instructor,
      schedule: course.schedule,
      isActive: course.isActive,
      enrolledCount: course._count.enrolledUsers,
    }));

    res.json({
      success: true,
      data: { courses: formattedCourses },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      success: false,
      error: "커리큘럼을 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function createCourseHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user || req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    const { title, category, description, instructor, schedule } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        error: "필수 항목을 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    const course = await prisma.course.create({
      data: {
        title,
        category,
        description,
        instructor,
        schedule,
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      data: { id: course.id, title: course.title },
      message: "커리큘럼이 생성되었습니다.",
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      error: "커리큘럼 생성 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function updateCourseHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user || req.user.tier > 2) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    const { id } = req.params;
    const { title, category, description, instructor, schedule, isActive } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(instructor !== undefined && { instructor }),
        ...(schedule !== undefined && { schedule }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({
      success: true,
      data: course,
      message: "커리큘럼이 수정되었습니다.",
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      error: "커리큘럼 수정 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function deleteCourseHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user || req.user.tier > 1) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    const { id } = req.params;

    await prisma.course.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "커리큘럼이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      error: "커리큘럼 삭제 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}
