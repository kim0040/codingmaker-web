"use client";

import { useState, useEffect, useCallback } from "react";
import { adminSidebar } from "@/data/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/AuthContext";
import { api, endpoints } from "@/lib/api";
import { useRouter } from "next/navigation";
import type {
  ApiResponse,
  AttendanceAnalytics,
  Course,
  DashboardStats,
  UserSummary,
  CommunityPostSummary,
} from "@/types/api";

export default function AdminDashboardPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceAnalytics | null>(null);
  const [students, setStudents] = useState<UserSummary[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPostSummary[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async ({ withSpinner = false } = {}) => {
    if (!token) return;
    try {
      if (withSpinner) setIsLoading(true);
      setIsRefreshing(true);
      const response = await api.get<ApiResponse<DashboardStats>>(endpoints.analytics.dashboard, token);
      if (response.success && response.data) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      if (withSpinner) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  const fetchAttendanceAnalytics = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<ApiResponse<AttendanceAnalytics>>(endpoints.analytics.attendance, token);
      if (response.success && response.data) {
        setAttendanceStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch attendance analytics:", error);
    }
  }, [token]);

  const fetchLatestStudents = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<ApiResponse<UserSummary[]>>("/users?limit=5", token);
      if (response.success && response.data) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  }, [token]);

  const fetchCommunityPosts = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<ApiResponse<{ posts: CommunityPostSummary[] }>>(endpoints.community.posts, token);
      if (response.success && response.data?.posts) {
        setCommunityPosts(response.data.posts.slice(0, 6));
      }
    } catch (error) {
      console.error("Failed to fetch community posts:", error);
    }
  }, [token]);

  const fetchCourses = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<ApiResponse<{ courses: Course[] }>>(endpoints.courses.list, token);
      if (response.success && response.data?.courses) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && !user) {
      setIsLoading(false);
      router.push("/auth");
      return;
    }

    if (user && user.tier > 2) {
      setIsLoading(false);
      alert("관리자 권한이 필요합니다.");
      router.push("/");
      return;
    }

    if (user && token) {
      Promise.all([
        fetchDashboardData({ withSpinner: true }),
        fetchAttendanceAnalytics(),
        fetchLatestStudents(),
        fetchCommunityPosts(),
        fetchCourses(),
      ]).finally(() => setIsLoading(false));
    }
  }, [authLoading, fetchAttendanceAnalytics, fetchCommunityPosts, fetchCourses, fetchDashboardData, fetchLatestStudents, router, token, user]);

  const statCards = dashboardStats ? [
    {
      label: "오늘 출석 처리",
      value: dashboardStats.overview.todayAttendance,
      trend: `${dashboardStats.overview.attendanceRate}% 완료`,
    },
    {
      label: "총 학생 수",
      value: dashboardStats.overview.totalStudents,
      trend: "학생 관리로 이동",
      action: () => router.push("/admin/students"),
    },
    {
      label: "활성 커리큘럼",
      value: dashboardStats.overview.activeCourses,
      trend: "커리큘럼 관리",
      action: () => router.push("/admin/classes"),
    },
    {
      label: "오늘 등록된 게시글",
      value: dashboardStats.overview.todayPosts,
      trend: "커뮤니티 살펴보기",
      action: () => router.push("/community"),
    },
  ] : [];

  if (authLoading || isLoading) {
    return (
      <DashboardLayout
        userName="로딩 중..."
        userSubtitle="코딩메이커 아카데미"
        sidebarItems={adminSidebar}
        headerTitle="관리자 대시보드"
        headerSubtitle="데이터를 불러오는 중..."
        requiredTier={2}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">데이터를 불러오는 중...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const headerActions = (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          fetchDashboardData();
          fetchAttendanceAnalytics();
          fetchLatestStudents();
          fetchCommunityPosts();
          fetchCourses();
        }}
        className="relative"
        aria-label="새로고침"
      >
        <span className="material-symbols-outlined">refresh</span>
        {isRefreshing && <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-primary" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push("/admin/students")}
        aria-label="학생 목록으로 이동"
      >
        <span className="material-symbols-outlined">groups</span>
      </Button>
      <Button className="gap-1" onClick={() => router.push("/admin/students/add")}> 
        <span className="material-symbols-outlined text-base">add</span>
        <span className="hidden sm:inline">학생 추가</span>
      </Button>
    </>
  );

  return (
    <DashboardLayout
      userName={user?.name || "관리자"}
      userSubtitle="코딩메이커 아카데미"
      sidebarItems={adminSidebar}
      headerTitle="관리자 대시보드"
      headerSubtitle={`${user?.name || "관리자"}님, 환영합니다!`}
      headerActions={headerActions}
      requiredTier={2}
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border border-border/60 bg-card">
            <CardHeader className="p-4">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle>{stat.value}</CardTitle>
              {stat.action ? (
                <button
                  type="button"
                  className="text-sm font-semibold text-primary hover:underline"
                  onClick={stat.action}
                >
                  {stat.trend}
                </button>
              ) : (
                <p className="text-sm text-muted-foreground">{stat.trend}</p>
              )}
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border border-border/70">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>최근 등록된 학생</CardTitle>
              <CardDescription>실시간으로 최신 5명의 등록 정보를 확인하세요.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/students")}>전체 보기</Button>
          </CardHeader>
          <CardContent className="max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3">이름</th>
                  <th className="py-3">역할</th>
                  <th className="py-3">연락처</th>
                  <th className="py-3 text-right">권한</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">학생 정보를 불러올 수 없습니다.</td>
                  </tr>
                ) : (
                  students.map((row) => (
                    <tr key={row.id} className="border-t border-border/60">
                      <td className="py-3 font-medium text-foreground">{row.name}</td>
                      <td className="py-3 text-muted-foreground">{row.role}</td>
                      <td className="py-3 text-muted-foreground">{row.phone || "-"}</td>
                      <td className="py-3 text-right">Tier {row.tier}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border border-border/70">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>최근 출결 집계</CardTitle>
            <CardDescription>일자별 출결 건수를 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {attendanceStats?.dailyStats?.length ? (
              attendanceStats.dailyStats.slice(0, 14).map((day) => (
                <div key={day.date} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{new Date(day.date).toLocaleDateString()}</span>
                    <span className="text-muted-foreground">출석 {day.attended} · 지각 {day.late} · 결석 {day.absent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(100, (day.attended / Math.max(day.total, 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">총 {day.total}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">출결 정보를 불러올 수 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-border/70">
          <CardHeader>
            <CardTitle>주간 출결 현황</CardTitle>
            <CardDescription>최근 7일 출결량</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              {dashboardStats?.weeklyAttendance?.length ? (
                dashboardStats.weeklyAttendance.map((point) => (
                  <div key={point.date} className="flex flex-col items-center gap-2 text-xs">
                    <div className="w-3 rounded-full bg-primary/20">
                      <div
                        className="w-full rounded-full bg-primary"
                        style={{ height: `${Math.min(100, point.count * 6)}%` }}
                      />
                    </div>
                    <span className="font-semibold text-muted-foreground">
                      {new Date(point.date).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">주간 출결 데이터가 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70">
          <CardHeader>
            <CardTitle>최근 커뮤니티 활동</CardTitle>
            <CardDescription>실제 게시글 데이터를 바로 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {communityPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">최근 게시글이 없습니다.</p>
            ) : (
              communityPosts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/community/${item.id}`)}
                  className="w-full cursor-pointer rounded-lg p-3 text-left transition-colors hover:bg-muted"
                >
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.author?.name || "익명"} · {new Date(item.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border border-border/70">
          <CardHeader>
            <CardTitle>클래스 일정 및 커리큘럼</CardTitle>
            <CardDescription>등록된 커리큘럼을 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">등록된 커리큘럼이 없습니다.</p>
            ) : (
              courses.slice(0, 4).map((course) => (
                <div key={course.id} className="flex items-start justify-between gap-3 rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="font-semibold text-foreground">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.instructor || "담당 강사 미정"}</p>
                    <p className="text-xs text-muted-foreground">{course.schedule || "일정 미정"}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/classes")}>관리</Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/70">
          <CardHeader>
            <CardTitle>출결 우수 학생</CardTitle>
            <CardDescription>최근 집계된 출석률 상위 학생</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {attendanceStats?.studentStats?.length ? (
              attendanceStats.studentStats.map((student) => (
                <div key={student.id} className="flex items-center justify-between rounded-lg bg-muted/40 p-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{student.name}</p>
                    <p className="text-muted-foreground">총 {student.totalDays}회 중 {student.attendedDays}회 출석</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{student.rate}%</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">출결 데이터가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}
