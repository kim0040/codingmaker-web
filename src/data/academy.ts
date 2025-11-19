import type {
  AcademyProfile,
  HeroStat,
  SummaryHighlight,
  CourseTrack,
  PriceItem,
  ReviewMetric,
  FacilityHighlights,
  ConsultationChannel,
} from "@/types";

export const academyProfile: AcademyProfile = {
  name: "코딩메이커학원",
  brand: "코딩메이커 아카데미 허브",
  tagline: "광양 대표 IT · 메이커 전문 교육기관",
  description:
    "코딩·임베디드부터 웹툰·창작, 컴활 특강까지 실무 중심 커리큘럼을 소수 정예로 운영합니다.",
  address: "전남 광양시 무등길 47 (중동 1549-9)",
  phone: "061-745-3355",
  hours: "평일 14:00~19:00 / 토 14:00~17:00",
  homepage: "https://www.codingmaker.co.kr",
  blog: "https://blog.naver.com/kkj0201",
  instagram: "https://www.instagram.com/codingmaker_kj/",
  summary:
    "전문가 강사진이 직접 지도하고, 실습 장비를 갖춘 환경에서 학생과 직장인 모두 맞춤형으로 학습합니다.",
  studentCapacity: "5~9명 소규모",
  duration: "장기 과정(24개월 이상) + 단기 특강",
};

export const heroStats: HeroStat[] = [
  { label: "강사진 만족도", value: "5.0 / 5.0", helper: "+0.2" },
  { label: "학생 추천율", value: "100%", helper: "+5%" },
  { label: "클래스 규모", value: "5~9명", helper: "소수 정예" },
  { label: "총 커리큘럼", value: "24개월+", helper: "장기/맞춤" },
];

export const summaryHighlights: SummaryHighlight[] = [
  {
    title: "전문 강사진",
    description:
      "임베디드 23년 경력 강사와 20년 경력 웹툰 작가가 직접 지도하는 실무형 수업",
  },
  {
    title: "실습 장비 완비",
    description: "전자키트, 3D 프린터, 클립스튜디오 등 창작/임베디드 장비 구비",
  },
  {
    title: "맞춤형 상담",
    description: "수강생 연령과 목적에 맞춘 구글폼 상담 및 커리큘럼 추천",
  },
];

export const courseTracks: CourseTrack[] = [
  {
    category: "코딩/임베디드",
    title: "임베디드 전문가 과정",
    subjects: ["C언어", "임베디드 프로그래밍", "회로이론", "기초전자"],
    target: "중학생~성인 / 직장인",
    features: ["23년 경력 강사", "실무·실습형", "야간·주말반"],
    price: "코딩종합(중급) 150,000원/1000분",
  },
  {
    category: "창작 메이커",
    title: "웹툰 · 디지털 크리에이티브",
    subjects: ["웹툰·인스타툰", "3D 프린터 모델링", "클립스튜디오", "스케치업"],
    target: "초·중·고~성인 / 직장인",
    features: ["웹툰 작가 20년 경력", "창작·디지털 제작", "실무 중심"],
    price: "컴퓨터그래픽스·하드코딩 170,000원/1000분",
  },
  {
    category: "특강",
    title: "컴활 2급 실기 집중반",
    subjects: ["컴활 2급 실기", "단기 실습"],
    target: "고등학생~성인",
    features: ["4주 8회", "선착순 소수정원", "실기 연습 집중"],
    price: "약 180,000원/8회 (재료비 별도)",
  },
];

export const priceList: PriceItem[] = [
  {
    name: "코딩종합 (중급)",
    price: "150,000원",
    unit: "/ 1000분",
    description: "임베디드·코딩 심화 커리큘럼",
  },
  {
    name: "컴퓨터그래픽스 (고급)",
    price: "170,000원",
    unit: "/ 1000분",
    description: "웹툰/디자인 프로덕션 과정",
  },
  {
    name: "하드코딩 (고급)",
    price: "170,000원",
    unit: "/ 1000분",
    description: "고급 알고리즘/프로젝트 중심",
  },
  {
    name: "컴활 2급 실기 특강",
    price: "약 180,000원",
    unit: "/ 8회",
    description: "4주 집중, 선착순 모집",
  },
];

export const reviewMetrics: ReviewMetric[] = [
  {
    label: "강사진의 강의력",
    score: "5.0 / 5.0",
    description: "실무 경력 기반 밀착 지도",
  },
  {
    label: "학생 추천율",
    score: "100%",
    description: "지역 대표 IT 교육기관",
  },
  {
    label: "커리큘럼 우수성",
    score: "3.0 / 5.0",
    description: "자율형 커리큘럼, 자기주도 학습",
  },
  {
    label: "시설·환경",
    score: "5.0 / 5.0",
    description: "최신 장비와 쾌적한 공간",
  },
];

export const facilityHighlights: FacilityHighlights = {
  capacity: "수강 인원 5~9명, 소수 정예",
  duration: "장기 과정(24개월 이상) + 단기 특강",
  strengths: [
    "최신 컴퓨터 및 실습 기자재 다수 보유",
    "프로젝트/실습 중심 좌석 배치",
    "학생 주도형 학습 문화",
  ],
  cautions: [
    "맞춤형이지만 강의식 비중은 낮아 자기주도 학습 필요",
    "실습 과목별 재료비가 발생할 수 있음",
  ],
};

export const consultationChannels: ConsultationChannel[] = [
  {
    label: "네이버 블로그",
    detail: "수강 후기와 공지 확인, 상담 신청",
    link: academyProfile.blog,
  },
  {
    label: "공식 홈페이지",
    detail: "커리큘럼 소개 및 문의",
    link: academyProfile.homepage,
  },
  {
    label: "구글폼 상담신청서",
    detail: "학생/학부모 맞춤형 상담 접수",
    link: "https://forms.gle/YourActualGoogleFormID",
  },
];
