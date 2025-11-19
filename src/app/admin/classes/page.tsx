"use client";

import { adminSidebar } from "@/data/admin";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const classes = [
  { name: "Alpha 클래스", students: 8, instructor: "이선생님", schedule: "월/수/금 14:00-15:30", status: "진행중" },
  { name: "Beta 클래스", students: 6, instructor: "박선생님", schedule: "화/목 16:00-17:30", status: "진행중" },
  { name: "Gamma 클래스", students: 7, instructor: "최선생님", schedule: "월/수 18:00-19:30", status: "진행중" },
  { name: "Delta 클래스", students: 5, instructor: "정선생님", schedule: "토 14:00-17:00", status: "대기중" },
];

export default function AdminClassesPage() {
  return (
    <DashboardLayout
      userName="김 원장"
      userSubtitle="코딩메이커 아카데미"
      sidebarItems={adminSidebar}
      headerTitle="클래스 관리"
      headerSubtitle="전체 클래스 현황을 관리하세요"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">전체 클래스</h2>
            <p className="text-sm text-muted-foreground">총 {classes.length}개 클래스 운영 중</p>
          </div>
          <Button onClick={() => alert('클래스 추가 기능은 백엔드 연결 후 사용 가능합니다.')}>
            <span className="material-symbols-outlined text-base">add</span>
            새 클래스 추가
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card key={cls.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <CardDescription>{cls.instructor}</CardDescription>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    cls.status === "진행중" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {cls.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="material-symbols-outlined text-base">groups</span>
                  <span>학생 {cls.students}명</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>{cls.schedule}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" size="sm" onClick={() => alert('클래스 상세 정보는 추후 추가될 예정입니다.')}>
                    상세보기
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => alert('클래스 수정 기능은 백엔드 연결 후 사용 가능합니다.')}>
                    <span className="material-symbols-outlined text-base">edit</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
