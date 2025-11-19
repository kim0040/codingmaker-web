"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 페이지 접근 권한 체크 컴포넌트
 * 
 * 사용법:
 * <ProtectedRoute allowedTiers={[1, 2]} redirectTo="/auth">
 *   <YourPageContent />
 * </ProtectedRoute>
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTiers: number[]; // 접근 허용 티어 목록
  redirectTo?: string; // 권한 없을 시 리다이렉트 경로
}

export function ProtectedRoute({ 
  children, 
  allowedTiers,
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const router = useRouter();
  
  // TODO: 백엔드 연결 시 실제 사용자 정보로 교체
  // const { user, isLoading } = useAuth();
  
  // 임시 Mock 데이터 (개발용)
  const mockUser = {
    id: '1',
    tier: 1, // 테스트용: 1=관리자, 2=강사, 3=학생, 등
    role: 'ADMIN' as const,
  };

  useEffect(() => {
    // 로딩 중일 때는 체크하지 않음
    // if (isLoading) return;

    // 로그인 안 되어 있으면 로그인 페이지로
    if (!mockUser) {
      router.push(redirectTo);
      return;
    }

    // 권한이 없으면 홈으로 리다이렉트
    if (!allowedTiers.includes(mockUser.tier)) {
      router.push('/');
      return;
    }
  }, [mockUser, allowedTiers, redirectTo, router]);

  // 권한 확인 전에는 로딩 표시
  if (!mockUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  // 권한 없으면 접근 거부 메시지
  if (!allowedTiers.includes(mockUser.tier)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-muted-foreground">block</span>
          <h1 className="mt-4 text-2xl font-bold">접근 권한이 없습니다</h1>
          <p className="mt-2 text-muted-foreground">이 페이지에 접근할 수 있는 권한이 없습니다.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * 조건부 렌더링 헬퍼 컴포넌트
 * 
 * 사용법:
 * <ShowForTiers tiers={[1, 2]}>
 *   <AdminOnlyButton />
 * </ShowForTiers>
 */
export function ShowForTiers({ 
  children, 
  tiers 
}: { 
  children: React.ReactNode; 
  tiers: number[];
}) {
  // TODO: 백엔드 연결 시 실제 사용자 정보로 교체
  const mockUserTier = 1; // 테스트용

  if (!tiers.includes(mockUserTier)) {
    return null;
  }

  return <>{children}</>;
}

/**
 * 역할 기반 조건부 렌더링
 * 
 * 사용법:
 * <ShowForRoles roles={['ADMIN', 'TEACHER']}>
 *   <StaffOnlyFeature />
 * </ShowForRoles>
 */
export function ShowForRoles({ 
  children, 
  roles 
}: { 
  children: React.ReactNode; 
  roles: ('ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'ALUMNI' | 'GUEST')[];
}) {
  // TODO: 백엔드 연결 시 실제 사용자 정보로 교체
  const mockUserRole = 'ADMIN'; // 테스트용

  if (!roles.includes(mockUserRole)) {
    return null;
  }

  return <>{children}</>;
}
