"use client";

import { useState, useEffect } from 'react';
import { api, endpoints } from '@/lib/api';

interface AcademyInfoResponse {
  success?: boolean;
  data?: Partial<AcademyInfo> | null;
}

/**
 * 학원 정보 Hook
 * 백엔드 연결 시 AcademyInfo 테이블에서 동적으로 데이터를 가져옴
 */

export interface AcademyInfo {
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  blog?: string;
  instagram?: string;
  hours: string;
  hoursWeekend?: string;
}

// 기본값 (DB 연결 실패 시 fallback)
const DEFAULT_INFO: AcademyInfo = {
  name: '코딩메이커학원',
  address: '전남 광양시 무등길 47 (중동 1549-9)',
  phone: '061-745-3355',
  website: 'www.codingmaker.co.kr',
  blog: 'https://blog.naver.com/kkj0201',
  instagram: 'https://www.instagram.com/codingmaker_kj/',
  hours: '평일 14:00~19:00',
  hoursWeekend: '토요일 14:00~17:00',
};

export function useAcademyInfo() {
  const [info, setInfo] = useState<AcademyInfo>(DEFAULT_INFO);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchAcademyInfo() {
      setIsLoading(true);

      try {
        const response = await api.get<AcademyInfoResponse>(endpoints.academy.info);

        if (!isActive) return;

        if (response && typeof response === 'object' && 'data' in response && response.data) {
          setInfo({ ...DEFAULT_INFO, ...response.data });
        } else {
          setInfo(DEFAULT_INFO);
        }
      } catch (err) {
        console.error('Failed to fetch academy info:', err);
        setError('학원 정보를 불러오는데 실패했습니다.');
        setInfo(DEFAULT_INFO);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchAcademyInfo();

    return () => {
      isActive = false;
    };
  }, []);

  return { info, isLoading, error };
}
