"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push(redirectTo);
      return;
    }

    if (!allowedTiers.includes(user.tier)) {
      router.push('/');
    }
  }, [user, isLoading, allowedTiers, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-muted-foreground">login</span>
          <h1 className="mt-4 text-2xl font-bold">로그인이 필요합니다</h1>
          <p className="mt-2 text-muted-foreground">페이지에 접근하려면 먼저 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  if (!allowedTiers.includes(user.tier)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">권한 확인 중...</p>
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
  const { user } = useAuth();

  if (!user || !tiers.includes(user.tier)) {
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
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
