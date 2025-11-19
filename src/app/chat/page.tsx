"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { studentSidebar } from "@/data/student";
import { Button } from "@/components/ui/button";
import { UserProfilePopup } from "@/components/UserProfilePopup";

// Mock 채팅방 목록
const mockChatRooms = [
  { id: 1, name: "Alpha 클래스", type: "group", unread: 3, lastMessage: "내일 수업 있나요?", lastTime: "15:30", avatar: "👥" },
  { id: 2, name: "박해커 강사님", type: "dm", unread: 1, lastMessage: "과제 확인했습니다", lastTime: "14:20", avatar: "👨‍🏫" },
  { id: 3, name: "프로젝트 팀", type: "group", unread: 0, lastMessage: "좋습니다!", lastTime: "12:05", avatar: "💻" },
  { id: 4, name: "이디자인", type: "dm", unread: 0, lastMessage: "UI 수정했어요", lastTime: "11:30", avatar: "🎨" },
];

// Mock 메시지
const mockMessages = [
  { id: 1, author: "박해커", content: "안녕하세요! 과제 제출했습니다.", time: "14:15", isMine: false, avatar: "👨‍🏫" },
  { id: 2, author: "나", content: "네, 확인했습니다. 잘 작성하셨네요!", time: "14:18", isMine: true },
  { id: 3, author: "박해커", content: "감사합니다! 다음 강의는 언제인가요?", time: "14:19", isMine: false, avatar: "👨‍🏫" },
  { id: 4, author: "나", content: "다음 주 월요일 2시입니다.", time: "14:20", isMine: true },
  { id: 5, author: "박해커", content: "알겠습니다! 준비해서 갈게요 😊", time: "14:20", isMine: false, avatar: "👨‍🏫" },
];

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState(mockChatRooms[1]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      author: "나",
      content: message,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    inputRef.current?.focus();
  };

  return (
    <DashboardLayout
      userName="김코딩"
      userSubtitle="메시지"
      sidebarItems={studentSidebar}
      bottomNavItems={[
        studentSidebar[0], // 대시보드
        studentSidebar[1], // 내 클래스
        studentSidebar[2], // 프로젝트
        studentSidebar[3], // LMS 강의실
        studentSidebar[5], // 채팅
      ]}
      headerTitle="채팅"
      headerSubtitle="팀원들과 소통하세요"
    >
      <div className="flex h-[calc(100vh-20rem)] lg:h-[calc(100vh-12rem)] gap-4 pb-4 lg:pb-4">
        {/* 채팅방 목록 (카톡/슬랙 스타일) */}
        <div className="hidden lg:block w-80 flex-shrink-0 border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="채팅방 검색..."
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => alert('새 채팅방 만들기 기능은 백엔드 연결 후 사용 가능합니다.')}
              >
                <span className="material-symbols-outlined">add</span>
              </Button>
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-73px)]">
            {mockChatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border ${
                  selectedRoom.id === room.id ? 'bg-primary/5' : ''
                }`}
              >
                <div className="text-3xl flex-shrink-0">{room.avatar}</div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground">{room.name}</span>
                    <span className="text-xs text-muted-foreground">{room.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate flex-1">
                      {room.lastMessage}
                    </p>
                    {room.unread > 0 && (
                      <span className="ml-2 flex-shrink-0 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {room.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 채팅 메시지 영역 */}
        <div className="flex-1 flex flex-col border border-border rounded-xl bg-card overflow-hidden">
          {/* 채팅방 헤더 */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => alert('채팅방 목록')}
                >
                  <span className="material-symbols-outlined">menu</span>
                </Button>
              </div>
              <span className="text-2xl">{selectedRoom.avatar}</span>
              <div>
                <h2 className="font-bold text-foreground">{selectedRoom.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedRoom.type === 'group' ? '그룹 채팅' : '1:1 채팅'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => alert(`${selectedRoom.name}과(와) 음성 통화를 시작합니다.`)}
              >
                <span className="material-symbols-outlined">call</span>
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => alert('채팅방 설정을 표시합니다.')}
              >
                <span className="material-symbols-outlined">more_vert</span>
              </Button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.isMine ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!msg.isMine && (
                  <button 
                    onClick={() => setSelectedUser(msg.author)}
                    className="text-2xl flex-shrink-0 hover:scale-110 transition-transform"
                  >
                    {msg.avatar}
                  </button>
                )}
                <div className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  {!msg.isMine && (
                    <button
                      onClick={() => setSelectedUser(msg.author)}
                      className="text-xs text-muted-foreground mb-1 px-2 hover:text-primary hover:underline"
                    >
                      {msg.author}
                    </button>
                  )}
                  <div className="flex items-end gap-2">
                    {msg.isMine && (
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.isMine
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-card border border-border rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    {!msg.isMine && (
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 (모바일 최적화) */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex items-end gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="flex-shrink-0"
                onClick={() => alert('파일 첨부, 이미지 공유 등을 할 수 있습니다.')}
              >
                <span className="material-symbols-outlined">add</span>
              </Button>
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="메시지를 입력하세요..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm resize-none focus:border-primary focus:outline-none max-h-32"
                  rows={1}
                  onFocus={(e) => {
                    // 모바일에서 키보드 나올 때 스크롤
                    setTimeout(() => {
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="flex-shrink-0"
              >
                <span className="material-symbols-outlined">send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 유저 프로필 팝업 */}
      {selectedUser && (
        <UserProfilePopup
          userName={selectedUser}
          userRole="커뮤니티 회원"
          onClose={() => setSelectedUser(null)}
        />
      )}
    </DashboardLayout>
  );
}
