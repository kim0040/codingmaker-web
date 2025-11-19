export const parentSidebar = [
  { label: "대시보드", icon: "family_home", href: "/parent" },
  { label: "자녀 정보", icon: "face", href: "/parent/child" },
  { label: "출결", icon: "fact_check", href: "/parent/attendance" },
  { label: "커리큘럼", icon: "list_alt", href: "/parent/curriculum" },
  { label: "상담", icon: "support_agent", href: "/parent/consult" },
];

export const childProfile = {
  name: "김코딩",
  summary: "자녀의 출석, 수강 클래스, 커리큘럼 진행 상황을 확인하세요.",
};

export const attendanceSummary = {
  monthlyRate: 95,
  change: "+5%",
  breakdown: [
    { label: "출석", value: "19회" },
    { label: "지각", value: "1회" },
    { label: "결석", value: "0회" },
  ],
};

export const parentClasses = [
  {
    title: "파이썬으로 배우는 알고리즘 기초",
    teacher: "박해커",
    nextSession: "2024-08-05 (월) 16:00",
    highlight: true,
  },
  {
    title: "웹 개발 마스터 과정",
    teacher: "이코딩",
    nextSession: "2024-08-07 (수) 18:00",
  },
];

export const curriculumSteps = [
  {
    title: "1단계: 파이썬 기초 문법",
    description: "변수, 자료형, 조건문, 반복문 학습",
    status: "completed",
  },
  {
    title: "2단계: 자료구조의 이해",
    description: "리스트, 튜플, 딕셔너리 등 기본 자료구조 활용",
    status: "completed",
  },
  {
    title: "3단계: 정렬 알고리즘",
    description: "버블/선택/삽입 정렬의 원리와 구현",
    status: "in-progress",
  },
  {
    title: "4단계: 탐색 알고리즘",
    description: "순차 탐색, 이진 탐색 학습",
    status: "upcoming",
  },
  {
    title: "5단계: 미니 프로젝트",
    description: "학습한 알고리즘을 활용한 프로젝트",
    status: "upcoming",
  },
];
