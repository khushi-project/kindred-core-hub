export type Role = "admin" | "volunteer" | "coordinator";

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skills: string[];
  status: "active" | "inactive" | "pending";
  hours: number;
  joinedAt: string;
  phone?: string;
  location?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  banner: string;
  status: "upcoming" | "ongoing" | "completed";
  volunteersAssigned: number;
  capacity: number;
}

export interface AttendanceRecord {
  id: string;
  volunteerId: string;
  volunteerName: string;
  avatar: string;
  eventId: string;
  eventTitle: string;
  date: string;
  status: "present" | "absent" | "late";
  hours: number;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  avatar: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "success" | "warning" | "alert";
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}