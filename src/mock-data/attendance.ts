import type { AttendanceRecord } from "@/types";
import { volunteers } from "./volunteers";

export const attendance: AttendanceRecord[] = [
  { id: "a1", volunteerId: "v1", volunteerName: volunteers[0].name, avatar: volunteers[0].avatar, eventId: "e1", eventTitle: "Community Food Drive", date: "2026-06-08", status: "present", hours: 6 },
  { id: "a2", volunteerId: "v2", volunteerName: volunteers[1].name, avatar: volunteers[1].avatar, eventId: "e1", eventTitle: "Community Food Drive", date: "2026-06-08", status: "present", hours: 6 },
  { id: "a3", volunteerId: "v3", volunteerName: volunteers[2].name, avatar: volunteers[2].avatar, eventId: "e4", eventTitle: "Senior Care Visits", date: "2026-06-07", status: "late", hours: 3 },
  { id: "a4", volunteerId: "v5", volunteerName: volunteers[4].name, avatar: volunteers[4].avatar, eventId: "e2", eventTitle: "Beach Cleanup Initiative", date: "2026-06-06", status: "present", hours: 5 },
  { id: "a5", volunteerId: "v6", volunteerName: volunteers[5].name, avatar: volunteers[5].avatar, eventId: "e4", eventTitle: "Senior Care Visits", date: "2026-06-05", status: "absent", hours: 0 },
  { id: "a6", volunteerId: "v7", volunteerName: volunteers[6].name, avatar: volunteers[6].avatar, eventId: "e5", eventTitle: "Annual Charity Gala", date: "2026-06-04", status: "present", hours: 8 },
  { id: "a7", volunteerId: "v8", volunteerName: volunteers[7].name, avatar: volunteers[7].avatar, eventId: "e3", eventTitle: "Youth Coding Workshop", date: "2026-06-03", status: "present", hours: 4 },
];