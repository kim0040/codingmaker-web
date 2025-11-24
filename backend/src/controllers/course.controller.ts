import { Request, Response } from "express";
import prisma from "../config/database.js";
import { AuthRequest } from "../types/express.js";

function ensureAdmin(user: AuthRequest["user"], tiers: number[] = [1, 2]) {
  if (!user || !tiers.includes(user.tier)) {
    return {
      status: 403,
      body: {
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      },
    } as const;
  }
  return null;
}

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
        sections: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
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
      sections: course.sections?.map((section: any) => ({
        id: section.id,
        title: section.title,
        order: section.order,
        lessons: section.lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
          unlockDay: lesson.unlockDay,
        })),
      })),
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
    const denied = ensureAdmin(req.user);
    if (denied) return res.status(denied.status).json(denied.body);

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
    const denied = ensureAdmin(req.user);
    if (denied) return res.status(denied.status).json(denied.body);

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
    const denied = ensureAdmin(req.user, [1]);
    if (denied) return res.status(denied.status).json(denied.body);

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

export async function createSectionHandler(req: AuthRequest, res: Response) {
  try {
    const denied = ensureAdmin(req.user);
    if (denied) return res.status(denied.status).json(denied.body);

    const { courseId } = req.params;
    const { title, order } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "섹션 제목을 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    const currentSectionCount = await prisma.section.count({
      where: { courseId },
    });

    const section = await prisma.section.create({
      data: {
        title,
        courseId,
        order: order ?? currentSectionCount,
      },
      include: { lessons: true },
    });

    res.status(201).json({
      success: true,
      data: section,
      message: "섹션이 생성되었습니다.",
    });
  } catch (error) {
    console.error("Create section error:", error);
    res.status(500).json({
      success: false,
      error: "섹션 생성 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function createLessonHandler(req: AuthRequest, res: Response) {
  try {
    const denied = ensureAdmin(req.user);
    if (denied) return res.status(denied.status).json(denied.body);

    const { sectionId } = req.params;
    const { title, unlockDay = 0, content, order } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "레슨 제목을 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    const currentLessonCount = await prisma.lesson.count({
      where: { sectionId },
    });

    const lesson = await prisma.lesson.create({
      data: {
        sectionId,
        title,
        content,
        unlockDay,
        order: order ?? currentLessonCount,
      },
    });

    res.status(201).json({
      success: true,
      data: lesson,
      message: "레슨이 생성되었습니다.",
    });
  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({
      success: false,
      error: "레슨 생성 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function reorderCurriculumHandler(req: AuthRequest, res: Response) {
  try {
    const denied = ensureAdmin(req.user);
    if (denied) return res.status(denied.status).json(denied.body);

    const { courseId } = req.params;
    const { sections } = req.body as {
      sections: { id: string; order: number; lessons?: { id: string; order: number }[] }[];
    };

    if (!Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        error: "섹션 정렬 데이터가 필요합니다.",
        code: "VALIDATION_ERROR",
      });
    }

    const updates: Promise<unknown>[] = [];

    for (const section of sections) {
      updates.push(
        prisma.section.updateMany({
          where: { id: section.id, courseId },
          data: { order: section.order },
        })
      );

      if (section.lessons) {
        for (const lesson of section.lessons) {
          updates.push(
            prisma.lesson.update({
              where: { id: lesson.id },
              data: { order: lesson.order },
            })
          );
        }
      }
    }

    await Promise.all(updates);

    res.json({
      success: true,
      message: "커리큘럼 순서가 업데이트되었습니다.",
    });
  } catch (error) {
    console.error("Reorder curriculum error:", error);
    res.status(500).json({
      success: false,
      error: "커리큘럼 순서 저장 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function getCourseStructureHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "강좌를 찾을 수 없습니다.",
        code: "NOT_FOUND",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Get course structure error:", error);
    res.status(500).json({
      success: false,
      error: "커리큘럼을 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}
