"use client";

import {
  studentSidebar,
  myClasses,
  todaysAttendance,
  ongoingProjects,
  studentNotifications,
} from "@/data/student";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentDashboardPage() {
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
      headerTitle="학생 대시보드"
      headerSubtitle="오늘도 목표를 향해 함께 나아가요!"
    >
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>내 클래스</CardTitle>
                <CardDescription>진행 예정인 강의 일정</CardDescription>
              </div>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => alert('전체 클래스 페이지는 추후 추가될 예정입니다.')}>
                전체 클래스 보기
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {myClasses.map((cls) => (
                <div key={cls.title} className="flex flex-col rounded-xl border border-border/60 bg-white dark:bg-[#111a22]">
                  <div
                    className="aspect-video rounded-t-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${cls.image})` }}
                  ></div>
                  <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                    <div>
                      <p className="text-base font-semibold text-foreground">{cls.title}</p>
                      <p className="text-sm text-muted-foreground">
                        강사: {cls.teacher} · {cls.date}
                      </p>
                    </div>
                    <Button className="w-full" onClick={() => window.location.href = '/lms'}>강의실 바로가기</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>오늘의 출결</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 text-center">
                <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
                <p className="text-xl font-bold text-foreground">{todaysAttendance.status}</p>
                <p className="text-sm text-muted-foreground">{todaysAttendance.time}에 처리되었습니다.</p>
                <Button variant="outline" onClick={() => alert('출결 내역 페이지는 추후 추가될 예정입니다.')}>출결 내역 보기</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>진행 중인 프로젝트</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ongoingProjects.map((project) => (
                  <div key={project.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-semibold text-foreground">{project.name}</p>
                      <span className="text-muted-foreground">마감: {project.due}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${project.accent === "accent" ? "bg-accent" : "bg-primary"}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/collab'}>
                  프로젝트 허브로 이동
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>알림 및 공지사항</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentNotifications.map((notification) => (
              <button
                key={notification.title}
                onClick={() => alert(`${notification.title}\n\n자세한 내용은 알림 페이지에서 확인하세요.`)}
                className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors ${notification.unread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted"}`}
              >
                <div className="mt-1 flex-shrink-0">
                  <span
                    className={`material-symbols-outlined text-2xl ${
                      notification.unread ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {notification.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}
