"use client";

import { studentSidebar, myClasses } from "@/data/student";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentClassesPage() {
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
      headerTitle="내 클래스"
      headerSubtitle="진행 중인 모든 강의를 확인하세요"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>수강 중인 클래스</CardTitle>
            <CardDescription>현재 진행 중인 강의 목록입니다</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myClasses.map((cls) => (
              <div key={cls.title} className="flex flex-col rounded-xl border border-border/60 bg-card overflow-hidden">
                <div
                  className="aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url(${cls.image})` }}
                ></div>
                <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                  <div>
                    <p className="text-base font-semibold text-foreground">{cls.title}</p>
                    <p className="text-sm text-muted-foreground">
                      강사: {cls.teacher} · {cls.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => window.location.href = '/lms'}>
                      강의실 입장
                    </Button>
                    <Button variant="outline" onClick={() => alert('과제 제출 기능은 백엔드 연결 후 사용 가능합니다.')}>
                      과제
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>완료한 클래스</CardTitle>
            <CardDescription>지난 학기에 수강 완료한 강의</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
              <p>완료한 클래스가 없습니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
