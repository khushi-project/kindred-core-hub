import type { Role } from "@/types";

/**
 * Placeholder for future protected-route logic.
 * Wire to Convex auth — redirect to /login if no session,
 * or to /unauthorized if role doesn't match.
 */
export function useProtectedRoute(_allowedRoles?: Role[]) {
  // TODO: integrate with Convex auth + router redirect
  return { authorized: true };
}