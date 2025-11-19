"use client";

import { parentSidebar, childProfile } from "@/data/parent";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const consultHistory = [
  {
    date: "2024-11-10",
    instructor: "박해커 강사님",
    topic: "학습 진도 상담",
    summary: "알고리즘 이해도가 높으며, 실습 과제를 성실히 수행하고 있습니다.",
  },
  {
    date: "2024-10-15",
    instructor: "박해커 강사님",
    topic: "중간 평가 피드백",
    summary: "기초 문법은 잘 이해하고 있으나, 복잡한 문제 해결 시 추가 연습이 필요합니다.",
  },
];

export default function ParentConsultPage() {
  return (
    <DashboardLayout
      userName="김학부모"
      userSubtitle="CodingMaker Academy"
      sidebarItems={parentSidebar}
      headerTitle="상담 관리"
      headerSubtitle="강사님과의 상담 내역 및 문의"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>상담 신청</CardTitle>
                <CardDescription>강사님과 상담을 예약하세요</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">희망 날짜</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">희망 시간</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2">
                  <option>14:00 - 15:00</option>
                  <option>15:00 - 16:00</option>
                  <option>16:00 - 17:00</option>
                  <option>17:00 - 18:00</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">상담 주제</label>
              <Input placeholder="예: 학습 진도, 성적 상담, 진로 상담 등" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">문의 내용</label>
              <textarea
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[120px]"
                placeholder="상담하고 싶은 내용을 자세히 적어주세요"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => alert('상담 신청이 완료되었습니다. 강사님께서 확인 후 연락드릴 예정입니다.')}>
                상담 신청하기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>상담 내역</CardTitle>
            <CardDescription>지난 상담 기록을 확인하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultHistory.map((consult, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-muted/50 p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                    <p className="font-semibold text-foreground">{consult.date}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{consult.instructor}</span>
                </div>
                <p className="font-medium text-foreground">{consult.topic}</p>
                <p className="text-sm text-muted-foreground">{consult.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
