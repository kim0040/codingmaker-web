"use client";

import { adminSidebar } from "@/data/admin";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminCMSPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      userName={user?.name || "관리자"}
      userSubtitle="코딩메이커 아카데미"
      sidebarItems={adminSidebar}
      headerTitle="콘텐츠 관리 (CMS)"
      headerSubtitle="학원 정보 및 사이트 설정을 관리하세요"
      requiredTier={1}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>학원 기본 정보</CardTitle>
            <CardDescription>
              홈페이지와 Footer에 표시되는 학원 정보를 관리합니다. 변경사항은 즉시 반영됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">학원명</label>
                <Input defaultValue="코딩메이커학원" placeholder="학원 이름" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">대표 전화</label>
                <Input defaultValue="061-745-3355" placeholder="전화번호" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">주소</label>
                <Input defaultValue="전남 광양시 무등길 47 (중동 1549-9)" placeholder="학원 주소" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">운영 시간 (평일)</label>
                <Input defaultValue="평일 14:00~19:00" placeholder="예: 평일 14:00~19:00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">운영 시간 (주말)</label>
                <Input defaultValue="토요일 14:00~17:00" placeholder="예: 토요일 14:00~17:00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">이메일</label>
                <Input defaultValue="info@codingmaker.co.kr" placeholder="문의 이메일" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">홈페이지</label>
                <Input defaultValue="www.codingmaker.co.kr" placeholder="홈페이지 URL" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline">미리보기</Button>
              <Button onClick={() => alert('학원 정보가 업데이트되었습니다!')}>
                저장하기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>소셜 미디어 링크</CardTitle>
            <CardDescription>소셜 미디어 계정 링크를 관리합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">네이버 블로그</label>
                <Input defaultValue="https://blog.naver.com/kkj0201" placeholder="블로그 URL" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">인스타그램</label>
                <Input defaultValue="https://www.instagram.com/codingmaker_kj/" placeholder="인스타그램 URL" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">유튜브 (선택)</label>
                <Input placeholder="유튜브 채널 URL" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">페이스북 (선택)</label>
                <Input placeholder="페이스북 페이지 URL" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => alert('소셜 미디어 링크가 업데이트되었습니다!')}>
                저장하기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>홈페이지 메인 메시지</CardTitle>
            <CardDescription>메인 페이지의 히어로 섹션 문구를 수정합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">메인 타이틀</label>
              <Input 
                defaultValue="미래를 코딩하다, 코딩메이커학원" 
                placeholder="메인 페이지 제목"
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">서브 타이틀</label>
              <textarea
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[100px]"
                defaultValue="23년 경력 임베디드 전문가와 20년 경력 웹툰 작가가 이끄는 실무 중심 커리큘럼. 소수 정예·맞춤형 상담으로 학생부터 직장인까지 모두 성장합니다."
                placeholder="메인 페이지 설명"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => alert('메인 메시지가 업데이트되었습니다!')}>
                저장하기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-600">info</span>
              백엔드 연결 안내
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>현재는 UI만 구현된 상태입니다. 백엔드 API가 연결되면 다음 기능이 활성화됩니다:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>실시간 정보 수정 및 즉시 반영</li>
              <li>변경 이력 관리 (감사 로그)</li>
              <li>이미지 업로드 (로고, 배너 등)</li>
              <li>다국어 지원 (한/영)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
