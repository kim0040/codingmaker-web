export interface AcademyProfile {
  name: string;
  brand: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  homepage: string;
  blog: string;
  instagram: string;
  summary: string;
  studentCapacity: string;
  duration: string;
}

export interface HeroStat {
  label: string;
  value: string;
  helper: string;
}

export interface SummaryHighlight {
  title: string;
  description: string;
}

export interface CourseTrack {
  category: string;
  title: string;
  subjects: string[];
  target: string;
  features: string[];
  price: string;
}

export interface PriceItem {
  name: string;
  price: string;
  unit: string;
  description: string;
}

export interface ReviewMetric {
  label: string;
  score: string;
  description: string;
}

export interface ConsultationChannel {
  label: string;
  detail: string;
  link: string;
}

export interface FacilityHighlights {
  capacity: string;
  duration: string;
  strengths: string[];
  cautions: string[];
}

export interface SidebarItem {
  label: string;
  icon: string;
  active?: boolean;
  href?: string;
}

export interface AdminStat {
  label: string;
  value: string;
  trend: string;
  trendColor: "positive" | "negative";
}

export interface StudentClass {
  title: string;
  teacher: string;
  date: string;
  image: string;
}

export interface StudentAttendance {
  status: string;
  time: string;
  description: string;
}

export interface ProjectProgress {
  name: string;
  due: string;
  progress: number;
  accent?: "primary" | "accent";
}

export interface NotificationItem {
  title: string;
  time: string;
  icon: string;
  unread?: boolean;
}

export interface AttendanceBreakdown {
  label: string;
  value: string;
}

export interface AttendanceSummary {
  monthlyRate: number;
  change: string;
  breakdown: AttendanceBreakdown[];
}

export interface ChildProfile {
  name: string;
  summary: string;
}

export interface ParentClass {
  title: string;
  teacher: string;
  nextSession: string;
  highlight?: boolean;
}

export interface CurriculumStep {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
}

export interface KioskKeyboard {
  rows: string[][];
}

export interface KioskMeta {
  title: string;
  instruction: string;
  buttonLabel: string;
  timeDisplay: string;
}

export interface CalendarDay {
  day: string;
  muted?: boolean;
  badge?: "present" | "absent" | "late";
  current?: boolean;
}

export interface AttendanceCalendar {
  month: string;
  days: CalendarDay[];
}

export interface ClassDistributionBar {
  label: string;
  value: number;
  highlight?: boolean;
}

export interface ScheduleItem {
  icon: string;
  time: string;
  title: string;
  teacher: string;
}

export interface CommunityFeedItem {
  title: string;
  meta: string;
}

export interface WorkspaceNavItem {
  label: string;
  active?: boolean;
}

export interface WorkspaceSidebarItem {
  label: string;
  icon: string;
  active?: boolean;
}

export interface WorkspaceMeta {
  title: string;
  projectName: string;
  projectSubtitle: string;
  currentView: string;
  description: string;
}

export interface WorkspaceMessage {
  id: number;
  author: string;
  time: string;
  avatar: string;
  align: "left" | "right";
  content: string;
}

export interface CommunityPost {
  id: number;
  title: string;
  replies: number;
  author: string;
  date: string;
  views: number;
  likes: number;
}

export interface FileItem {
  name: string;
  size: string;
  updatedAt: string;
  owner: string;
  type: "doc" | "sheet" | "image" | "zip" | "other";
}

export interface ChatChannel {
  name: string;
  unread?: number;
  active?: boolean;
}
