# 프론트엔드 티어별 권한 구현 현황

## ✅ 구현 완료된 것

### 1. 기반 구조
- **AuthContext** (`/src/contexts/AuthContext.tsx`) - 권한 관리 컨텍스트
- **ProtectedRoute** (`/src/components/ProtectedRoute.tsx`) - 페이지 접근 제어
- **ShowForTiers, ShowForRoles** - 조건부 UI 렌더링 컴포넌트

### 2. 페이지별 기본 구현
| 페이지 | 경로 | 현재 상태 | 권한 체크 필요 |
|--------|------|----------|---------------|
| 홈 | `/` | ✅ 전체 공개 | 불필요 |
| 로그인 | `/auth` | ✅ 비로그인 | 불필요 |
| 관리자 대시보드 | `/admin` | ⚠️ UI만 | Tier 1, 2만 |
| 학생 대시보드 | `/student` | ⚠️ UI만 | Tier 3-A만 |
| 학부모 대시보드 | `/parent` | ⚠️ UI만 | Tier 3-B만 |
| LMS | `/lms` | ⚠️ UI만 | Tier 1, 2, 3-A |
| 커뮤니티 | `/community` | ⚠️ UI만 | Tier 1-4 (읽기) |
| 협업 | `/collab` | ⚠️ UI만 | Tier 1, 2, 3-A |
| 키오스크 | `/kiosk` | ✅ 전체 공개 | 불필요 |

---

## ⚠️ 현재 미구현 - 프론트엔드에서 해야 할 것

### A. 관리자 전용 기능 숨기기 (Tier 1만)

#### `/admin` 페이지
```tsx
// Tier 1만 보이는 버튼들
<ShowForTiers tiers={[1]}>
  <Button onClick={() => window.location.href = '/admin/cms'}>
    콘텐츠 관리
  </Button>
  <Button onClick={() => window.location.href = '/admin/analytics'}>
    데이터 분석
  </Button>
  <Button onClick={...}>학생 추가</Button>
  <Button onClick={...}>클래스 삭제</Button>
</ShowForTiers>

// Tier 2(강사)는 조회만 가능
<ShowForTiers tiers={[2]}>
  <p className="text-sm text-muted-foreground">
    조회 전용 모드입니다. 수정 권한은 원장님만 가능합니다.
  </p>
</ShowForTiers>
```

#### 사이드바 메뉴 필터링
```tsx
// /src/data/admin.ts
export const getAdminSidebar = (tier: number) => {
  const allMenus = [
    { label: "대시보드", icon: "dashboard", href: "/admin", tier: [1, 2] },
    { label: "클래스", icon: "school", href: "/admin/classes", tier: [1, 2] },
    { label: "학생", icon: "groups", href: "/admin/students", tier: [1, 2] },
    { label: "데이터 분석", icon: "analytics", href: "/admin/analytics", tier: [1] },
    { label: "콘텐츠 관리", icon: "edit_note", href: "/admin/cms", tier: [1] },
    { label: "설정", icon: "settings", href: "/admin/settings", tier: [1] },
  ];
  
  return allMenus.filter(menu => menu.tier.includes(tier));
};
```

---

### B. 학부모 읽기 전용 처리 (Tier 3-B)

#### `/parent` 페이지
- ✅ 이미 읽기 전용으로 구현됨
- ✅ 수정 버튼 없음
- ✅ 조회만 가능

#### `/community` 페이지
```tsx
// 학부모는 글쓰기 버튼 숨김
<ShowForTiers tiers={[1, 2, 3]}> {/* 3-A만, 3-B 제외 */}
  <Button>새 글 작성</Button>
</ShowForTiers>
```

---

### C. 페이지 접근 제어

#### 예시: `/admin` 페이지
```tsx
"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedTiers={[1, 2]}>
      <DashboardLayout ...>
        {/* 관리자 컨텐츠 */}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

---

## 🔒 백엔드 영역 (프론트엔드에서 건들지 않음)

### 백엔드에서만 처리해야 하는 것
1. **JWT 토큰 검증** - API 요청 시 실제 권한 확인
2. **데이터베이스 권한** - 실제 데이터 접근 제어
3. **API 엔드포인트 보호** - Express/Next.js API 미들웨어
4. **세션 관리** - 토큰 갱신, 로그아웃 처리

### 프론트엔드 권한 체크의 목적
- **UX 개선**: 접근 불가능한 메뉴를 숨겨 혼란 방지
- **1차 방어**: 백엔드가 최종 검증
- **명확한 안내**: "권한 없음" 메시지 표시

**중요**: 프론트엔드 권한 체크는 보안이 아닌 UX를 위한 것입니다!

---

## 📊 티어별 기능 매트릭스

### Tier 1 (최고 관리자 - 원장)
- ✅ 모든 페이지 접근
- ✅ CMS 콘텐츠 수정
- ✅ 학생 추가/삭제
- ✅ 클래스 생성/삭제
- ✅ 시스템 설정
- ✅ 전체 데이터 분석

### Tier 2 (관리자 - 강사)
- ✅ 관리자 대시보드 조회
- ✅ 담당 클래스 관리
- ✅ 담당 학생 출석 처리
- ❌ CMS 수정 불가
- ❌ 학생 추가/삭제 불가
- ❌ 시스템 설정 불가

### Tier 3-A (정회원 - 수강생)
- ✅ 학생 대시보드
- ✅ LMS 강의실
- ✅ 커뮤니티 읽기/쓰기
- ✅ 프로젝트 협업
- ❌ 관리자 기능 불가

### Tier 3-B (학부모)
- ✅ 학부모 대시보드
- ✅ 자녀 정보 조회
- ✅ 커뮤니티 읽기
- ❌ 커뮤니티 쓰기 불가
- ❌ LMS 접근 불가
- ❌ 프로젝트 접근 불가

### Tier 5 (게스트)
- ✅ 홈페이지
- ✅ 학원 소개
- ❌ 로그인 필요 페이지 전체 차단

---

## 🎯 다음 단계 (선택사항)

### 1. 실제 페이지에 ProtectedRoute 적용
각 페이지에 권한 체크를 추가하려면:
- `/admin/page.tsx`, `/student/page.tsx` 등에 `<ProtectedRoute>` 래핑

### 2. 조건부 UI 렌더링
티어별로 다른 버튼/메뉴를 보여주려면:
- `<ShowForTiers>`, `<ShowForRoles>` 컴포넌트 사용

### 3. 사이드바 동적 필터링
사용자 티어에 따라 메뉴 항목 필터링

**현재는 Mock 데이터로 테스트 가능하며, 백엔드 연결 시 실제 사용자 정보로 교체하면 됩니다.**
