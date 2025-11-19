"use client";

import { parentSidebar, attendanceSummary, childProfile } from "@/data/parent";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const monthlyData = [
  { date: "2024-11-01", status: "출석", time: "14:05" },
  { date: "2024-11-04", status: "출석", time: "13:58" },
  { date: "2024-11-06", status: "지각", time: "14:15" },
  { date: "2024-11-08", status: "출석", time: "14:02" },
  { date: "2024-11-11", status: "출석", time: "14:00" },
  { date: "2024-11-13", status: "출석", time: "13:55" },
  { date: "2024-11-15", status: "출석", time: "14:03" },
  { date: "2024-11-18", status: "출석", time: "14:01" },
];

export default function ParentAttendancePage() {
  return (
    <DashboardLayout
      userName="김학부모"
      userSubtitle="CodingMaker Academy"
      sidebarItems={parentSidebar}
      headerTitle="출결 관리"
      headerSubtitle={`${childProfile.name} 학생의 출결 현황`}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>이번 달 출석률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-primary">{attendanceSummary.monthlyRate}%</p>
                  <p className="font-semibold text-green-500">{attendanceSummary.change}</p>
                </div>
                <div className="h-3 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${attendanceSummary.monthlyRate}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {attendanceSummary.breakdown.map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardTitle className="text-base">{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>상세 출결 기록</CardTitle>
                <CardDescription>최근 출석 내역을 확인하세요</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <span className="material-symbols-outlined text-base">download</span>
                다운로드
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">날짜</th>
                    <th className="py-3 px-4">상태</th>
                    <th className="py-3 px-4">시간</th>
                    <th className="py-3 px-4">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((record) => (
                    <tr key={record.date} className="border-b border-border/60 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium text-foreground">{record.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            record.status === "출석"
                              ? "bg-green-100 text-green-700"
                              : record.status === "지각"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{record.time}</td>
                      <td className="py-3 px-4 text-muted-foreground">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
