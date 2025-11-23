"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { studentSidebar } from "@/data/student";
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
import type { ApiResponse, AttendanceSummary, Course, CommunityPostSummary } from "@/types/api";

export default function StudentDashboardPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [notifications, setNotifications] = useState<CommunityPostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id;
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayStatus = useMemo(() => {
    if (!attendance?.records) return null;
    return attendance.records.find((record) => record.date.startsWith(todayKey));
  }, [attendance?.records, todayKey]);

  const fetchData = useCallback(async () => {
    if (!token || !userId) return;
    try {
      const [courseRes, attendanceRes, communityRes] = await Promise.all([
        api.get<ApiResponse<{ courses: Course[] }>>(endpoints.courses.list, token),
        api.get<ApiResponse<AttendanceSummary>>(`${endpoints.attendance.user(userId)}?month=${todayKey.slice(0, 7)}`, token),
        api.get<ApiResponse<{ posts: CommunityPostSummary[] }>>(endpoints.community.posts, token),
      ]);

      if (courseRes.success && courseRes.data?.courses) {
        setCourses(courseRes.data.courses);
      }
      if (attendanceRes.success && attendanceRes.data) {
        setAttendance(attendanceRes.data);
      }
      if (communityRes.success && communityRes.data?.posts) {
        setNotifications(communityRes.data.posts.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to load student dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, userId, todayKey]);

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
        sidebarItems={studentSidebar}
        bottomNavItems={[
          studentSidebar[0],
          studentSidebar[1],
          studentSidebar[2],
          studentSidebar[3],
          studentSidebar[5],
        ]}
        headerTitle="학생 대시보드"
        headerSubtitle="데이터를 준비 중입니다"
      >
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="text-muted-foreground">학습 현황을 불러오는 중...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={user?.name || "학생"}
      userSubtitle="CodingMaker Academy"
      sidebarItems={studentSidebar}
      bottomNavItems={[
        studentSidebar[0],
        studentSidebar[1],
        studentSidebar[2],
        studentSidebar[3],
        studentSidebar[5],
      ]}
      headerTitle="학생 대시보드"
      headerSubtitle="오늘도 목표를 향해 함께 나아가요!"
    >
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>내 클래스</CardTitle>
                <CardDescription>등록된 커리큘럼을 확인하세요.</CardDescription>
              </div>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/curriculum")}>
                전체 커리큘럼 보기
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {courses.length === 0 ? (
                <p className="text-sm text-muted-foreground">수강 중인 클래스가 없습니다. 새로운 커리큘럼을 확인해 보세요.</p>
              ) : (
                courses.slice(0, 6).map((cls) => (
                  <div key={cls.id} className="flex flex-col rounded-xl border border-border/60 bg-white dark:bg-[#111a22]">
                    <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                      <div>
                        <p className="text-base font-semibold text-foreground">{cls.title}</p>
                        <p className="text-sm text-muted-foreground">
                          강사: {cls.instructor || "미정"} · {cls.schedule || "일정 미정"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>카테고리: {cls.category}</span>
                        <span>수강생 {cls.enrolledCount}명</span>
                      </div>
                      <Button className="w-full" onClick={() => router.push("/lms")}>강의실 바로가기</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>오늘의 출결</CardTitle>
                <CardDescription>출결 상태를 확인하세요.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                {todayStatus ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
                      <div>
                        <p className="text-xl font-bold text-foreground">{todayStatus.status}</p>
                        <p className="text-muted-foreground">{new Date(todayStatus.date).toLocaleString()}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">오늘 출결 기록이 없습니다. 키오스크에서 태그를 인식시켜 주세요.</p>
                )}
                <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <span>출석</span>
                    <span className="font-semibold text-foreground">{attendance?.stats.attended ?? 0}회</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>지각</span>
                    <span className="font-semibold text-foreground">{attendance?.stats.late ?? 0}회</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>결석</span>
                    <span className="font-semibold text-foreground">{attendance?.stats.absent ?? 0}회</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>출석률</span>
                    <span className="font-semibold text-primary">{attendance?.stats.rate ?? "0"}%</span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => router.push("/kiosk")}>출결 체크하러 가기</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>최근 출결 기록</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {attendance?.records?.length ? (
                  attendance.records.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                      <div>
                        <p className="font-semibold text-foreground">{record.status}</p>
                        <p className="text-xs text-muted-foreground">{new Date(record.date).toLocaleString()}</p>
                      </div>
                      {record.note && <span className="text-xs text-muted-foreground">{record.note}</span>}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">최근 출결 기록이 없습니다.</p>
                )}
                <Button variant="link" className="p-0 text-primary" onClick={() => router.push("/kiosk")}>전체 기록 보기</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>알림 및 커뮤니티</CardTitle>
            <CardDescription>새로운 소식을 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">새로운 알림이 없습니다.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => router.push(`/community/${notification.id}`)}
                  className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
                >
                  <div className="mt-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl text-primary">notifications_active</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}
