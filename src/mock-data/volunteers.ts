import type { Volunteer } from "@/types";

const avatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

export const volunteers: Volunteer[] = [
  { id: "v1", name: "Aisha Khan", email: "aisha.khan@volunc.org", avatar: avatar("Aisha"), skills: ["Teaching", "First Aid"], status: "active", hours: 142, joinedAt: "2024-02-12", phone: "+1 555-0142", location: "New York, NY" },
  { id: "v2", name: "Marcus Bennett", email: "marcus.b@volunc.org", avatar: avatar("Marcus"), skills: ["Logistics", "Driving"], status: "active", hours: 98, joinedAt: "2024-04-03", phone: "+1 555-0198", location: "Boston, MA" },
  { id: "v3", name: "Priya Sharma", email: "priya.s@volunc.org", avatar: avatar("Priya"), skills: ["Translation", "Healthcare"], status: "active", hours: 215, joinedAt: "2023-11-20", phone: "+1 555-0215", location: "San Francisco, CA" },
  { id: "v4", name: "Diego Alvarez", email: "diego.a@volunc.org", avatar: avatar("Diego"), skills: ["Construction", "Coordination"], status: "pending", hours: 0, joinedAt: "2025-05-29", phone: "+1 555-0301", location: "Austin, TX" },
  { id: "v5", name: "Hannah Lee", email: "hannah.l@volunc.org", avatar: avatar("Hannah"), skills: ["Marketing", "Photography"], status: "active", hours: 76, joinedAt: "2024-08-14", phone: "+1 555-0414", location: "Seattle, WA" },
  { id: "v6", name: "Omar Hassan", email: "omar.h@volunc.org", avatar: avatar("Omar"), skills: ["Counseling", "Mentorship"], status: "inactive", hours: 184, joinedAt: "2023-06-01", phone: "+1 555-0500", location: "Chicago, IL" },
  { id: "v7", name: "Sofia Rossi", email: "sofia.r@volunc.org", avatar: avatar("Sofia"), skills: ["Fundraising", "Events"], status: "active", hours: 132, joinedAt: "2024-01-08", phone: "+1 555-0612", location: "Miami, FL" },
  { id: "v8", name: "Jordan Park", email: "jordan.p@volunc.org", avatar: avatar("Jordan"), skills: ["IT Support", "Data Entry"], status: "active", hours: 54, joinedAt: "2024-10-22", phone: "+1 555-0750", location: "Denver, CO" },
];