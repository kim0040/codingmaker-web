"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminSidebar } from "@/data/admin";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { api, endpoints } from "@/lib/api";
import type { ApiResponse, AttendanceAnalytics } from "@/types/api";

interface CommunityStats {
  overview: {
    totalPosts: number;
    totalComments: number;
    totalUsers: number;
    recentPosts: number;
    recentComments: number;
  };
  postsByCategory: { category: string | null; _count: { category: number } }[];
  popularPosts: { id: string; title: string; views: number; _count: { comments: number; likes: number } }[];
  activeUsers: { id: string; name: string; _count: { posts: number; comments: number } }[];
}

interface UserStats {
  usersByRole: { role: string; _count: { role: number } }[];
  usersByTier: { tier: number; _count: { tier: number } }[];
  recentUsers: number;
  monthlySignups: { month: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [attendanceStats, setAttendanceStats] = useState<AttendanceAnalytics | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    try {
      const [attendanceRes, communityRes, usersRes] = await Promise.all([
        api.get<ApiResponse<AttendanceAnalytics>>(endpoints.analytics.attendance, token),
        api.get<ApiResponse<CommunityStats>>(endpoints.analytics.community, token),
        api.get<ApiResponse<UserStats>>(endpoints.analytics.users, token),
      ]);

      if (attendanceRes.success && attendanceRes.data) {
        setAttendanceStats(attendanceRes.data);
      }
      if (communityRes.success && communityRes.data) {
        setCommunityStats(communityRes.data);
      }
      if (usersRes.success && usersRes.data) {
        setUserStats(usersRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics data", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading && !user) return;
    if (user && user.tier > 2) return;
    if (user && token) {
      fetchAnalytics();
    }
  }, [authLoading, fetchAnalytics, token, user]);

  const totalStudents = useMemo(() => {
    return userStats?.usersByRole.find((r) => r.role === "STUDENT")?._count.role ?? 0;
  }, [userStats]);

  const activeCategories = useMemo(() => communityStats?.postsByCategory.length ?? 0, [communityStats]);

  if (authLoading || isLoading) {
    return (
      <DashboardLayout
        userName={user?.name || "관리자"}
        userSubtitle="코딩메이커 아카데미"
        sidebarItems={adminSidebar}
        headerTitle="데이터 분석"
        headerSubtitle="학원 운영 통계 및 트렌드를 확인하세요"
        requiredTier={2}
      >
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="text-muted-foreground">분석 데이터를 불러오는 중...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={user?.name || "관리자"}
      userSubtitle="코딩메이커 아카데미"
      sidebarItems={adminSidebar}
      headerTitle="데이터 분석"
      headerSubtitle="학원 운영 통계 및 트렌드를 확인하세요"
      requiredTier={2}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 학생</CardDescription>
              <CardTitle className="text-3xl">{totalStudents}명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">최근 가입 {userStats?.recentUsers ?? 0}명</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>평균 출석률</CardDescription>
              <CardTitle className="text-3xl">
                {attendanceStats?.studentStats?.length
                  ? `${attendanceStats.studentStats[0].rate}%`
                  : "-"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">출석 상위 {attendanceStats?.studentStats?.length ?? 0}명 기준</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>게시글/댓글</CardDescription>
              <CardTitle className="text-3xl">
                {communityStats ? `${communityStats.overview.totalPosts}/${communityStats.overview.totalComments}` : "-"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">최근 게시글 {communityStats?.overview.recentPosts ?? 0}건</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>카테고리</CardDescription>
              <CardTitle className="text-3xl">{activeCategories}개</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">커뮤니티 활동 범위</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>일별 출석률 추이</CardTitle>
            <CardDescription>최근 출결 데이터를 기반으로 계산되었습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {attendanceStats?.dailyStats?.length ? (
              attendanceStats.dailyStats.slice(0, 14).map((day) => (
                <div key={day.date} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{new Date(day.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-40 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(100, (day.attended / Math.max(day.total, 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">출석 {day.attended} / {day.total}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">출석 데이터가 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>활동적인 학생/학부모</CardTitle>
            <CardDescription>게시글·댓글 활동이 많은 사용자</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {communityStats?.activeUsers?.length ? (
              communityStats.activeUsers.map((au) => (
                <div key={au.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{au.name}</p>
                    <p className="text-muted-foreground">게시글 {au._count.posts} · 댓글 {au._count.comments}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">활동 중</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">활동 기록이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>티어별 사용자 수</CardTitle>
              <CardDescription>권한 구조 현황</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {userStats?.usersByTier?.length ? (
                userStats.usersByTier.map((tier) => (
                  <div key={tier.tier} className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Tier {tier.tier}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, tier._count.tier * 10)}%` }} />
                      </div>
                      <span className="text-muted-foreground">{tier._count.tier}명</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">티어 데이터가 없습니다.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>인기 게시글</CardTitle>
              <CardDescription>조회수 기준 상위 게시글</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {communityStats?.popularPosts?.length ? (
                communityStats.popularPosts.map((post) => (
                  <div key={post.id} className="rounded-lg border border-border/60 p-3 text-sm">
                    <p className="font-semibold text-foreground">{post.title}</p>
                    <p className="text-muted-foreground">조회수 {post.views} · 댓글 {post._count.comments} · 좋아요 {post._count.likes}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">인기 게시글 데이터가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
