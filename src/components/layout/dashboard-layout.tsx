"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import type { SidebarItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

type DashboardLayoutProps = {
  userName: string;
  userSubtitle: string;
  sidebarItems: SidebarItem[];
  bottomNavItems?: SidebarItem[];
  headerTitle: string;
  headerSubtitle?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  requiredTier?: number; // 최소 필요 Tier (낮을수록 높은 권한)
};

export function DashboardLayout({
  userName,
  userSubtitle,
  sidebarItems,
  bottomNavItems,
  headerTitle,
  headerSubtitle,
  headerActions,
  children,
  requiredTier = 3, // 기본값: 학생도 접근 가능
}: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const isUnauthorized = isLoading || !user || user.tier > requiredTier;

  // 로그인 및 권한 체크
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // 로그인 안 되어 있으면 로그인 페이지로
        alert("로그인이 필요합니다.");
        router.push("/auth");
        return;
      }
      
      if (user.tier > requiredTier) {
        // 권한 부족
        alert("접근 권한이 없습니다.");
        router.push("/");
        return;
      }
    }
  }, [user, isLoading, requiredTier, router]);

  // 모바일에서만 페이지 이동 시 사이드바 닫기
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // 로그인 확인 중이거나 권한 체크 중
  if (isUnauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  const resolvedBottomNav = bottomNavItems ?? sidebarItems.slice(0, 5);

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="size-12 rounded-full bg-primary/10" />
          <div>
            <p className="text-base font-bold text-foreground">{userName}</p>
            <p className="text-sm text-muted-foreground">{userSubtitle}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = item.active || (item.href ? pathname === item.href : false);
            const className = `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`;
            const content = (
              <>
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                {item.label}
              </>
            );

            return item.href ? (
              <Link key={item.label} href={item.href} className={className} onClick={() => setIsMobileSidebarOpen(false)}>
                {content}
              </Link>
            ) : (
              <button key={item.label} className={className} type="button">
                {content}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-2 pt-6">
        <Button className="w-full" onClick={() => alert('공지 등록 기능은 백엔드 연결 후 사용 가능합니다.')}>새 공지 등록</Button>
        <div className="flex flex-col gap-1">
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted" onClick={() => alert('도움말 페이지는 추후 추가될 예정입니다.')}>
            <span className="material-symbols-outlined text-base">help_outline</span>
            도움말
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted" onClick={() => { 
            if (confirm('로그아웃 하시겠습니까?')) {
              logout();
              router.push('/');
            }
          }}>
            <span className="material-symbols-outlined text-base">logout</span>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* 데스크톱 사이드바 - 항상 표시 */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-4">
        {SidebarContent}
      </aside>

      {/* 모바일 오버레이 사이드바 */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 bg-card p-4">{SidebarContent}</div>
          <div className="flex-1 bg-black/40" onClick={() => setIsMobileSidebarOpen(false)}></div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden rounded-lg border border-border p-2 text-muted-foreground"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              >
                <span className="material-symbols-outlined">{isMobileSidebarOpen ? 'menu_open' : 'menu'}</span>
              </button>
              <div>
                <p className="text-2xl font-black text-foreground sm:text-3xl">{headerTitle}</p>
                {headerSubtitle && (
                  <p className="text-sm text-muted-foreground">{headerSubtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {headerActions ?? (
                <>
                  <ThemeToggle />
                  <Button variant="outline" size="icon" onClick={() => setIsSearchOpen((prev) => !prev)}>
                    <span className="material-symbols-outlined">search</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="relative"
                    onClick={() => window.location.href = '/student/notifications'}
                  >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute right-1 top-1 inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full bg-red-500"></span>
                    </span>
                  </Button>
                  <details className="relative">
                    <summary className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-foreground">
                      <span className="size-8 rounded-full bg-primary/10"></span>
                      <span className="hidden text-sm font-semibold lg:block">{userName}</span>
                    </summary>
                    <div className="absolute right-0 mt-2 w-40 rounded-lg border border-border bg-card p-2 text-sm shadow-lg">
                      <button 
                        onClick={() => alert('프로필 페이지는 백엔드 연결 후 사용 가능합니다.')}
                        className="block w-full rounded-md px-3 py-1 text-left hover:bg-muted"
                      >
                        프로필
                      </button>
                      <button 
                        onClick={() => alert('설정 페이지는 백엔드 연결 후 사용 가능합니다.')}
                        className="block w-full rounded-md px-3 py-1 text-left hover:bg-muted"
                      >
                        설정
                      </button>
                      <button 
                        onClick={() => { 
                          if (confirm('로그아웃 하시겠습니까?')) {
                            logout();
                            router.push('/');
                          }
                        }}
                        className="block w-full rounded-md px-3 py-1 text-left hover:bg-muted"
                      >
                        로그아웃
                      </button>
                    </div>
                  </details>
                </>
              )}
            </div>
          </header>
          {isSearchOpen && (
            <div className="relative">
              <input
                autoFocus
                className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground shadow focus:border-primary focus:outline-none"
                placeholder="검색어를 입력하세요"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setIsSearchOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}
          {children}
        </div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card py-2 text-xs text-muted-foreground lg:hidden">
        {resolvedBottomNav.map((item) => {
          const isActive = item.active || (item.href ? pathname === item.href : false);
          const className = `flex flex-1 flex-col items-center gap-1 ${
            isActive ? "text-primary" : "text-muted-foreground"
          }`;
          const content = (
            <>
              <span className="material-symbols-outlined text-lg" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </>
          );
          return item.href ? (
            <Link 
              key={`bottom-${item.label}`} 
              href={item.href} 
              className={className}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              {content}
            </Link>
          ) : (
            <button key={`bottom-${item.label}`} className={className} type="button">
              {content}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
