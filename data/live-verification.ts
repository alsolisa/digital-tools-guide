import syncStatus from "./sync-status.json";
import type { VerificationStatus } from "./catalog";

const normalizedLinkState = new Map(syncStatus.links.map((item) => [item.url.replace(/\/$/, ""), item.state]));

export const liveLinkCheckedAt = syncStatus.checkedAt;
export const liveLinkCheckLabel = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}).format(new Date(syncStatus.checkedAt));

export function getLiveLinkStatus(entries: Array<string | { url: string }>): VerificationStatus {
  const states = entries.map((entry) => {
    const url = typeof entry === "string" ? entry : entry.url;
    return normalizedLinkState.get(url.replace(/\/$/, ""));
  });
  if (!states.length || states.some((state) => !state)) return "pending";
  if (states.some((state) => state === "error")) return "error";
  if (states.some((state) => state === "protected")) return "pending";
  return "automatic";
}
