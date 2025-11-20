import { Request, Response } from "express";
import prisma from "../config/database.js";
import { AuthRequest } from "../types/express.js";
import { encrypt, decrypt } from "../services/crypto.service.js";

// 메시지 삭제 핸들러
export async function deleteMessageHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { messageId } = req.params;

    // 메시지 확인
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { room: true },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "메시지를 찾을 수 없습니다.",
        code: "NOT_FOUND",
      });
    }

    // 권한 확인: 작성자 본인 또는 관리자(Tier 1, 2)
    const isAuthor = message.authorId === req.user.id;
    const isAdmin = req.user.tier <= 2;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "삭제 권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    // 메시지 삭제
    await prisma.message.delete({
      where: { id: messageId },
    });

    res.json({
      success: true,
      message: "메시지가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      error: "메시지 삭제 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function getChatRoomsHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const rooms = await prisma.chatRoom.findMany({
      where: {
        members: {
          some: {
            id: req.user.id,
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            isEncrypted: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                authorId: { not: req.user.id },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedRooms = rooms.map((room: any) => ({
      id: room.id,
      type: room.type,
      name: room.name,
      members: room.members.map((member: any) => ({
        id: member.id,
        name: decrypt(member.name) ?? "사용자",
      })),
      lastMessage: room.messages[0] ? {
        content: room.messages[0].isEncrypted 
          ? decrypt(room.messages[0].content) ?? ""
          : room.messages[0].content,
        createdAt: room.messages[0].createdAt,
      } : null,
      unreadCount: room._count.messages,
    }));

    res.json({
      success: true,
      data: { rooms: formattedRooms },
    });
  } catch (error) {
    console.error("Get chat rooms error:", error);
    res.status(500).json({
      success: false,
      error: "채팅방 목록을 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function createChatRoomHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { type, name, memberIds } = req.body;

    if (!type || !memberIds || !Array.isArray(memberIds)) {
      return res.status(400).json({
        success: false,
        error: "필수 항목을 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    // 1:1 DM인 경우 기존 방 확인
    if (type === "dm" && memberIds.length === 1) {
      const existing = await prisma.chatRoom.findFirst({
        where: {
          type: "dm",
          members: {
            every: {
              OR: [
                { id: req.user.id },
                { id: memberIds[0] },
              ],
            },
          },
        },
      });

      if (existing) {
        return res.json({
          success: true,
          data: { id: existing.id, existed: true },
          message: "기존 채팅방을 사용합니다.",
        });
      }
    }

    const room = await prisma.chatRoom.create({
      data: {
        type,
        name,
        members: {
          connect: [
            { id: req.user.id },
            ...memberIds.map((id: string) => ({ id })),
          ],
        },
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: room.id,
        type: room.type,
        name: room.name,
        members: room.members.map((member: any) => ({
          id: member.id,
          name: decrypt(member.name) ?? "사용자",
        })),
        createdAt: room.createdAt,
      },
      message: "채팅방이 생성되었습니다.",
    });
  } catch (error) {
    console.error("Create chat room error:", error);
    res.status(500).json({
      success: false,
      error: "채팅방 생성 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function getMessagesHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { roomId } = req.params;
    const { page = "1", limit = "50" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // 채팅방 멤버 확인
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        members: {
          some: {
            id: req.user.id,
          },
        },
      },
    });

    if (!room) {
      return res.status(403).json({
        success: false,
        error: "접근 권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { roomId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.message.count({ where: { roomId } }),
    ]);

    const formattedMessages = messages.map((message: any) => ({
      id: message.id,
      content: message.isEncrypted 
        ? decrypt(message.content) ?? ""
        : message.content,
      author: {
        id: message.author.id,
        name: decrypt(message.author.name) ?? "사용자",
      },
      isRead: message.isRead,
      createdAt: message.createdAt,
    })).reverse(); // 시간 순으로 정렬

    res.json({
      success: true,
      data: {
        messages: formattedMessages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      error: "메시지를 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}

export async function sendMessageHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    const { roomId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: "메시지 내용을 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    // 채팅방 확인
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        members: {
          some: {
            id: req.user.id,
          },
        },
      },
    });

    if (!room) {
      return res.status(403).json({
        success: false,
        error: "접근 권한이 없습니다.",
        code: "PERMISSION_DENIED",
      });
    }

    // 1:1 DM일 경우 암호화
    const shouldEncrypt = room.type === "dm";
    const encryptedContent = shouldEncrypt ? (encrypt(content) ?? content) : content;

    const message = await prisma.message.create({
      data: {
        content: encryptedContent,
        roomId,
        authorId: req.user.id,
        isEncrypted: shouldEncrypt,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 채팅방 업데이트 시간 갱신
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({
      success: true,
      data: {
        id: message.id,
        content,
        author: {
          id: message.author.id,
          name: decrypt(message.author.name) ?? "사용자",
        },
        createdAt: message.createdAt,
      },
      message: "메시지가 전송되었습니다.",
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      error: "메시지 전송 중 오류가 발생했습니다.",
      code: "SERVER_ERROR",
    });
  }
}
