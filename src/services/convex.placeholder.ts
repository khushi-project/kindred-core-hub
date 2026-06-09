/**
 * Convex client placeholder.
 * 1) bun add convex
 * 2) npx convex dev (scaffolds /convex)
 * 3) Wrap app with <ConvexProvider client={convex}> in RootComponent
 * 4) Replace service modules with useQuery/useMutation
 */
export const convexConfig = {
  url: import.meta.env.VITE_CONVEX_URL ?? "",
};