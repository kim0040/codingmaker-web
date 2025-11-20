import { Request, Response } from "express";
import prisma from "../config/database.js";
import { AuthRequest } from "../types/express.js";
import { decrypt } from "../services/crypto.service.js";

// 게시글 삭제 핸들러
export async function deletePostHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { id } = req.params;

    // 게시글 확인
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "게시글을 찾을 수 없습니다.",
        code: "NOT_FOUND",
      });
    }

    // 권한 확인: 작성자 본인 또는 관리자(Tier 1, 2)
    const isAuthor = post.authorId === req.user.id;
    const isAdmin = req.user.tier <= 2;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "삭제 권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    // 게시글 삭제 (Cascade로 댓글도 함께 삭제됨)
    await prisma.post.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "게시글이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      error: "게시글 삭제 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

// 댓글 삭제 핸들러
export async function deleteCommentHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { commentId } = req.params;

    // 댓글 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "댓글을 찾을 수 없습니다.",
        code: "NOT_FOUND",
      });
    }

    // 권한 확인: 작성자 본인 또는 관리자(Tier 1, 2)
    const isAuthor = comment.authorId === req.user.id;
    const isAdmin = req.user.tier <= 2;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "삭제 권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.json({
      success: true,
      message: "댓글이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      error: "댓글 삭제 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function getPostsHandler(req: Request, res: Response) {
  try {
    const { page = "1", category, sort = "latest", limit = "10" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      ...(category && category !== "all" && { category: category as string }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, role: true } },
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: sort === "popular" ? { views: "desc" } : { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.post.count({ where }),
    ]);

    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      author: {
        id: post.author.id,
        name: decrypt(post.author.name) ?? "사용자",
        role: post.author.role,
      },
      category: post.category,
      views: post.views,
      likes: post._count.likes,
      commentCount: post._count.comments,
      createdAt: post.createdAt,
      isPinned: post.isPinned,
    }));

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      error: "게시글을 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function getPostHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, role: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true } },
            _count: { select: { likes: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { likes: true } },
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "게시글을 찾을 수 없습니다.",
        code: "POST_NOT_FOUND",
      });
    }

    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        name: decrypt(post.author.name) ?? "사용자",
        role: post.author.role,
      },
      category: post.category,
      views: post.views + 1,
      likes: post._count.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      comments: post.comments.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        author: {
          id: comment.author.id,
          name: decrypt(comment.author.name) ?? "사용자",
        },
        likes: comment._count.likes,
        createdAt: comment.createdAt,
      })),
    };

    res.json({
      success: true,
      data: formattedPost,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      error: "게시글을 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function createPostHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user || req.user.tier > 3) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "제목과 내용을 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        authorId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: { id: post.id, title: post.title, createdAt: post.createdAt },
      message: "게시글이 작성되었습니다.",
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      error: "게시글 작성 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function likePostHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { id } = req.params;

    const existing = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: req.user.id,
        },
      },
    });

    if (existing) {
      await prisma.postLike.delete({
        where: { id: existing.id },
      });

      const likeCount = await prisma.postLike.count({
        where: { postId: id },
      });

      return res.json({
        success: true,
        data: { likes: likeCount, isLiked: false },
        message: "추천을 취소했습니다.",
      });
    }

    await prisma.postLike.create({
      data: {
        postId: id,
        userId: req.user.id,
      },
    });

    const likeCount = await prisma.postLike.count({
      where: { postId: id },
    });

    res.json({
      success: true,
      data: { likes: likeCount, isLiked: true },
      message: "추천했습니다.",
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({
      success: false,
      error: "추천 처리 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function createCommentHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: "댓글 내용을 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: comment.id,
        content: comment.content,
        author: {
          id: comment.author.id,
          name: decrypt(comment.author.name) ?? "사용자",
        },
        createdAt: comment.createdAt,
      },
      message: "댓글이 작성되었습니다.",
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({
      success: false,
      error: "댓글 작성 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}
