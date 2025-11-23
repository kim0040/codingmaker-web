"use client";

import { useState, useEffect } from "react";
import { communityFilters } from "@/data/community";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { studentSidebar } from "@/data/student";
import { useAuth } from "@/contexts/AuthContext";
import { api, endpoints } from "@/lib/api";
import type { ApiResponse, CommunityPostList, CommunityPostSummary } from "@/types/api";

export default function CommunityPage() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<CommunityPostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<ApiResponse<CommunityPostList>>(
        `${endpoints.community.posts}?page=1&limit=20`,
        token
      );
      if (response.success && response.data?.posts) {
        setPosts(response.data.posts);
      }
    } catch (err: any) {
      console.error("Failed to fetch posts:", err);
      setError("게시글을 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DashboardLayout
      userName={user?.name || "사용자"}
      userSubtitle="커뮤니티"
      sidebarItems={studentSidebar}
      bottomNavItems={[
        studentSidebar[0], // 대시보드
        studentSidebar[1], // 내 클래스
        studentSidebar[2], // 프로젝트
        studentSidebar[3], // LMS 강의실
        studentSidebar[5], // 채팅
      ]}
      headerTitle="커뮤니티"
      headerSubtitle="지식을 공유하고 함께 성장하세요"
    >
      <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-foreground sm:text-4xl">커뮤니티</h1>
              <p className="text-muted-foreground">
                지식을 공유하고, 질문하고, 멤버들과 프로젝트를 협업하세요.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => alert('글쓰기 기능은 백엔드 연결 후 사용 가능합니다.')}
                className="hidden sm:flex"
              >
                <span className="material-symbols-outlined">edit</span>
                글쓰기
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => window.location.href = '/student/notifications'}
              >
                <span className="material-symbols-outlined">notifications</span>
              </Button>
              <div
                className="size-10 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCCjatCADJkBEzOqlISE7KpGLlTQCgsr4gfnWHKY9fmjOVJMmyYSTsphf6sBjB3xGOjKIE-20CCi2-joRPPYeZSoC-elPcjm2PggjxH_XwMZNRkrvRoy5QzXxcUZyPwCaszrbdiK2cjkdudrAYikeBnTvMne47JOAx4DXMBScTwV2dylwxRWd_QTUps3CNtnUhlLve1HN7wXooqIlh6KXCH0yU8osz_4OkeYG4lfxT0SMuuW-IAaPq5l9A8Ig6iETtGxmONnXpDIE0)",
                }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="flex items-center rounded-xl border border-border bg-card px-4 text-muted-foreground">
                <span className="material-symbols-outlined">search</span>
                <input
                  className="h-12 flex-1 bg-transparent px-3 text-sm text-foreground focus:outline-none"
                  placeholder="키워드로 검색..."
                />
              </div>
            </div>
            <div className="flex gap-3">
              {[communityFilters.category, communityFilters.sort].map((label) => (
                <button
                  key={label}
                  onClick={() => alert(`${label} 필터 기능은 백엔드 연결 후 사용 가능합니다.`)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm hover:border-primary transition-colors"
                >
                  {label}
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">번호</th>
                  <th className="px-4 py-3">제목</th>
                  <th className="px-4 py-3">작성자</th>
                  <th className="px-4 py-3">날짜</th>
                  <th className="px-4 py-3">조회</th>
                  <th className="px-4 py-3">추천</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      게시글을 불러오는 중...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      작성된 게시글이 없습니다. 첫 게시글을 작성해보세요!
                    </td>
                  </tr>
                ) : (
                  posts.map((post: any, index: number) => (
                    <tr 
                      key={post.id} 
                      onClick={() => window.location.href = `/community/${post.id}`}
                      className="border-t border-border hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        <span className="hover:text-primary cursor-pointer">
                          {post.title} {post.commentCount > 0 && (
                            <span className="text-muted-foreground">[{post.commentCount}]</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{post.author?.name || "익명"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{post.views || 0}</td>
                      <td className="px-4 py-3 text-muted-foreground">{post.likes || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => alert('이전 페이지가 없습니다.')}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </Button>
            {[1, 2, 3].map((page) => (
              <Button 
                key={page} 
                variant={page === 1 ? "default" : "ghost"} 
                size="icon"
                onClick={() => alert(`${page}페이지로 이동`)}
              >
                {page}
              </Button>
            ))}
            <span className="text-muted-foreground">...</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => alert('10페이지로 이동')}
            >
              10
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => alert('다음 페이지로 이동')}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </Button>
          </div>
      </div>
    </DashboardLayout>
  );
}
