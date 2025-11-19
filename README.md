# 🎓 코딩메이커 아카데미 통합 관리 시스템

> **광양 코딩메이커학원**의 학생, 강사, 학부모를 위한 올인원 웹 플랫폼

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Private-red)

---

## 📋 프로젝트 개요

**코딩메이커 아카데미 허브**는 임베디드/코딩, 웹툰/창작, 자격증 반으로 구성된 학원의 커리큘럼 관리 및 학생·학부모 소통을 위한 통합 플랫폼입니다.

### 🎯 주요 기능

- **🔐 티어별 권한 시스템** (Tier 1~5)
- **📚 LMS 강의실** (Monaco Editor 통합)
- **✅ 키오스크 출석 체크** (터치 최적화)
- **👨‍👩‍👧 학부모 대시보드** (자녀 정보 실시간 조회)
- **💬 커뮤니티 & 협업 공간**
- **📊 데이터 분석 대시보드** (관리자 전용)
- **🎨 다크/라이트 테마** (시스템 자동 연동)

---

## 🚀 빠른 시작

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd codingmaker-web
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Theme**: next-themes
- **Code Editor**: @monaco-editor/react
- **Icons**: Material Symbols Outlined, Lucide React

### Backend (예정)
- **ORM**: Prisma
- **Database**: MySQL (Production), SQLite (Development)
- **Auth**: JWT
- **Realtime**: Socket.io
- **Security**: AES-256 (Random IV), bcrypt

---

## 📂 프로젝트 구조

```
codingmaker-web/
├── src/
│   ├── app/                 # Next.js 페이지 (App Router)
│   │   ├── page.tsx         # 홈페이지
│   │   ├── auth/            # 로그인/회원가입
│   │   ├── admin/           # 관리자 대시보드
│   │   ├── student/         # 학생 대시보드
│   │   ├── parent/          # 학부모 대시보드
│   │   ├── lms/             # LMS 강의실
│   │   ├── community/       # 커뮤니티
│   │   ├── collab/          # 프로젝트 협업
│   │   └── kiosk/           # 출석 키오스크
│   ├── components/          # 재사용 컴포넌트
│   │   ├── ui/              # shadcn/ui 스타일
│   │   └── layout/          # Header, Footer, DashboardLayout
│   ├── contexts/            # React Context (AuthContext)
│   ├── data/                # Mock 데이터
│   ├── hooks/               # Custom Hooks
│   ├── lib/                 # 유틸리티 (api.ts, crypto.ts 예정)
│   └── types/               # TypeScript 타입 정의
├── public/                  # 정적 파일
├── FINAL_HANDOVER_GUIDE.md  # 백엔드 인수인계 가이드 ⭐
├── SECURITY_CHECKLIST.md    # 보안 체크리스트 ⭐
└── package.json
```

---

## 🔐 보안 정책

### 암호화 (AES-256 + Random IV)
- 사용자 실명, 전화번호, 주소
- 상담 기록, 채팅 메시지
- **⚠️ 매번 새로운 Random IV 생성 필수**

### 인증/권한
- JWT 토큰 기반 인증
- Tier 1~5 권한 시스템
- 프론트엔드 UX 권한 체크 + 백엔드 최종 검증

**자세한 내용**: [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md)

---

## 📖 문서

| 문서 | 설명 |
|------|------|
| **[FINAL_HANDOVER_GUIDE.md](./FINAL_HANDOVER_GUIDE.md)** | 백엔드 개발자 인수인계 가이드 ⭐ |
| **[SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md)** | 보안 강화 체크리스트 |
| [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) | API 연결 가이드 |
| [TIER_ACCESS_SPEC.md](./TIER_ACCESS_SPEC.md) | 티어별 접근 권한 명세 |
| [ENV_SETUP.md](./ENV_SETUP.md) | 환경변수 설정 방법 |
| [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) | 구현 현황 |

---

## 🎨 디자인 시스템

- **Primary Color**: #359EFF (신뢰감 있는 블루)
- **Fonts**: Inter (영문), Noto Sans KR (한글)
- **Icons**: Material Symbols Outlined
- **Theme**: 라이트/다크 자동 전환

---

## 📱 페이지 구성

### 공개 페이지
- `/` - 홈페이지 (학원 소개, 과정 안내)
- `/auth` - 로그인/회원가입

### 관리자 (Tier 1, 2)
- `/admin` - 대시보드
- `/admin/cms` - 콘텐츠 관리 (Tier 1만)
- `/admin/analytics` - 데이터 분석
- `/admin/classes` - 클래스 관리
- `/admin/students` - 학생 관리
- `/admin/settings` - 시스템 설정 (Tier 1만)

### 학생 (Tier 3-A)
- `/student` - 대시보드
- `/student/classes` - 내 클래스
- `/student/notifications` - 알림
- `/lms` - LMS 강의실
- `/community` - 커뮤니티
- `/collab` - 프로젝트 협업

### 학부모 (Tier 3-B)
- `/parent` - 대시보드
- `/parent/child` - 자녀 정보
- `/parent/attendance` - 출결 현황
- `/parent/curriculum` - 커리큘럼 진행도
- `/parent/consult` - 상담 신청

### 공용
- `/kiosk` - 출석 키오스크 (전체 화면)

---

## 🔌 백엔드 연결 가이드

### 1. 환경변수 설정

```bash
# .env.local 파일 생성
NEXT_PUBLIC_API_URL=http://localhost:3001/api
CIPHER_KEY=your-32-byte-hex-key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 2. API 클라이언트 사용

```typescript
import { api, endpoints } from '@/lib/api';

// 로그인
const response = await api.post(endpoints.auth.login, {
  username: 'user',
  password: 'pass'
});

// 출석 체크
await api.post(endpoints.attendance.checkin, { tag: '1234' }, token);
```

### 3. 주요 연결 포인트

- **출석 체크**: `/src/app/kiosk/page.tsx` (37번 줄)
- **로그인**: `/src/contexts/AuthContext.tsx` (login 함수)
- **학원 정보**: `/src/hooks/useAcademyInfo.ts` (36-37번 줄)

**자세한 내용**: [FINAL_HANDOVER_GUIDE.md](./FINAL_HANDOVER_GUIDE.md)

---

## 🧪 테스트

### 수동 테스트 완료
- ✅ 모든 페이지 접속
- ✅ 테마 전환
- ✅ 반응형 레이아웃
- ✅ 버튼 클릭 동작
- ✅ 사이드바 토글
- ✅ 키오스크 입력

### 브라우저 호환
- Chrome, Safari, Firefox, Edge (최신 버전)

---

## 📦 빌드 & 배포

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### Vercel 배포 (권장)

```bash
npm install -g vercel
vercel deploy --prod
```

---

## 🏫 학원 정보

**코딩메이커학원**
- 📍 주소: 전남 광양시 무등길 47 (중동 1549-9)
- ☎️ 전화: 061-745-3355
- 🌐 웹사이트: www.codingmaker.co.kr
- 📝 블로그: https://blog.naver.com/kkj0201
- 📷 인스타그램: @codingmaker_kj
- ⏰ 운영시간: 평일 14:00~19:00, 토 14:00~17:00

---

## 👥 기여

### 프론트엔드
- UI/UX 구현 완료
- 백엔드 연결 대기 중

### 백엔드 (개발 예정)
- Prisma 스키마 정의
- API 라우트 구현
- 암호화 시스템
- Socket.io 실시간 통신

---

## 📄 라이선스

Private - 코딩메이커학원 전용

---

## 📞 문의

백엔드 통합 관련 문의: [FINAL_HANDOVER_GUIDE.md](./FINAL_HANDOVER_GUIDE.md) 참조

**🎉 프론트엔드 개발 완료 - 백엔드 개발자에게 인계 준비 완료!**
