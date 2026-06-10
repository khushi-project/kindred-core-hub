export type Role = "admin" | "coordinator" | "volunteer";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type AttendanceStatus = "present" | "absent" | "late";
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "done";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  created_at: string;
}

export interface EventRow {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  category: string;
  banner_url: string | null;
  status: EventStatus;
  capacity: number;
  created_by: string | null;
  created_at: string;
}

export interface AttendanceRow {
  id: string;
  event_id: string;
  volunteer_id: string;
  status: AttendanceStatus;
  hours: number;
  marked_by: string | null;
  marked_at: string;
}

export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  event_id: string | null;
  assignee_id: string | null;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  created_by: string | null;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface CertificateRow {
  id: string;
  event_id: string;
  volunteer_id: string;
  certificate_code: string;
  hours: number;
  issued_at: string;
}