import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.io connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.io disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 채팅방 참가
  joinRoom(roomId: string) {
    this.socket?.emit('chat:join-room', roomId);
  }

  // 채팅방 나가기
  leaveRoom(roomId: string) {
    this.socket?.emit('chat:leave-room', roomId);
  }

  // 메시지 전송
  sendMessage(roomId: string, content: string, messageId: string) {
    this.socket?.emit('chat:send-message', { roomId, content, messageId });
  }

  // 타이핑 표시
  sendTyping(roomId: string) {
    this.socket?.emit('chat:typing', roomId);
  }

  // 새 메시지 수신
  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('chat:new-message', callback);
  }

  // 타이핑 중 수신
  onUserTyping(callback: (data: { userId: string; username: string }) => void) {
    this.socket?.on('chat:user-typing', callback);
  }

  // 출석 알림 수신
  onAttendanceNotify(callback: (data: { studentName: string; time: string }) => void) {
    this.socket?.on('attendance:new-checkin', callback);
  }

  // 리스너 제거
  off(event: string) {
    this.socket?.off(event);
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
