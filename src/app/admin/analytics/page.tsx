"use client";

import { adminSidebar } from "@/data/admin";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Recharts는 추후 설치 예정: npm install recharts
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock 데이터 (백엔드 연결 시 API에서 가져옴)
const attendanceData = [
  { date: '11/01', rate: 85 },
  { date: '11/02', rate: 92 },
  { date: '11/03', rate: 88 },
  { date: '11/04', rate: 95 },
  { date: '11/05', rate: 90 },
  { date: '11/06', rate: 87 },
  { date: '11/07', rate: 93 },
];

const classSubmissionData = [
  { className: 'Alpha 클래스', submission: 85 },
  { className: 'Beta 클래스', submission: 92 },
  { className: 'Gamma 클래스', submission: 78 },
  { className: 'Delta 클래스', submission: 88 },
];

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout
      userName="김 원장"
      userSubtitle="코딩메이커 아카데미"
      sidebarItems={adminSidebar}
      headerTitle="데이터 분석"
      headerSubtitle="학원 운영 통계 및 트렌드를 확인하세요"
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 학생</CardDescription>
              <CardTitle className="text-3xl">26명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-semibold">↑ 12%</span> 지난달 대비
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>평균 출석률</CardDescription>
              <CardTitle className="text-3xl">89.2%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 font-semibold">↑ 3.5%</span> 지난주 대비
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>진행 중인 클래스</CardDescription>
              <CardTitle className="text-3xl">4개</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                임베디드 2개, 웹툰 2개
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>과제 제출률</CardDescription>
              <CardTitle className="text-3xl">85.8%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600 font-semibold">↓ 2.1%</span> 지난주 대비
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>일별 출석률 추이</CardTitle>
            <CardDescription>최근 7일간의 출석률 변화</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full border-2 border-dashed border-border rounded-lg">
              <div className="text-center space-y-2">
                <span className="material-symbols-outlined text-6xl text-muted-foreground">
                  insert_chart
                </span>
                <p className="text-muted-foreground">
                  Recharts 라이브러리 설치 후 차트가 표시됩니다
                </p>
                <p className="text-xs text-muted-foreground">
                  npm install recharts
                </p>
              </div>
            </div>
            {/* TODO: Recharts 설치 후 주석 해제
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#359EFF" strokeWidth={2} name="출석률 (%)" />
              </LineChart>
            </ResponsiveContainer>
            */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>클래스별 과제 제출률</CardTitle>
            <CardDescription>클래스별 과제 완료 현황</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full border-2 border-dashed border-border rounded-lg">
              <div className="text-center space-y-2">
                <span className="material-symbols-outlined text-6xl text-muted-foreground">
                  bar_chart
                </span>
                <p className="text-muted-foreground">
                  Recharts 라이브러리 설치 후 차트가 표시됩니다
                </p>
              </div>
            </div>
            {/* TODO: Recharts 설치 후 주석 해제
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classSubmissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="className" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="submission" fill="#359EFF" name="제출률 (%)" />
              </BarChart>
            </ResponsiveContainer>
            */}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>시간대별 접속 현황</CardTitle>
              <CardDescription>학생들의 LMS 접속 시간 분포</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '14:00-16:00', count: 12, percentage: 45 },
                  { time: '16:00-18:00', count: 18, percentage: 68 },
                  { time: '18:00-20:00', count: 8, percentage: 30 },
                  { time: '20:00-22:00', count: 4, percentage: 15 },
                ].map((slot) => (
                  <div key={slot.time} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{slot.time}</span>
                      <span className="text-muted-foreground">{slot.count}명</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${slot.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
              <CardDescription>최근 1시간 내 시스템 활동</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: '김코딩', action: 'LMS 강의 수강', time: '5분 전' },
                  { user: '이해커', action: '과제 제출', time: '12분 전' },
                  { user: '박디자인', action: '커뮤니티 게시글 작성', time: '23분 전' },
                  { user: '최메이커', action: '출석 체크', time: '35분 전' },
                  { user: '정코더', action: '프로젝트 업로드', time: '48분 전' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="material-symbols-outlined text-sm text-primary">
                        person
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.user}</p>
                      <p className="text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">analytics</span>
              분석 기능 안내
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>백엔드 API 연결 시 추가로 제공되는 분석 기능:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>실시간 데이터 업데이트 (자동 새로고침)</li>
              <li>커스텀 기간 설정 (일/주/월/년)</li>
              <li>데이터 내보내기 (Excel, CSV)</li>
              <li>학생별 상세 리포트 생성</li>
              <li>예측 분석 (출석률, 성적 트렌드)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
