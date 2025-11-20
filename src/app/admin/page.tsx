"use client";

import { useState, useEffect } from "react";
import {
  adminSidebar,
  adminStats as defaultStats,
  studentTable as defaultStudentTable,
  attendanceCalendar,
  classDistribution,
  weeklyAttendance,
  todaySchedule,
  communityFeed as defaultCommunityFeed,
} from "@/data/admin";
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

const trendColor = {
  positive: "text-green-500",
  negative: "text-red-500",
} as const;

export default function AdminDashboardPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }
    
    if (user && user.tier > 2) {
      alert("관리자 권한이 필요합니다.");
      router.push("/");
      return;
    }

    if (user && token) {
      fetchDashboardData();
      fetchCommunityPosts();
    }
  }, [user, token, authLoading]);

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const response: any = await api.get(endpoints.analytics.dashboard, token);
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommunityPosts = async () => {
    if (!token) return;
    try {
      const response: any = await api.get(endpoints.community.posts, token);
      if (response.success && response.data && response.data.posts) {
        setCommunityPosts(response.data.posts.slice(0, 5)); // 최근 5개만
      }
    } catch (error) {
      console.error("Failed to fetch community posts:", error);
    }
  };

  const adminStats = dashboardData ? [
    {
      label: "총 학생 수",
      value: dashboardData.totalStudents || 0,
      trend: `+${dashboardData.newStudentsThisMonth || 0} this month`,
      trendColor: "positive" as const,
    },
    {
      label: "평균 출석률",
      value: `${dashboardData.averageAttendance || 0}%`,
      trend: dashboardData.attendanceTrend || "+2.5% from last week",
      trendColor: "positive" as const,
    },
    {
      label: "진행 중인 과정",
      value: dashboardData.activeCourses || 0,
      trend: "",
      trendColor: "positive" as const,
    },
    {
      label: "커뮤니티 활동",
      value: dashboardData.communityPosts || 0,
      trend: `+${dashboardData.newPostsThisWeek || 0} this week`,
      trendColor: "positive" as const,
    },
  ] : defaultStats;

  const communityFeed = communityPosts.length > 0 ? communityPosts.map(post => ({
    title: post.title,
    meta: `${post.author?.name || '익명'} • ${new Date(post.createdAt).toLocaleDateString()}`,
  })) : defaultCommunityFeed;

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
      <button
        className="rounded-full p-2.5 text-muted-foreground hover:bg-muted"
        onClick={() => alert('검색 기능은 백엔드 연결 후 사용 가능합니다.')}
      >
        <span className="material-symbols-outlined">search</span>
      </button>
      <button
        className="rounded-full p-2.5 text-muted-foreground hover:bg-muted"
        onClick={() => alert('새 알림이 없습니다.')}
      >
        <span className="material-symbols-outlined">notifications</span>
      </button>
      <button
        className="rounded-full p-2.5 text-muted-foreground hover:bg-muted"
        onClick={() => alert('메일 기능은 백엔드 연결 후 사용 가능합니다.')}
      >
        <span className="material-symbols-outlined">mail</span>
      </button>
      <Button className="gap-1" onClick={() => alert('학생 추가 기능은 백엔드 연결 후 사용 가능합니다.')}>
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
                  <CardDescription>소수 정예 클래스별 진행 현황</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative w-48">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      search
                    </span>
                    <input
                      className="w-full rounded-lg border border-transparent bg-muted py-2 pl-10 pr-3 text-sm focus:border-primary focus:ring-primary"
                      placeholder="학생 이름 검색"
                    />
                  </div>
                  <select className="rounded-lg border border-transparent bg-muted px-3 py-2 text-sm focus:border-primary focus:ring-primary">
                    {defaultStudentTable.filterClasses.map((cls: string) => (
                      <option key={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-3">이름</th>
                      <th className="py-3">클래스</th>
                      <th className="py-3 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaultStudentTable.rows.map((row: any) => (
                      <tr key={row.name} className="border-t border-border/60">
                        <td className="py-3 font-medium text-foreground">{row.name}</td>
                        <td className="py-3 text-muted-foreground">{row.className}</td>
                        <td className="py-3 text-right">
                          <button 
                            onClick={() => alert(`${row.name} 학생의 상세 정보는 백엔드 연결 후 확인 가능합니다.`)}
                            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                          >
                            <span className="material-symbols-outlined text-base">more_horiz</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
        </Card>

        <Card className="border border-border/70">
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>출결 현황</CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <Button variant="ghost" size="icon">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </Button>
                  <p className="font-medium text-foreground">{attendanceCalendar.month}</p>
                  <Button variant="ghost" size="icon">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">
                  {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <div key={day} className="py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {attendanceCalendar.days.map((day, idx) => (
                    <div
                      key={`${day.day}-${idx}`}
                      className={`relative rounded-lg py-2 ${
                        day.current
                          ? "bg-primary text-white"
                          : day.muted
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {day.day}
                      {day.badge && !day.current && (
                        <span
                          className={`absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full ${
                            day.badge === "present"
                              ? "bg-green-500"
                              : day.badge === "absent"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap justify-end gap-4 text-xs text-muted-foreground">
                  <Legend label="출석" color="bg-green-500" />
                  <Legend label="지각" color="bg-yellow-500" />
                  <Legend label="결석" color="bg-red-500" />
                </div>
              </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-border/70">
              <CardHeader>
                <CardTitle>클래스별 학생 분포</CardTitle>
                <CardDescription>평균 15.5명</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-flow-col grid-rows-[1fr_auto] items-end gap-4">
                  {classDistribution.map((item) => (
                    <div key={item.label} className="text-center">
                      <div
                        className={`mx-auto w-10 rounded-t-md ${
                          item.highlight ? "bg-primary" : "bg-primary/20"
                        }`}
                        style={{ height: `${item.value}%` }}
                      />
                      <p
                        className={`mt-2 text-xs font-semibold ${
                          item.highlight ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
        </Card>

        <Card className="border border-border/70">
              <CardHeader>
                <CardTitle>주간 출결 현황</CardTitle>
                <CardDescription>최근 7일 평균 92%</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between gap-2">
                  {weeklyAttendance.map((value, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 text-xs">
                      <div className="w-3 rounded-full bg-primary/20">
                        <div
                          className="w-full rounded-full bg-primary"
                          style={{ height: `${value}%` }}
                        />
                      </div>
                      <span className="font-semibold text-muted-foreground">
                        {["월", "화", "수", "목", "금", "토"][idx] ?? "일"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="border border-border/70 xl:col-span-3">
              <CardHeader>
                <CardTitle>오늘의 클래스 일정</CardTitle>
              </CardHeader>
              <CardContent>
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
