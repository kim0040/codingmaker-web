"use client";

import { useState, useEffect, useCallback } from "react";
import { adminSidebar, communityFeed as defaultCommunityFeed } from "@/data/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/contexts/AuthContext";
import { api, endpoints } from "@/lib/api";
import { useRouter } from "next/navigation";

const trendColor = {
  positive: "text-green-500",
  negative: "text-red-500",
} as const;

type DashboardResponse = {
  success: boolean;
  data?: {
    overview?: {
      todayAttendance?: number;
      totalStudents?: number;
      todayPosts?: number;
      activeCourses?: number;
      attendanceRate?: string;
    };
    weeklyAttendance?: Array<{ date: string; count: number }>;
  };
};

type AttendanceStatsResponse = {
  success: boolean;
  data?: {
    dailyStats: Array<{
      date: string;
      total: number;
      attended: number;
      late: number;
      absent: number;
    }>;
    studentStats: Array<{
      id: string;
      name: string;
      totalDays: number;
      attendedDays: number;
      rate: string;
    }>;
  };
};

type CommunityPost = {
  id: string;
  title: string;
  createdAt: string;
  author?: {
    name?: string | null;
  };
};

type CommunityResponse = {
  success: boolean;
  data?: {
    posts: CommunityPost[];
  };
};

type UserListResponse = {
  success: boolean;
  data?: Array<{
    id: string;
    username: string;
    name: string;
    phone: string | null;
    tier: number;
    role: string;
  }>;
};

type UserListItem = NonNullable<UserListResponse["data"]>[number];

type CoursesResponse = {
  success: boolean;
  data?: {
    courses: Array<{
      id: string;
      title: string;
      instructor?: string | null;
      schedule?: string | null;
      category?: string | null;
    }>;
  };
};

export default function AdminDashboardPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardResponse["data"] | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStatsResponse["data"] | null>(null);
  const [studentPreview, setStudentPreview] = useState<UserListResponse["data"] | null>(null);
  const [courses, setCourses] = useState<CoursesResponse["data"] | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [attendanceRangeDays, setAttendanceRangeDays] = useState(14);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentRole, setStudentRole] = useState("STUDENT");

  const fetchDashboardData = useCallback(async ({ showSpinner = false } = {}) => {
    if (!token) return;
    try {
      if (showSpinner) {
        setIsLoading(true);
      }
      setIsRefreshing(true);
      const response = await api.get<DashboardResponse>(endpoints.analytics.dashboard, token);
      if (response.success) {
        setDashboardData(response.data ?? null);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      if (showSpinner) {
        setIsLoading(false);
      }
      setIsRefreshing(false);
    }
  }, [token]);

  const fetchAttendanceStats = useCallback(async (rangeDays = attendanceRangeDays) => {
    if (!token) return;
    try {
      const response = await api.get<AttendanceStatsResponse>(`${endpoints.analytics.attendance}?days=${rangeDays}`, token);
      if (response.success) {
        setAttendanceStats(response.data ?? null);
      }
    } catch (error) {
      console.error("Failed to fetch attendance stats:", error);
    }
  }, [attendanceRangeDays, token]);

  const fetchStudentPreview = useCallback(async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams({ limit: "5" });
      if (studentRole !== "all") {
        params.append("role", studentRole);
      }
      if (studentSearch) {
        params.append("search", studentSearch);
      }
      const response = await api.get<UserListResponse>(`/users?${params.toString()}`, token);
      if (response.success) {
        setStudentPreview(response.data ?? null);
      }
    } catch (error) {
      console.error("Failed to fetch student preview:", error);
    }
  }, [studentRole, studentSearch, token]);

  const fetchCourses = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<CoursesResponse>(endpoints.courses.list, token);
      if (response.success) {
        setCourses(response.data ?? null);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  }, [token]);

  const fetchCommunityPosts = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<CommunityResponse>(endpoints.community.posts, token);
      if (response.success && response.data?.posts) {
        setCommunityPosts(response.data.posts.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch community posts:", error);
    }
  }, [token]);

  const refreshAll = useCallback(() => {
    fetchDashboardData();
    fetchAttendanceStats(attendanceRangeDays);
    fetchStudentPreview();
    fetchCourses();
    fetchCommunityPosts();
  }, [attendanceRangeDays, fetchAttendanceStats, fetchCommunityPosts, fetchCourses, fetchDashboardData, fetchStudentPreview]);

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
      fetchDashboardData({ showSpinner: true });
      fetchAttendanceStats(attendanceRangeDays);
      fetchStudentPreview();
      fetchCourses();
      fetchCommunityPosts();
    }
  }, [
    authLoading,
    fetchAttendanceStats,
    fetchCommunityPosts,
    fetchCourses,
    fetchDashboardData,
    fetchStudentPreview,
    router,
    token,
    user,
    attendanceRangeDays,
  ]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (token) {
        fetchStudentPreview();
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [fetchStudentPreview, token]);

  const adminStats = [
    {
      label: "전체 학생",
      value: dashboardData?.overview?.totalStudents ?? "-",
      trend:
        dashboardData?.overview?.todayAttendance !== undefined &&
        dashboardData?.overview?.totalStudents
          ? `${dashboardData.overview.todayAttendance}/${dashboardData.overview.totalStudents} 금일 출석`
          : "오늘 출석 집계 중",
      trendColor: "positive" as const,
    },
    {
      label: "출석률",
      value: `${dashboardData?.overview?.attendanceRate ?? "0.0"}%`,
      trend: "금일 기준",
      trendColor: "positive" as const,
    },
    {
      label: "진행 중 과정",
      value: dashboardData?.overview?.activeCourses ?? "-",
      trend: "커리큘럼 활성화", 
      trendColor: "positive" as const,
    },
    {
      label: "금일 게시글",
      value: dashboardData?.overview?.todayPosts ?? "-",
      trend: "커뮤니티 실시간", 
      trendColor: "positive" as const,
    },
  ];

  const communityFeed = communityPosts.length > 0
    ? communityPosts.map(post => ({
        title: post.title,
        meta: `${post.author?.name || "익명"} • ${new Date(post.createdAt).toLocaleDateString()}`,
      }))
    : defaultCommunityFeed;

  const weeklyAttendanceData = dashboardData?.weeklyAttendance?.map((item) => {
    const percent = dashboardData?.overview?.totalStudents && dashboardData.overview.totalStudents > 0
      ? Math.min((item.count / dashboardData.overview.totalStudents) * 100, 100)
      : 0;

    return {
      label: new Date(item.date).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" }),
      value: percent,
    };
  }) ?? [];

  const attendanceHeatmap = [...(attendanceStats?.dailyStats ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const topStudents = attendanceStats?.studentStats ?? [];

  const studentRows: UserListItem[] = studentPreview ?? [];

  const todaySchedule = courses?.courses?.slice(0, 4).map((course) => ({
    title: course.title,
    time: course.schedule || "일정 미정",
    teacher: course.instructor || "담당자 확인 중",
    icon: course.category === "web" ? "data_object" : course.category === "python" ? "code" : "terminal",
  })) ?? [];

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
        onClick={refreshAll}
        className="relative"
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
      <Button className="gap-1" onClick={() => router.push("/admin/students?mode=create")}>
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
        {adminStats.map((stat) => (
          <Card key={stat.label} className="border border-border/60 bg-card">
            <CardHeader className="p-4">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle>{stat.value}</CardTitle>
              <p className={`${trendColor[stat.trendColor]} text-sm font-semibold`}>
                {stat.trend}
              </p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border border-border/70">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>전체 학생 명단</CardTitle>
              <CardDescription>백엔드 실데이터 기준 미리보기</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-48">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  search
                </span>
                <Input
                  className="pl-10"
                  placeholder="아이디 검색"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>
              <select
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                value={studentRole}
                onChange={(e) => setStudentRole(e.target.value)}
              >
                <option value="all">전체 역할</option>
                <option value="STUDENT">학생</option>
                <option value="TEACHER">강사</option>
                <option value="PARENT">학부모</option>
                <option value="ADMIN">관리자</option>
              </select>
              <Button variant="outline" onClick={() => router.push("/admin/students")}>상세 관리</Button>
            </div>
          </CardHeader>
          <CardContent className="max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3">이름</th>
                  <th className="py-3">역할</th>
                  <th className="py-3 text-right">권한</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-muted-foreground">
                      등록된 사용자를 찾을 수 없습니다.
                    </td>
                  </tr>
                ) : (
                  studentRows.map((row) => (
                    <tr key={row.id} className="border-t border-border/60">
                      <td className="py-3 font-medium text-foreground">{row.name}</td>
                      <td className="py-3 text-muted-foreground">{row.role}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-muted-foreground">Tier {row.tier}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="학생 상세 페이지"
                            onClick={() => router.push(`/admin/students?search=${encodeURIComponent(row.username)}`)}
                          >
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border border-border/70">
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>출결 현황</CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const nextRange = Math.min(attendanceRangeDays + 7, 60);
                      setAttendanceRangeDays(nextRange);
                      fetchAttendanceStats(nextRange);
                    }}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </Button>
                  <p className="font-medium text-foreground">최근 {attendanceRangeDays}일</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const nextRange = Math.max(attendanceRangeDays - 7, 7);
                      setAttendanceRangeDays(nextRange);
                      fetchAttendanceStats(nextRange);
                    }}
                    disabled={attendanceRangeDays <= 7}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {attendanceHeatmap.length === 0 ? (
                  <p className="text-sm text-muted-foreground">최근 출석 데이터가 없습니다.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">
                      {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                        <div key={day} className="py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {attendanceHeatmap.map((day) => {
                        const dateObj = new Date(day.date);
                        const dayLabel = dateObj.getDate();
                        const status = day.absent > 0 ? "absent" : day.late > 0 ? "late" : day.attended > 0 ? "present" : "none";
                        const color =
                          status === "present"
                            ? "bg-green-500 text-white"
                            : status === "late"
                            ? "bg-yellow-500 text-white"
                            : status === "absent"
                            ? "bg-red-500 text-white"
                            : "bg-muted text-muted-foreground";

                        return (
                          <div key={day.date} className={`relative rounded-lg py-2 ${color}`}>
                            {dayLabel}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap justify-end gap-4 text-xs text-muted-foreground">
                      <Legend label="출석" color="bg-green-500" />
                      <Legend label="지각" color="bg-yellow-500" />
                      <Legend label="결석" color="bg-red-500" />
                    </div>
                  </>
                )}
              </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-border/70">
          <CardHeader>
            <CardTitle>출석 상위 학생</CardTitle>
            <CardDescription>최근 {attendanceRangeDays}일 기준</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">출석 통계가 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {topStudents.map((student) => (
                  <li key={student.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <div>
                      <p className="font-semibold text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.attendedDays}/{student.totalDays} 출석</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{student.rate}%</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/70">
              <CardHeader>
                <CardTitle>주간 출결 현황</CardTitle>
                <CardDescription>최근 출석 기록</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyAttendanceData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">최근 7일 출석 데이터가 없습니다.</p>
                ) : (
                  <div className="flex items-end justify-between gap-2">
                    {weeklyAttendanceData.map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-2 text-xs">
                        <div className="w-3 rounded-full bg-primary/20">
                          <div
                            className="w-full rounded-full bg-primary"
                            style={{ height: `${Math.min(item.value, 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="border border-border/70 xl:col-span-3">
              <CardHeader>
                <CardTitle>오늘의 클래스 일정</CardTitle>
              </CardHeader>
              <CardContent>
                {todaySchedule.length === 0 ? (
                  <p className="text-sm text-muted-foreground">진행 예정인 수업이 없습니다.</p>
                ) : (
                  <ul role="list" className="space-y-6">
                    {todaySchedule.map((item, idx) => (
                      <li key={item.title} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className="material-symbols-outlined flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {item.icon}
                          </span>
                          {idx < todaySchedule.length - 1 && (
                            <span className="mt-2 h-full w-px bg-border" />
                          )}
                        </div>
                        <div className="flex flex-1 items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{item.time}</p>
                            <p className="font-semibold text-foreground">{item.title}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.teacher}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
        </Card>

        <Card className="border border-border/70 xl:col-span-2">
              <CardHeader>
                <CardTitle>최근 커뮤니티 활동</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {communityFeed.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => window.location.href = '/community'}
                    className="w-full cursor-pointer rounded-lg p-3 text-left hover:bg-muted transition-colors"
                  >
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  </button>
                ))}
              </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}

function Legend({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`inline-block size-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
