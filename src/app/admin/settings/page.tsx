"use client";

import { adminSidebar } from "@/data/admin";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  return (
    <DashboardLayout
      userName="김 원장"
      userSubtitle="코딩메이커 아카데미"
      sidebarItems={adminSidebar}
      headerTitle="설정"
      headerSubtitle="학원 및 계정 설정을 관리하세요"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>학원 정보</CardTitle>
            <CardDescription>학원의 기본 정보를 관리합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">학원명</label>
                <Input defaultValue="코딩메이커 아카데미" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">연락처</label>
                <Input defaultValue="061-745-3355" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">주소</label>
                <Input defaultValue="전남 광양시 무등길 47 (중동 1549-9)" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">운영 시간 (평일)</label>
                <Input defaultValue="14:00~19:00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">운영 시간 (토요일)</label>
                <Input defaultValue="14:00~17:00" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => alert('학원 정보 저장 기능은 백엔드 연결 후 사용 가능합니다.')}>
                저장하기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>계정 설정</CardTitle>
            <CardDescription>관리자 계정 정보를 관리합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">이름</label>
                <Input defaultValue="김 원장" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">이메일</label>
                <Input type="email" defaultValue="admin@codingmaker.co.kr" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => alert('계정 정보 저장 기능은 백엔드 연결 후 사용 가능합니다.')}>
                저장하기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>알림 설정</CardTitle>
            <CardDescription>받고 싶은 알림을 설정합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "새 학생 등록", description: "새로운 학생이 등록되면 알림" },
              { label: "출결 알림", description: "학생 출결 상태 변경 시 알림" },
              { label: "커뮤니티 활동", description: "새 질문이나 답변이 등록되면 알림" },
              { label: "시스템 알림", description: "시스템 업데이트 및 공지사항" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`${item.label} 설정이 변경되었습니다.`)}
                >
                  켜기
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
