export function formatDate(s: string | Date) {
  const d = typeof s === "string" ? new Date(s) : s;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
export function formatDateTime(s: string | Date) {
  const d = typeof s === "string" ? new Date(s) : s;
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
export function timeAgo(s: string) {
  const diff = Date.now() - new Date(s).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}