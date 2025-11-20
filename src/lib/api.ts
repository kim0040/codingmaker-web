/**
 * API 클라이언트 유틸리티
 * 백엔드 API와의 통신을 위한 중앙화된 fetch 래퍼
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (fetchOptions.headers) {
    Object.assign(headers, fetchOptions.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        response.status,
        response.statusText,
        errorData.message || '요청 처리 중 오류가 발생했습니다.'
      );
    }

    // 204 No Content의 경우 빈 객체 반환
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error('서버와의 통신 중 오류가 발생했습니다.');
  }
}

// CRUD 메서드
export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, data?: unknown, token?: string) =>
    request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      token,
    }),

  put: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  patch: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),
};

// API 엔드포인트 정의 (백엔드 구현 시 실제 경로로 매핑)
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },

  // Users
  users: {
    list: '/users',
    byId: (id: string) => `/users/${id}`,
  },
  attendance: {
    checkin: "/attendance/checkin",
    user: (userId: string) => `/attendance/user/${userId}`,
  },
  courses: {
    list: "/courses",
    create: "/courses",
    update: (id: string) => `/courses/${id}`,
    delete: (id: string) => `/courses/${id}`,
  },
  academy: {
    info: "/academy/info",
    update: "/academy/info",
  },
  community: {
    posts: "/community/posts",
    post: (id: string) => `/community/posts/${id}`,
    deletePost: (id: string) => `/community/posts/${id}`,
    like: (id: string) => `/community/posts/${id}/like`,
    comments: (postId: string) => `/community/posts/${postId}/comments`,
    deleteComment: (postId: string, commentId: string) =>
      `/community/posts/${postId}/comments/${commentId}`,
  },
  chat: {
    rooms: "/chat/rooms",
    messages: (roomId: string) => `/chat/rooms/${roomId}/messages`,
    deleteMessage: (messageId: string) => `/chat/messages/${messageId}`,
  },
  analytics: {
    dashboard: "/analytics/dashboard",
    attendance: "/analytics/attendance",
    community: "/analytics/community",
    users: "/analytics/users",
  },
  admin: {
    users: "/users",
    userProfile: (userId: string) => `/users/${userId}/profile`,
  },
};
