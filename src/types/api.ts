export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AcademyInfo {
  address?: string;
  phone?: string;
  hours?: string;
  blog?: string;
  instagram?: string;
  [key: string]: string | undefined;
}

export interface UserSummary {
  id: string;
  username: string;
  name: string;
  phone: string | null;
  tag: string | null;
  tier: number;
  role: string;
  createdAt: string;
}

export interface AuthPayload {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    tier: number;
    role: string;
    parentId?: string;
  };
}

export interface CommunityPostSummary {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  views: number;
  likes: number;
  commentCount: number;
  createdAt: string;
  author?: {
    id: string;
    name: string;
  };
}

export interface CommunityPostList {
  posts: CommunityPostSummary[];
  total: number;
  page: number;
  totalPages: number;
}
