"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminSidebar } from "@/data/admin";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { api, endpoints } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { ApiResponse, Course } from "@/types/api";

const defaultForm: Partial<Course> = {
  title: "",
  category: "",
  instructor: "",
  schedule: "",
  description: "",
};

export default function AdminClassesPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const canManage = useMemo(() => (user?.tier ?? 99) <= 2, [user?.tier]);
  const canDelete = useMemo(() => (user?.tier ?? 99) === 1, [user?.tier]);

  const fetchCourses = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<ApiResponse<{ courses: Course[] }>>(endpoints.courses.list, token);
      if (response.success && response.data?.courses) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

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
      fetchCourses();
    }
  }, [authLoading, fetchCourses, router, token, user]);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !canManage) return;
    setIsSubmitting(true);
    setMessage("");

    try {
      const payload = {
        title: form.title?.trim(),
        category: form.category?.trim() || "기타",
        description: form.description ?? "",
        instructor: form.instructor ?? "",
        schedule: form.schedule ?? "",
      };

      if (!payload.title) {
        setMessage("클래스명을 입력하세요.");
        return;
      }

      if (editingId) {
        const response = await api.put<ApiResponse<Course>>(endpoints.courses.update(editingId), payload, token);
        if (response.success) {
          setMessage("클래스가 수정되었습니다.");
          resetForm();
          fetchCourses();
        }
      } else {
        const response = await api.post<ApiResponse<{ id: string }>>(endpoints.courses.create, payload, token);
        if (response.success) {
          setMessage("새 클래스가 등록되었습니다.");
          resetForm();
          fetchCourses();
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "클래스 저장 중 오류가 발생했습니다.";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      category: course.category,
      instructor: course.instructor ?? "",
      schedule: course.schedule ?? "",
      description: course.description ?? "",
      isActive: course.isActive,
    });
  };

  const handleDelete = async (courseId: string) => {
    if (!token || !canDelete) return;
    if (!confirm("해당 커리큘럼을 삭제하시겠습니까?")) return;

    try {
      const response = await api.delete<ApiResponse<unknown>>(endpoints.courses.delete(courseId), token);
      if (response.success) {
        setMessage("클래스가 삭제되었습니다.");
        fetchCourses();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "클래스 삭제 중 오류가 발생했습니다.";
      setMessage(errorMessage);
    }
  };

  const handleToggleActive = async (course: Course) => {
    if (!token || !canManage) return;
    try {
      const response = await api.put<ApiResponse<Course>>(endpoints.courses.update(course.id), { isActive: !course.isActive }, token);
      if (response.success) {
        fetchCourses();
      }
    } catch (error) {
      console.error("Failed to update course status", error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <DashboardLayout
        userName={user?.name || "관리자"}
        userSubtitle="코딩메이커 아카데미"
        sidebarItems={adminSidebar}
        headerTitle="클래스 관리"
        headerSubtitle="데이터를 불러오는 중..."
        requiredTier={2}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">클래스 정보를 불러오는 중...</p>
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
      headerTitle="클래스 관리"
      headerSubtitle="전체 클래스 현황을 관리하세요"
      requiredTier={2}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">전체 클래스</h2>
            <p className="text-sm text-muted-foreground">총 {courses.length}개 커리큘럼 운영 중</p>
          </div>
          {canManage && (
            <Button onClick={resetForm} variant={editingId ? "outline" : "default"} className="gap-2">
              <span className="material-symbols-outlined text-base">{editingId ? "refresh" : "add"}</span>
              {editingId ? "신규 등록으로 전환" : "새 클래스 추가"}
            </Button>
          )}
        </div>

        {canManage && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "클래스 수정" : "새 클래스 등록"}</CardTitle>
              <CardDescription>커리큘럼 정보를 입력해 즉시 반영하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-semibold text-foreground">클래스명</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="예: 웹 개발 심화"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-semibold text-foreground">카테고리</label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="웹/임베디드/자격증 등"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-semibold text-foreground">담당 강사</label>
                  <Input
                    value={form.instructor}
                    onChange={(e) => setForm((prev) => ({ ...prev, instructor: e.target.value }))}
                    placeholder="강사 이름"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-semibold text-foreground">일정</label>
                  <Input
                    value={form.schedule}
                    onChange={(e) => setForm((prev) => ({ ...prev, schedule: e.target.value }))}
                    placeholder="예: 화/목 16:00-17:30"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground">설명</label>
                  <Textarea
                    value={form.description ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="클래스에 대한 상세 내용을 입력하세요."
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    <span className="material-symbols-outlined text-base">save</span>
                    {editingId ? "변경사항 저장" : "등록"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="ghost" onClick={resetForm}>
                      취소
                    </Button>
                  )}
                  {message && <p className="text-sm text-muted-foreground">{message}</p>}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((cls) => (
            <Card key={cls.id} className={!cls.isActive ? "border-orange-200 bg-orange-50 dark:bg-orange-950/10" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{cls.title}</CardTitle>
                    <CardDescription>{cls.instructor || "담당 강사 미정"}</CardDescription>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    cls.isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {cls.isActive ? "진행중" : "대기"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>{cls.schedule || "일정 미정"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="material-symbols-outlined text-base">category</span>
                  <span>{cls.category}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{cls.description || "등록된 설명이 없습니다."}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>수강생 {cls.enrolledCount}명</span>
                  <button className="text-primary hover:underline" onClick={() => router.push("/curriculum")}>커리큘럼 보기</button>
                </div>
                {canManage && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" size="sm" onClick={() => handleEdit(cls)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleToggleActive(cls)}>
                      {cls.isActive ? "일시정지" : "활성화"}
                    </Button>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cls.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {courses.length === 0 && (
            <p className="text-sm text-muted-foreground md:col-span-2 lg:col-span-3">
              등록된 커리큘럼이 없습니다. 새 클래스를 추가해주세요.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
