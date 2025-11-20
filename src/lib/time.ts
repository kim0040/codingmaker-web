/**
 * 시간 관련 유틸리티 함수
 * 서버 시간 기준으로 작동
 */

/**
 * 상대 시간 표시 (예: "방금 전", "3분 전", "2시간 전")
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 10) return "방금 전";
  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 30) return `${diffDay}일 전`;
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return `${diffYear}년 전`;
}

/**
 * 한국 날짜 형식으로 포맷 (예: "2025년 11월 20일")
 */
export function formatKoreanDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 한국 날짜 + 시간 형식 (예: "2025년 11월 20일 14:30")
 */
export function formatKoreanDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 요일 포함 날짜 (예: "2025년 11월 20일 목요일")
 */
export function formatKoreanDateWithDay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

/**
 * 간단한 날짜 형식 (예: "11/20")
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * 시간만 표시 (예: "14:30")
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 서버 시간 기준 현재 시간 (ISO 형식)
 */
export function getCurrentServerTime(): string {
  return new Date().toISOString();
}

/**
 * 오늘인지 확인
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * 어제인지 확인
 */
export function isYesterday(dateString: string): boolean {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * 스마트 날짜 표시 (오늘이면 시간만, 어제면 "어제", 그 외는 날짜)
 */
export function formatSmartDate(dateString: string): string {
  if (isToday(dateString)) {
    return formatTime(dateString);
  }
  if (isYesterday(dateString)) {
    return "어제";
  }
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }
  
  return formatShortDate(dateString);
}
