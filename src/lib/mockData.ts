import type { AttendanceCalendar, AttendanceSummary, CommunityPost, NotificationItem, ParentClass, ProjectProgress, SidebarItem, StudentClass } from "@/types";

export const mockUsers = [
  { id: "stu-001", name: "김민준", phone_last_4: "1234", class_id: "class-alpha", avatar_url: "https://i.pravatar.cc/100?img=1" },
  { id: "stu-002", name: "이서아", phone_last_4: "5678", class_id: "class-beta", avatar_url: "https://i.pravatar.cc/100?img=2" },
];

export const mockClasses = [
  { id: "class-alpha", title: "Alpha", instructor: "이선생님", schedule_time: "14:00", curriculum_list: ["기초 파이썬", "자료구조", "알고리즘"] },
  { id: "class-beta", title: "Beta", instructor: "박선생님", schedule_time: "16:00", curriculum_list: ["웹 개발", "API 설계"] },
];

export const mockAttendanceLogs = [
  { id: "att-001", student_id: "stu-001", date: "2024-08-01", status: "present", timestamp: "09:02" },
  { id: "att-002", student_id: "stu-002", date: "2024-08-01", status: "late", timestamp: "09:18" },
];

export const mockNotices: CommunityPost[] = [
  { id: 201, title: "8월 휴강 안내", replies: 0, author: "관리자", date: "2024-08-01", views: 120, likes: 8 },
  { id: 202, title: "파이썬 과제 Q&A", replies: 5, author: "학생회", date: "2024-08-02", views: 340, likes: 25 },
];

export const mockSidebar: SidebarItem[] = [
  { label: "대시보드", icon: "dashboard", href: "/", active: true },
  { label: "클래스", icon: "school", href: "/class" },
  { label: "학생", icon: "groups", href: "/students" },
  { label: "커뮤니티", icon: "forum", href: "/community" },
  { label: "설정", icon: "settings", href: "/settings" },
];

export const mockAttendanceSummary: AttendanceSummary = {
  monthlyRate: 95,
  change: "+5%",
  breakdown: [
    { label: "출석", value: "19회" },
    { label: "지각", value: "1회" },
    { label: "결석", value: "0회" },
  ],
};

export const mockAttendanceCalendar: AttendanceCalendar = {
  month: "2024년 8월",
  days: [
    { day: "28", muted: true },
    { day: "29", muted: true },
    { day: "30", muted: true },
    { day: "31", muted: true },
    { day: "1", badge: "present" },
    { day: "2", badge: "present" },
    { day: "3", badge: "absent" },
    { day: "4" },
  ],
};

export const mockStudentClasses: StudentClass[] = [
  { title: "UI/UX 디자인", teacher: "이디자인", date: "5/24 14:00", image: "https://i.pravatar.cc/400?img=12" },
  { title: "파이썬 데이터", teacher: "박데이터", date: "5/25 10:00", image: "https://i.pravatar.cc/400?img=13" },
];

export const mockProjects: ProjectProgress[] = [
  { name: "포트폴리오", due: "6/15", progress: 80, accent: "primary" },
  { name: "협업 앱", due: "7/01", progress: 40, accent: "accent" },
];

export const mockNotifications: NotificationItem[] = [
  { title: "[공지] 8월 휴강", time: "2시간 전", icon: "campaign", unread: true },
  { title: "[과제] UI/UX 제출", time: "1일 전", icon: "assignment", unread: true },
];

export const mockParentClasses: ParentClass[] = [
  { title: "파이썬 알고리즘", teacher: "박해커", nextSession: "2024-08-05 16:00", highlight: true },
  { title: "웹 개발 마스터", teacher: "이코딩", nextSession: "2024-08-07 18:00" },
];
