export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DashboardOverview {
  todayAttendance: number;
  totalStudents: number;
  todayPosts: number;
  activeCourses: number;
  attendanceRate: string;
}

export interface WeeklyAttendancePoint {
  date: string;
  count: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  weeklyAttendance: WeeklyAttendancePoint[];
}

export interface AttendanceDailyStat {
  date: string;
  total: number;
  attended: number;
  late: number;
  absent: number;
}

export interface AttendanceStudentStat {
  id: string;
  name: string;
  totalDays: number;
  attendedDays: number;
  rate: string;
}

export interface AttendanceAnalytics {
  dailyStats: AttendanceDailyStat[];
  totalStats: { status: string; _count: { status: number } }[];
  studentStats: AttendanceStudentStat[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  instructor?: string | null;
  schedule?: string | null;
  isActive: boolean;
  enrolledCount: number;
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

export interface AttendanceRecord {
  id: string;
  userId: string;
  status: string;
  date: string;
  note?: string | null;
}

export interface AttendanceSummary {
  userId: string;
  month: string;
  records: AttendanceRecord[];
  stats: {
    attended: number;
    late: number;
    absent: number;
    rate: string;
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
