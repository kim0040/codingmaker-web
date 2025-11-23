"use client";

import { parentSidebar, childProfile } from "@/data/parent";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ParentChildPage() {
  return (
    <DashboardLayout
      userName="김학부모"
      userSubtitle="CodingMaker Academy"
      sidebarItems={parentSidebar}
      headerTitle="자녀 정보"
      headerSubtitle={`${childProfile.name} 학생의 상세 정보`}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>자녀의 기본 정보를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">이름</label>
                <p className="text-base font-semibold text-foreground">{childProfile.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">학년</label>
                <p className="text-base font-semibold text-foreground">중학교 2학년</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">등록일</label>
                <p className="text-base font-semibold text-foreground">2024년 3월 2일</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">수강 기간</label>
                <p className="text-base font-semibold text-foreground">6개월</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>학습 진행 상황</CardTitle>
            <CardDescription>현재까지의 학습 성과를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2 text-center">
                <div className="text-3xl font-bold text-primary">85%</div>
                <p className="text-sm text-muted-foreground">전체 출석률</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-3xl font-bold text-green-600">12개</div>
                <p className="text-sm text-muted-foreground">완료한 과제</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-3xl font-bold text-accent">2개</div>
                <p className="text-sm text-muted-foreground">진행 중인 프로젝트</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>강사 평가</CardTitle>
            <CardDescription>강사님의 학습 피드백</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground">박해커 강사님</p>
                    <p className="text-xs text-muted-foreground">2024.11.15</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    알고리즘 이해도가 높고, 스스로 문제를 해결하려는 의지가 강합니다. 
                    앞으로도 꾸준히 학습하면 좋은 결과가 있을 것으로 기대됩니다.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
