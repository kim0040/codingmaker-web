"use client";

import {
  parentSidebar,
  childProfile,
  attendanceSummary,
  parentClasses,
  curriculumSteps,
} from "@/data/parent";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ParentDashboardPage() {
  return (
    <DashboardLayout
      userName="김학부모"
      userSubtitle="CodingMaker Academy"
      sidebarItems={parentSidebar}
      headerTitle="학부모 대시보드"
      headerSubtitle={childProfile.summary}
    >
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">{childProfile.name} 학생 학습 현황</CardTitle>
              <CardDescription>{childProfile.summary}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => alert('자녀 변경 기능은 백엔드 연결 후 사용 가능합니다.')}>자녀 변경</Button>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>이번 달 출석률</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-primary">{attendanceSummary.monthlyRate}%</p>
                <p className="font-semibold text-green-500">{attendanceSummary.change}</p>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div className="h-full rounded-full bg-secondary" style={{ width: `${attendanceSummary.monthlyRate}%` }}></div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                {attendanceSummary.breakdown.map((item) => (
                  <div key={item.label} className="rounded-lg bg-muted p-3">
                    <p className="text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <Button variant="link" className="p-0 text-primary" onClick={() => alert('상세 출결 기록 페이지는 추후 추가될 예정입니다.')}>
                상세 출결 기록 보기
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>수강 중인 클래스</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {parentClasses.map((cls) => (
                <button
                  key={cls.title}
                  onClick={() => alert(`${cls.title}\n\n강사: ${cls.teacher}\n다음 수업: ${cls.nextSession}`)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors hover:shadow-md ${
                    cls.highlight ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-foreground">{cls.title}</h3>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">person</span>
                      강사: {cls.teacher}
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                      다음 수업: {cls.nextSession}
                    </p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>'파이썬 알고리즘 기초' 커리큘럼 진행도</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {curriculumSteps.map((step, idx) => (
              <button
                key={step.title}
                onClick={() => alert(`${step.title}\n\n${step.description}\n\n상태: ${step.status === 'completed' ? '완료' : step.status === 'in-progress' ? '진행 중' : '예정'}`)}
                className="flex w-full gap-4 text-left transition-colors hover:bg-muted/50 rounded-lg p-2 -mx-2"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full border-2 ${
                      step.status === "completed"
                        ? "border-secondary bg-secondary text-white"
                        : step.status === "in-progress"
                        ? "border-primary bg-primary text-white"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <span className="material-symbols-outlined">check</span>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx !== curriculumSteps.length - 1 && <div className="h-12 w-px bg-border"></div>}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {step.title}
                    {step.status === "in-progress" && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        진행 중
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
