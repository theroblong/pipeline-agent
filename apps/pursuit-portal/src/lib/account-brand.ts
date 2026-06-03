import { getString } from "@/lib/content";
import type { KnowledgeItem } from "@/lib/types";

const defaultBrandColor = "#236c57";

function getBrandColor(account: KnowledgeItem | null | undefined) {
  const color = getString(account?.data ?? {}, "brand_color", defaultBrandColor);

  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : defaultBrandColor;
}

function getFallbackLogoText(companyName: string) {
  const words = companyName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 6);
  }

  return words
    .map((word) => word[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

function getBrandLogoText(
  account: KnowledgeItem | null | undefined,
  companyName: string
) {
  const configured = getString(account?.data ?? {}, "brand_logo_text", "");

  return configured && configured !== "unknown"
    ? configured
    : getFallbackLogoText(companyName);
}

function getBrandLogoPath(account: KnowledgeItem | null | undefined) {
  const configured = getString(account?.data ?? {}, "brand_logo_path", "");

  return configured && configured !== "unknown" && configured.startsWith("/")
    ? configured
    : "";
}

export function getAccountBrand(
  account: KnowledgeItem | null | undefined,
  companyName: string
) {
  return {
    color: getBrandColor(account),
    logoPath: getBrandLogoPath(account),
    logoText: getBrandLogoText(account, companyName)
  };
}
