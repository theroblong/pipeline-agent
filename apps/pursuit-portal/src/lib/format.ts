import type { KnowledgeItem } from "./types";

export function label(value: unknown, fallback = "Unknown") {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

export function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function itemHref(item: KnowledgeItem) {
  const type = item.data.record_type;

  if (type === "opportunity") {
    return `/opportunities/${item.slug}`;
  }

  if (type === "product") {
    return `/enablement/products/${item.slug}`;
  }

  if (type === "prospect-packet") {
    return `/enablement/packets/${item.slug}`;
  }

  return `/enablement/materials/${item.slug}`;
}

export function badgeTone(value: string) {
  if (["strong", "active-evaluation", "solution-fit", "ready"].includes(value)) {
    return "good";
  }

  if (["discovery", "problem-exploration", "developing"].includes(value)) {
    return "watch";
  }

  if (["not-synced", "do-not-sync", "unknown"].includes(value)) {
    return "quiet";
  }

  return "neutral";
}
