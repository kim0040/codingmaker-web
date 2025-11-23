"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminSidebar } from "@/data/admin";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

interface CreateUserPayload {
  username: string;
  password: string;
  name: string;
  phone: string;
  tag: string;
  role: string;
  tier: number;
}

export default function AddStudentPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUserPayload & { passwordConfirm: string }>({
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phone: "",
    tag: "",
    role: "STUDENT",
    tier: 3,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.username || !formData.password || !formData.name) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);
    try {
      const { passwordConfirm, ...submitData } = formData;
      const response = await api.post<ApiResponse<unknown>>("/users", submitData, token);
      
      if (response.success) {
        alert("학생이 추가되었습니다.");
        router.push("/admin/students");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "학생 추가 중 오류가 발생했습니다.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      userName={user?.name || "관리자"}
      userSubtitle="코딩메이커 아카데미"
      sidebarItems={adminSidebar}
      headerTitle="학생 추가"
      headerSubtitle="새로운 학생을 등록하세요"
      requiredTier={2}
    >
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>학생 정보 입력</CardTitle>
          <CardDescription>모든 필수 항목(*)을 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 로그인 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">로그인 정보</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">아이디 *</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="student123"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">비밀번호 *</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">비밀번호 확인 *</label>
                <div className="relative">
                  <Input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={formData.passwordConfirm}
                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    className="pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPasswordConfirm ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                  <p className="text-xs text-red-600 dark:text-red-400">비밀번호가 일치하지 않습니다</p>
                )}
                {formData.passwordConfirm && formData.password === formData.passwordConfirm && (
                  <p className="text-xs text-green-600 dark:text-green-400">비밀번호가 일치합니다</p>
                )}
              </div>
            </div>

            {/* 개인 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">개인 정보</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">이름 *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="홍길동"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">연락처</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-1234-5678"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">출석 태그</label>
                <Input
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="1234"
                />
                <p className="text-xs text-muted-foreground">키오스크 출석용 고유 번호 (4자리 권장)</p>
              </div>
            </div>

            {/* 권한 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">권한 설정</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">역할</label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="STUDENT">학생</option>
                  <option value="TEACHER">강사</option>
                  <option value="PARENT">학부모</option>
                  {user && user.tier === 1 && <option value="ADMIN">관리자</option>}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">권한 Tier</label>
                <select
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: Number(e.target.value) })}
                >
                  {user && user.tier === 1 && <option value={1}>Tier 1 (최고 관리자)</option>}
                  {user && user.tier <= 2 && <option value={2}>Tier 2 (강사)</option>}
                  <option value={3}>Tier 3 (학생/학부모)</option>
                  <option value={4}>Tier 4 (대기)</option>
                </select>
                <p className="text-xs text-muted-foreground">낮은 숫자일수록 높은 권한</p>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "추가 중..." : "학생 추가"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
