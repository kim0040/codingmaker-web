export const adminSidebar = [
  { label: "대시보드", icon: "dashboard", href: "/admin" },
  { label: "클래스", icon: "school", href: "/admin/classes" },
  { label: "학생", icon: "groups", href: "/admin/students" },
  { label: "데이터 분석", icon: "analytics", href: "/admin/analytics" },
  { label: "콘텐츠 관리", icon: "edit_note", href: "/admin/cms" },
  { label: "커뮤니티", icon: "forum", href: "/community" },
  { label: "설정", icon: "settings", href: "/admin/settings" },
];

export type TrendColor = "positive" | "negative";

export const adminStats = [
  { label: "총 원생 수", value: "124", trend: "+2%", trendColor: "positive" },
  { label: "진행중인 클래스", value: "8", trend: "+0%", trendColor: "positive" },
  { label: "오늘 출석률", value: "95%", trend: "-1%", trendColor: "negative" },
  { label: "미확인 질문", value: "3", trend: "+3", trendColor: "positive" },
] satisfies Array<{
  label: string;
  value: string;
  trend: string;
  trendColor: TrendColor;
}>;

export const studentTable = {
  filterClasses: ["전체 클래스", "Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
  rows: [
    { name: "김민준", className: "Alpha" },
    { name: "이서아", className: "Beta" },
    { name: "박도윤", className: "Gamma" },
    { name: "최하은", className: "Delta" },
    { name: "정시우", className: "Epsilon" },
    { name: "강지안", className: "Alpha" },
    { name: "윤아린", className: "Beta" },
  ],
};

export const attendanceCalendar = {
  month: "2024년 8월",
  days: [
    { day: "28", muted: true },
    { day: "29", muted: true },
    { day: "30", muted: true },
    { day: "31", muted: true },
    { day: "1" },
    { day: "2" },
    { day: "3" },
    { day: "4" },
    { day: "5", badge: "present" },
    { day: "6", badge: "present" },
    { day: "7", badge: "absent" },
    { day: "8", badge: "present" },
    { day: "9" },
    { day: "10" },
    { day: "11" },
    { day: "12", badge: "present" },
    { day: "13", badge: "present" },
    { day: "14", badge: "present" },
    { day: "15", badge: "present" },
    { day: "16" },
    { day: "17" },
    { day: "18", current: true },
    { day: "19" },
    { day: "20" },
    { day: "21" },
    { day: "22" },
    { day: "23" },
    { day: "24" },
    { day: "25" },
    { day: "26" },
    { day: "27" },
    { day: "28" },
    { day: "29" },
    { day: "30" },
    { day: "31" },
  ],
};

export const classDistribution = [
  { label: "Alpha", value: 20 },
  { label: "Beta", value: 50 },
  { label: "Gamma", value: 30 },
  { label: "Delta", value: 100, highlight: true },
  { label: "Epsilon", value: 10 },
];

export const weeklyAttendance = [90, 95, 92, 88, 96, 94];

export const todaySchedule = [
  {
    icon: "code",
    time: "14:00 - 15:30",
    title: "Alpha 클래스 (기초 파이썬)",
    teacher: "이선생님",
  },
  {
    icon: "data_object",
    time: "16:00 - 17:30",
    title: "Gamma 클래스 (웹 개발 심화)",
    teacher: "박선생님",
  },
  {
    icon: "terminal",
    time: "18:00 - 19:30",
    title: "Delta 클래스 (알고리즘)",
    teacher: "최선생님",
  },
];

export const communityFeed = [
  { title: "[공지] 8월 학원 방학 일정 안내", meta: "관리자 · 2시간 전" },
  { title: "[질문] 파이썬 과제 제출 관련 질문입니다.", meta: "김민준 학생 · 5시간 전" },
  { title: "[질문] 웹 개발 클래스 보충수업 가능한가요?", meta: "박서연 학부모님 · 1일 전" },
  { title: "[공지] 코딩 경진대회 참가 안내", meta: "관리자 · 2일 전" },
];
