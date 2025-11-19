"use client";

import { adminSidebar, studentTable } from "@/data/admin";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminStudentsPage() {
  return (
    <DashboardLayout
      userName="김 원장"
      userSubtitle="코딩메이커 아카데미"
      sidebarItems={adminSidebar}
      headerTitle="학생 관리"
      headerSubtitle="전체 학생 정보를 관리하세요"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>전체 학생 명단</CardTitle>
              <CardDescription>소수 정예 클래스별 학생 현황</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => alert('학생 추가 기능은 백엔드 연결 후 사용 가능합니다.')}>
                <span className="material-symbols-outlined text-base">person_add</span>
                학생 추가
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                search
              </span>
              <Input
                placeholder="학생 이름 검색"
                className="pl-10"
              />
            </div>
            <select className="rounded-lg border border-border bg-background px-4 py-2 text-sm">
              {studentTable.filterClasses.map((cls) => (
                <option key={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">이름</th>
                  <th className="py-3 px-4">클래스</th>
                  <th className="py-3 px-4">연락처</th>
                  <th className="py-3 px-4">출석률</th>
                  <th className="py-3 px-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {studentTable.rows.map((row, index) => (
                  <tr key={row.name} className="border-b border-border/60 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">{row.name}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                        {row.className}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">010-****-{1000 + index}</td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-semibold">{90 + (index % 10)}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => alert(`${row.name} 학생 상세 정보는 추후 추가될 예정입니다.`)}>
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => alert('학생 정보 수정 기능은 백엔드 연결 후 사용 가능합니다.')}>
                          <span className="material-symbols-outlined text-base">edit</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
