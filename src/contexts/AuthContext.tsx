"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api, endpoints } from '@/lib/api';
import type { ApiResponse, AuthPayload } from '@/types/api';

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
  const fetchUserProfile = useCallback(async (authToken: string) => {
    try {
      const response = await api.get<ApiResponse<User>>(endpoints.auth.me, authToken);
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // 토큰 유효성 검사 및 사용자 정보 가져오기
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<AuthPayload>>(endpoints.auth.login, { username, password });

      if (response.success && response.data) {
        const { token: authToken, user: userData } = response.data;
        
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('auth_token', authToken);
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
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
