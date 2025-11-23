"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { socketService } from "@/lib/socket";

interface Message {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  isRead: boolean;
}

interface ChatUIProps {
  roomId: string;
}

export function ChatUI({ roomId }: ChatUIProps) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!token) return;

    try {
      const response: any = await api.get(
        `/chat/rooms/${roomId}/messages?page=1&limit=50`,
        token
      );
      if (response.success && response.data?.messages) {
        setMessages(response.data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, roomId]);

  useEffect(() => {
    if (!token || !roomId) return;

    // Socket.io 연결
    socketService.connect(token);
    socketService.joinRoom(roomId);

    // 메시지 내역 로드
    fetchMessages();

    // 새 메시지 수신
    socketService.onNewMessage((message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socketService.leaveRoom(roomId);
      socketService.off("chat:new-message");
    };
  }, [token, roomId, fetchMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !token || isSending) return;

    setIsSending(true);
    const tempMessage = newMessage;
    setNewMessage("");

    try {
      const response: any = await api.post(
        `/chat/rooms/${roomId}/messages`,
        { content: tempMessage },
        token
      );

      if (response.success && response.data) {
        // Socket.io를 통해 실시간 전송
        socketService.sendMessage(roomId, tempMessage, response.data.id);
        
        // 로컬 상태에 추가
        setMessages((prev) => [...prev, response.data]);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setNewMessage(tempMessage); // 실패 시 메시지 복원
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">메시지를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.author.id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.author.id === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.author.id !== user?.id && (
                  <p className="text-xs font-semibold mb-1 opacity-70">
                    {message.author.name}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p className="text-xs mt-1 opacity-60">
                  {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="메시지를 입력하세요..."
            disabled={isSending}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <span className="material-symbols-outlined animate-spin">
                refresh
              </span>
            ) : (
              <span className="material-symbols-outlined">send</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
