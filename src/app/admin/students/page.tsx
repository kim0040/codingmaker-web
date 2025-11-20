"use client";

import { useState, useEffect } from "react";
import { adminSidebar } from "@/data/admin";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminStudentsPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

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
      fetchStudents();
    }
  }, [user, token, authLoading]);

  const fetchStudents = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams();
      if (filterRole !== "all") params.append("role", filterRole);
      if (searchTerm) params.append("search", searchTerm);
      
      const url = `/users${params.toString() ? `?${params.toString()}` : ''}`;
      const response: any = await api.get(url, token);
      if (response.success) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!token || user?.tier !== 1) {
      alert("최고 관리자만 사용자를 삭제할 수 있습니다.");
      return;
    }
    if (!confirm(`${studentName} 학생을 삭제하시겠습니까?`)) return;
    
    try {
      const response: any = await api.delete(`/users/${studentId}`, token);
      if (response.success) {
        alert("학생이 삭제되었습니다.");
        fetchStudents();
      }
    } catch (error: any) {
      alert(error.message || "학생 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (user && token) {
        fetchStudents();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterRole]);

  if (authLoading || isLoading) {
    return (
      <DashboardLayout
        userName="로딩 중..."
        userSubtitle="코딩메이커 아카데미"
        sidebarItems={adminSidebar}
        headerTitle="학생 관리"
        headerSubtitle="데이터를 불러오는 중..."
        requiredTier={2}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">학생 정보를 불러오는 중...</p>
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
      headerTitle="학생 관리"
      headerSubtitle="전체 학생 정보를 관리하세요"
      requiredTier={2}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>전체 학생 명단 ({students.length}명)</CardTitle>
              <CardDescription>실시간 학생 정보</CardDescription>
            </div>
            <Button onClick={() => router.push("/admin/students/add")}>
              <span className="material-symbols-outlined text-base mr-2">person_add</span>
              학생 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                search
              </span>
              <Input
                placeholder="아이디로 검색"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="STUDENT">학생</option>
              <option value="TEACHER">강사</option>
              <option value="PARENT">학부모</option>
              <option value="ADMIN">관리자</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">이름</th>
                  <th className="py-3 px-4">역할</th>
                  <th className="py-3 px-4">연락처</th>
                  <th className="py-3 px-4">권한</th>
                  <th className="py-3 px-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      등록된 학생이 없습니다.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="border-b border-border/60 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium text-foreground">{student.name}</td>
                      <td className="py-3 px-4">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          {student.role === 'STUDENT' ? '학생' : student.role === 'TEACHER' ? '강사' : student.role === 'PARENT' ? '학부모' : '관리자'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{student.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <span className="text-muted-foreground">Tier {student.tier}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.push(`/admin/students/${student.id}`)}
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </Button>
                          {user?.tier === 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteStudent(student.id, student.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
