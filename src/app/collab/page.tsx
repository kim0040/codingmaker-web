"use client";

import {
  workspaceMeta,
  workspaceNav,
  workspaceSidebar,
  workspaceTeam,
  workspaceMessages,
} from "@/data/workspace";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { studentSidebar } from "@/data/student";

export default function ProjectWorkspacePage() {
  return (
    <DashboardLayout
      userName="김코딩"
      userSubtitle="프로젝트 협업 공간"
      sidebarItems={studentSidebar}
      bottomNavItems={[
        studentSidebar[0], // 대시보드
        studentSidebar[1], // 내 클래스
        studentSidebar[2], // 프로젝트
        studentSidebar[3], // LMS 강의실
        studentSidebar[5], // 채팅
      ]}
      headerTitle="프로젝트 협업"
      headerSubtitle="팀원들과 함께 프로젝트를 진행하세요"
    >
      <div className="flex flex-1 gap-6">
        <aside className="hidden w-72 flex-shrink-0 rounded-2xl border border-border bg-card p-4 lg:block">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-6">
              <div>
                <p className="text-lg font-semibold text-foreground">{workspaceMeta.projectName}</p>
                <p className="text-sm text-muted-foreground">{workspaceMeta.projectSubtitle}</p>
              </div>
              <nav className="space-y-1">
                {workspaceSidebar.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => alert(`${item.label} 기능은 추후 추가될 예정입니다.`)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
              <div>
                <p className="text-sm font-semibold text-foreground">Team Members</p>
                <div className="mt-2 flex -space-x-3">
                  {workspaceTeam.map((avatar) => (
                    <div
                      key={avatar}
                      className="size-10 rounded-full border-2 border-card bg-cover bg-center"
                      style={{ backgroundImage: `url(${avatar})` }}
                    ></div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full" 
                  size="sm"
                  onClick={() => alert('팀원 초대 기능은 백엔드 연결 후 사용 가능합니다.')}
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  팀원 초대
                </Button>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => alert('프로젝트 생성 기능은 백엔드 연결 후 사용 가능합니다.')}
            >
              새 프로젝트 생성
            </Button>
          </div>
        </aside>

        <main className="flex-1 bg-background p-6">
          <div className="mx-auto flex h-full max-w-4xl flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{workspaceMeta.currentView}</h1>
                <p className="text-sm text-muted-foreground">{workspaceMeta.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => alert('검색 기능은 백엔드 연결 후 사용 가능합니다.')}
                >
                  <span className="material-symbols-outlined">search</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => alert('추가 옵션을 표시합니다.')}
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto py-6 pr-2">
              {workspaceMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.align === "right" ? "justify-end" : ""}`}
                >
                  {message.align === "left" && (
                    <div
                      className="size-10 flex-shrink-0 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${message.avatar})` }}
                    ></div>
                  )}
                  <div className="max-w-md space-y-1">
                    <div className={`flex items-baseline gap-2 ${message.align === "right" ? "justify-end" : ""}`}>
                      <p className="font-semibold text-foreground">{message.author}</p>
                      <p className="text-xs text-muted-foreground">{message.time}</p>
                    </div>
                    <p
                      className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                        message.align === "right"
                          ? "rounded-br-none bg-primary text-white"
                          : "rounded-bl-none bg-background text-foreground"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                  {message.align === "right" && (
                    <div
                      className="size-10 flex-shrink-0 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${message.avatar})` }}
                    ></div>
                  )}
                </div>
              ))}
              <div className="text-center">
                <span className="rounded-full bg-muted px-4 py-1 text-xs font-semibold text-muted-foreground">
                  Jane님이 프로젝트에 추가되었습니다
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 bg-background">
              <div className="flex items-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => alert('파일 첨부 기능입니다.')}
                  className="flex-shrink-0"
                >
                  <span className="material-symbols-outlined">attach_file</span>
                </Button>
                <div className="flex-1 relative">
                  <textarea
                    placeholder="메시지를 입력하세요..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm resize-none focus:border-primary focus:outline-none max-h-32"
                    rows={1}
                    onFocus={(e) => {
                      // 모바일에서 키보드 나올 때 부드럽게 스크롤
                      setTimeout(() => {
                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 300);
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        alert('메시지가 전송되었습니다!');
                        (e.target as HTMLTextAreaElement).value = '';
                        (e.target as HTMLTextAreaElement).style.height = 'auto';
                      }
                    }}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => alert('이모티콘 추가 기능입니다.')}
                  className="flex-shrink-0"
                >
                  <span className="material-symbols-outlined">add_reaction</span>
                </Button>
                <Button 
                  size="icon"
                  onClick={() => alert('메시지가 전송되었습니다!')}
                  className="flex-shrink-0"
                >
                  <span className="material-symbols-outlined">send</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
