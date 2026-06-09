import type { Task } from "@/types";
import { volunteers } from "./volunteers";

export const tasks: Task[] = [
  { id: "t1", title: "Prepare event signage for Food Drive", assignee: volunteers[0].name, avatar: volunteers[0].avatar, dueDate: "2026-06-20", priority: "high", status: "in-progress" },
  { id: "t2", title: "Confirm catering supplier", assignee: volunteers[1].name, avatar: volunteers[1].avatar, dueDate: "2026-06-18", priority: "medium", status: "todo" },
  { id: "t3", title: "Send volunteer briefing emails", assignee: volunteers[2].name, avatar: volunteers[2].avatar, dueDate: "2026-06-15", priority: "high", status: "done" },
  { id: "t4", title: "Update donor database", assignee: volunteers[6].name, avatar: volunteers[6].avatar, dueDate: "2026-06-25", priority: "low", status: "todo" },
  { id: "t5", title: "Coordinate transportation routes", assignee: volunteers[4].name, avatar: volunteers[4].avatar, dueDate: "2026-06-22", priority: "medium", status: "in-progress" },
  { id: "t6", title: "Publish monthly newsletter", assignee: volunteers[7].name, avatar: volunteers[7].avatar, dueDate: "2026-06-30", priority: "low", status: "todo" },
];