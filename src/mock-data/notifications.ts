import type { NotificationItem } from "@/types";

export const notifications: NotificationItem[] = [
  { id: "n1", title: "New volunteer application", description: "Diego Alvarez applied for the Food Drive program.", time: "2 min ago", type: "info", read: false },
  { id: "n2", title: "Event capacity reached 90%", description: "Beach Cleanup Initiative is almost full.", time: "1 hr ago", type: "warning", read: false },
  { id: "n3", title: "Monthly report ready", description: "Your May 2026 impact report is available.", time: "5 hrs ago", type: "success", read: false },
  { id: "n4", title: "Attendance flagged", description: "3 volunteers marked absent for Senior Care Visits.", time: "Yesterday", type: "alert", read: true },
  { id: "n5", title: "New milestone reached", description: "Your organization passed 10,000 volunteer hours.", time: "2 days ago", type: "success", read: true },
  { id: "n6", title: "System maintenance scheduled", description: "Planned downtime on June 15, 2:00 AM UTC.", time: "3 days ago", type: "info", read: true },
];