export const studentSidebar = [
  { label: "대시보드", icon: "space_dashboard", href: "/student" },
  { label: "내 클래스", icon: "menu_book", href: "/student/classes" },
  { label: "프로젝트", icon: "deployed_code", href: "/collab" },
  { label: "LMS 강의실", icon: "code", href: "/lms" },
  { label: "커뮤니티", icon: "forum", href: "/community" },
  { label: "채팅", icon: "chat", href: "/chat" },
  { label: "알림", icon: "notifications", href: "/student/notifications" },
];

export const myClasses = [
  {
    title: "UI/UX 디자인 입문반",
    teacher: "이디자인",
    date: "5/24 14:00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxADdLTCwfcGKHNmKmLXWO8HLcx2rMGH_lucc-hwNSuVadzY7HYdmKM-sTbvO58hu2n4sSgy21OjJcMk2Jwp-tW74OkOU9EgwSBwFPIKFMD-FGoMPMzKACAucY8env2jSFWgp_SYbvRCUfr8lX3nfnCwLzW09SZLydYvSEqgacFdnCggBEhA5lbpz82YEse-5ImoxKH-b6G7JgYyJ_FkQw9qXPXc34KgHLvAczWKO2Lyw3NfzAACQPYWWM7JqK0ScHmbEBt9DxqD4",
  },
  {
    title: "파이썬 데이터 분석",
    teacher: "박데이터",
    date: "5/25 10:00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBEnUNICWffbrlpo9xyTI2TIakkiZFWu5q9d0VML7-fhl9PEMMVvOmP7FKm8W1qDv3N7sXn0Y_A7yZJaqT062NvirRZW7lEj6hIKS3dlUY8h9w3tDw8xPE70YtIXbXX7IuyapDoIdsV3tHqCHamuX9-JaTyvKp3LbQmNK9VGivWEjBrXlo7c1Oc5ZNCuRfUgXR8SliLNpfyAIBD20qZ5IGFfIb8D04lOBrDBjJeYAaAkO8RWQSLIJovPpDuvE3LpzlalgjISoASUQ",
  },
  {
    title: "프론트엔드 개발 실전",
    teacher: "최코딩",
    date: "5/26 16:00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpsoqpyMlqg9ZUV611LfVGzS8-3IeJbFQSN6TqkpXwPrlcOGMo8jJNFtiU8m2Jpt6spCxAM6yKCV5LW5Z_eY6sCUW7x5C6Q3dg5v3kv5DVLF4Q58AWFlLUUZorfAM4bXRSoUHBHwlZ-sxC4YDW5Wiy91WPfz3KPew5gN9o1aMwlNSxHG3xDFXIG_n2zpstsZUkPgNurWAp_1z5dlEOLxDnJxZfx25jjvJdobK34mrY0--C7hqeUe4KDXJciWzOX6UR4e7-FJm90BU",
  },
];

export const todaysAttendance = {
  status: "출석 완료",
  time: "오전 9시 52분",
  description: "오늘 출석이 정상적으로 처리되었습니다.",
};

export const ongoingProjects = [
  {
    name: "포트폴리오 웹사이트 제작",
    due: "6/15",
    progress: 75,
    accent: "primary",
  },
  {
    name: "팀 협업 앱 개발",
    due: "7/1",
    progress: 40,
    accent: "accent",
  },
];

export const studentNotifications = [
  {
    title: "[공지] 5월 휴강 안내",
    time: "2시간 전",
    icon: "campaign",
    unread: true,
  },
  {
    title: "[과제] UI/UX 디자인 과제 제출 알림",
    time: "1일 전",
    icon: "assignment",
    unread: true,
  },
  {
    title: "이디자인 강사님이 메시지를 보냈습니다.",
    time: "2일 전",
    icon: "chat_bubble",
  },
  {
    title: "[공지] 서버 점검 안내 (5/20 02:00)",
    time: "4일 전",
    icon: "campaign",
  },
];
