"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { parentSidebar } from "@/data/parent";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api, endpoints } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { ApiResponse, AttendanceSummary, Course } from "@/types/api";

export default function ParentDashboardPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const childId = useMemo(() => {
    if (user?.role === "PARENT" && user.parentId) return user.parentId;
    return user?.id;
  }, [user?.id, user?.parentId, user?.role]);

  const fetchData = useCallback(async () => {
    if (!token || !childId) return;
    try {
      const [attendanceRes, courseRes] = await Promise.all([
        api.get<ApiResponse<AttendanceSummary>>(endpoints.attendance.user(childId), token),
        api.get<ApiResponse<{ courses: Course[] }>>(endpoints.courses.list, token),
      ]);

      if (attendanceRes.success && attendanceRes.data) {
        setAttendance(attendanceRes.data);
      }
      if (courseRes.success && courseRes.data?.courses) {
        setCourses(courseRes.data.courses);
      }
    } catch (error) {
      console.error("Failed to load parent dashboard", error);
    } finally {
      setIsLoading(false);
    }
  }, [childId, token]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }
    if (user && user.tier > 3) {
      router.push("/");
      return;
    }
    if (user && token) {
      fetchData();
    }
  }, [authLoading, fetchData, router, token, user]);

  if (authLoading || isLoading) {
    return (
      <DashboardLayout
        userName="로딩 중..."
        userSubtitle="CodingMaker Academy"
        sidebarItems={parentSidebar}
        headerTitle="학부모 대시보드"
        headerSubtitle="데이터를 불러오는 중입니다"
      >
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="text-muted-foreground">자녀 정보를 준비하고 있습니다...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={user?.name || "학부모"}
      userSubtitle="CodingMaker Academy"
      sidebarItems={parentSidebar}
      headerTitle="학부모 대시보드"
      headerSubtitle={user?.role === "PARENT" ? "자녀 학습 현황을 확인하세요" : "학습 현황"}
    >
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">{user?.name}님의 가족 학습 현황</CardTitle>
              <CardDescription>
                {user?.role === "PARENT" && user.parentId ? "자녀 출결 및 클래스 정보를 실시간으로 확인하세요." : "출결 및 학습 정보를 확인하세요."}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => router.push("/contact")}>문의하기</Button>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>이번 달 출석률</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-primary">{attendance?.stats.rate ?? "0"}%</p>
                <p className="font-semibold text-green-500">실시간 업데이트</p>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min(100, Number(attendance?.stats.rate ?? 0))}%` }}></div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground">출석</p>
                  <p className="text-lg font-bold text-foreground">{attendance?.stats.attended ?? 0}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground">지각</p>
                  <p className="text-lg font-bold text-foreground">{attendance?.stats.late ?? 0}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground">결석</p>
                  <p className="text-lg font-bold text-foreground">{attendance?.stats.absent ?? 0}</p>
                </div>
              </div>
              <Button variant="link" className="p-0 text-primary" onClick={() => router.push("/kiosk")}>상세 출결 기록 보기</Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>수강 중인 클래스</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {courses.slice(0, 4).map((cls) => (
                <div
                  key={cls.id}
                  className={`w-full rounded-xl border p-4 text-left transition-colors hover:shadow-md ${
                    cls.isActive ? "border-primary/30" : "border-border"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-foreground">{cls.title}</h3>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">person</span>
                      강사: {cls.instructor || "미정"}
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">calendar_today</span>
                      일정: {cls.schedule || "미정"}
                    </p>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-sm text-muted-foreground md:col-span-2">등록된 클래스가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>최근 출결 기록</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {attendance?.records?.length ? (
              attendance.records.slice(0, 6).map((record, idx) => (
                <div key={record.id} className="flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full border-2 ${
                        record.status === "ATTENDED" || record.status === "PRESENT"
                          ? "border-secondary bg-secondary text-white"
                          : record.status === "LATE"
                          ? "border-primary bg-primary text-white"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {record.status === "ATTENDED" || record.status === "PRESENT" ? (
                        <span className="material-symbols-outlined">check</span>
                      ) : idx + 1}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{record.status}</p>
                    <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleString()}</p>
                    {record.note && <p className="text-xs text-muted-foreground">{record.note}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">출결 기록이 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
