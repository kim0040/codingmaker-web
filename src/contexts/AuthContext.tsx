"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * 사용자 권한 체계 (Tier System)
 * Tier 1: 최고 관리자 (원장)
 * Tier 2: 관리자 (강사)
 * Tier 3-A: 정회원 (수강생)
 * Tier 3-B: 학부모
 * Tier 3-C: 명예회원
 * Tier 4: 비정규회원
 * Tier 5: 게스트
 */

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'ALUMNI' | 'GUEST';

export interface User {
  id: string;
  username: string;
  name: string; // 암호화된 이름 (백엔드에서 복호화 후 전달)
  phone?: string; // 암호화된 전화번호
  tier: number; // 1-5
  role: UserRole;
  parentId?: string; // 학부모-자녀 연결
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (requiredTier: number) => boolean;
  isRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 localStorage에서 토큰 복원
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      // TODO: 백엔드 연결 시 토큰 유효성 검사
      // fetchUserProfile(storedToken);
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // TODO: 백엔드 API 연결
      // const response = await api.post(endpoints.auth.login, { username, password });
      // const { token, user } = response;
      
      // 임시 Mock 로그인
      const mockToken = 'mock-jwt-token';
      const mockUser: User = {
        id: '1',
        username,
        name: username === 'admin' ? '김원장' : '김코딩',
        tier: username === 'admin' ? 1 : 3,
        role: username === 'admin' ? 'ADMIN' : 'STUDENT',
      };

      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('auth_token', mockToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const hasPermission = (requiredTier: number): boolean => {
    if (!user) return false;
    return user.tier <= requiredTier; // 낮은 숫자가 더 높은 권한
  };

  const isRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        hasPermission,
        isRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
