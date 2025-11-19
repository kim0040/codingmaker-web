"use client";

import { studentSidebar, studentNotifications } from "@/data/student";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentNotificationsPage() {
  return (
    <DashboardLayout
      userName="김코딩"
      userSubtitle="CodingMaker Academy"
      sidebarItems={studentSidebar}
      bottomNavItems={[
        studentSidebar[0], // 대시보드
        studentSidebar[1], // 내 클래스
        studentSidebar[2], // 프로젝트
        studentSidebar[3], // LMS 강의실
        studentSidebar[5], // 채팅
      ]}
      headerTitle="알림"
      headerSubtitle="중요한 소식과 공지사항을 확인하세요"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>전체 알림</CardTitle>
              <CardDescription>최근 알림 목록입니다</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => alert('모두 읽음 처리되었습니다.')}>
              모두 읽음
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentNotifications.map((notification, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                  notification.unread
                    ? "border-primary/20 bg-primary/5"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div className={`flex size-10 items-center justify-center rounded-full ${
                  notification.unread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <span className="material-symbols-outlined text-xl">{notification.icon}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-semibold ${notification.unread ? "text-foreground" : "text-muted-foreground"}`}>
                      {notification.title}
                      {notification.unread && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                          New
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    자세한 내용은 공지사항을 확인해주세요.
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>알림 설정</CardTitle>
            <CardDescription>받고 싶은 알림 유형을 선택하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "공지사항", description: "학원의 중요 공지" },
              { label: "과제 알림", description: "과제 제출 마감일 알림" },
              { label: "메시지", description: "강사님의 메시지" },
              { label: "출석 알림", description: "출석 체크 알림" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`${item.label} 설정이 변경되었습니다.`)}
                >
                  켜기
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
