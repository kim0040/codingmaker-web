"use client";

import { parentSidebar, curriculumSteps, childProfile } from "@/data/parent";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ParentCurriculumPage() {
  return (
    <DashboardLayout
      userName="김학부모"
      userSubtitle="CodingMaker Academy"
      sidebarItems={parentSidebar}
      headerTitle="커리큘럼"
      headerSubtitle={`${childProfile.name} 학생의 학습 진행 상황`}
    >
      <Card>
        <CardHeader>
          <CardTitle>'파이썬 알고리즘 기초' 커리큘럼 진행도</CardTitle>
          <CardDescription>현재 수강 중인 과정의 단계별 학습 현황입니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {curriculumSteps.map((step, idx) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex size-12 items-center justify-center rounded-full border-2 text-lg font-bold ${
                    step.status === "completed"
                      ? "border-green-500 bg-green-500 text-white"
                      : step.status === "in-progress"
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {step.status === "completed" ? (
                    <span className="material-symbols-outlined">check</span>
                  ) : step.status === "in-progress" ? (
                    <span className="material-symbols-outlined">play_arrow</span>
                  ) : (
                    <span className="material-symbols-outlined">lock</span>
                  )}
                </div>
                {idx !== curriculumSteps.length - 1 && (
                  <div className="h-16 w-px bg-border mt-2"></div>
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-lg font-semibold text-foreground">{step.title}</p>
                  {step.status === "in-progress" && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      진행 중
                    </span>
                  )}
                  {step.status === "completed" && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      완료
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                
                {step.status === "completed" && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm">
                    <p className="font-medium text-green-700 mb-1">완료일: 2024년 10월 {15 + idx}일</p>
                    <p className="text-green-600">평가: 매우 우수</p>
                  </div>
                )}
                
                {step.status === "in-progress" && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm">
                    <p className="font-medium text-primary mb-1">예상 완료일: 2024년 11월 30일</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 rounded-full bg-muted">
                        <div className="h-full w-2/3 rounded-full bg-primary"></div>
                      </div>
                      <span className="text-xs font-semibold text-primary">67%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
