import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-me-super-secret";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

export function initializeSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // 인증 미들웨어
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("인증 토큰이 필요합니다."));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        username: string;
      };

      socket.userId = decoded.id;
      socket.username = decoded.username;
      next();
    } catch (error) {
      next(new Error("유효하지 않은 토큰입니다."));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.username} (${socket.userId})`);

    // 사용자를 자신의 방에 참가
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // 채팅방 참가
    socket.on("chat:join-room", (roomId: string) => {
      socket.join(`room:${roomId}`);
      console.log(`User ${socket.username} joined room ${roomId}`);
    });

    // 채팅방 나가기
    socket.on("chat:leave-room", (roomId: string) => {
      socket.leave(`room:${roomId}`);
      console.log(`User ${socket.username} left room ${roomId}`);
    });

    // 메시지 전송
    socket.on("chat:send-message", (data: {
      roomId: string;
      content: string;
      messageId: string;
    }) => {
      // 같은 방의 다른 사용자들에게 브로드캐스트
      socket.to(`room:${data.roomId}`).emit("chat:new-message", {
        id: data.messageId,
        content: data.content,
        roomId: data.roomId,
        author: {
          id: socket.userId,
          name: socket.username,
        },
        createdAt: new Date().toISOString(),
      });
    });

    // 타이핑 중 표시
    socket.on("chat:typing", (roomId: string) => {
      socket.to(`room:${roomId}`).emit("chat:user-typing", {
        userId: socket.userId,
        username: socket.username,
      });
    });

    // 출석 알림 (관리자가 브로드캐스트)
    socket.on("attendance:notify", (data: {
      studentName: string;
      time: string;
    }) => {
      io.emit("attendance:new-checkin", data);
    });

    // 연결 해제
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.username}`);
    });
  });

  return io;
}
