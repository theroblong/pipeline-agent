import { getString, getStrings, getTitle } from "./content";
import { getRelatedProducts } from "./pipeline";
import type { KnowledgeItem } from "./types";

export type ProductRecommendation = {
  product: KnowledgeItem;
  label: string;
  reason: string;
};

export const offerFilters = [
  { id: "all", label: "All options" },
  { id: "data-ai", label: "Data & AI" },
  { id: "automation", label: "Automation" },
  { id: "planning", label: "Planning" },
  { id: "build", label: "Build" }
] as const;

export type OfferFilter = (typeof offerFilters)[number]["id"];

export function productName(product: KnowledgeItem) {
  return getString(product.data, "product_name", getTitle(product));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchesProductName(product: KnowledgeItem, offerName: string) {
  const productTitle = normalize(productName(product));
  const offerTitle = normalize(offerName);

  if (!offerTitle || offerTitle === "unknown") {
    return false;
  }

  return (
    productTitle === offerTitle ||
    productTitle.includes(offerTitle) ||
    offerTitle.includes(productTitle)
  );
}

function sentenceFragment(value: string) {
  const text = value.replace(/\.$/, "").trim();

  if (!text) {
    return "a focused business outcome";
  }

  return `${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

function friendlyStage(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function normalizeFilter(value?: string): OfferFilter {
  return offerFilters.some((filter) => filter.id === value)
    ? (value as OfferFilter)
    : "all";
}

function productSearchText(product: KnowledgeItem) {
  return normalize(
    [
      productName(product),
      getString(product.data, "primary_positioning", ""),
      ...getStrings(product.data, "common_pain_signals"),
      ...getStrings(product.data, "target_buyers")
    ].join(" ")
  );
}

export function productMatchesFilter(product: KnowledgeItem, filter: OfferFilter) {
  if (filter === "all") {
    return true;
  }

  const text = productSearchText(product);

  if (filter === "data-ai") {
    return /\b(aevah|data|ai|intelligence|semantic|mdm|entity|governance|defense)\b/.test(
      text
    );
  }

  if (filter === "automation") {
    return /\b(automation|workflow|process|handoff|migration|monitoring|service)\b/.test(
      text
    );
  }

  if (filter === "planning") {
    return /\b(blueprint|strategy|transformation|roadmap|requirements|planning|alignment)\b/.test(
      text
    );
  }

  return /\b(product development|development|systems|portal|application|software|implementation)\b/.test(
    text
  );
}

export function builderHref(opportunitySlug: string, filter: OfferFilter) {
  const params = new URLSearchParams();

  if (opportunitySlug) {
    params.set("opportunity", opportunitySlug);
  }

  if (filter !== "all") {
    params.set("filter", filter);
  }

  const query = params.toString();
  return query ? `/briefs?${query}` : "/briefs";
}

function defaultRecommendationReason(product: KnowledgeItem) {
  const name = normalize(productName(product));

  if (name.includes("aevah")) {
    return "Use this when the conversation centers on trusted data, operational visibility, AI-ready information, or enterprise intelligence.";
  }

  if (name.includes("automation")) {
    return "Use this when the conversation centers on workflow handoffs, manual work, service operations, or process speed.";
  }

  if (name.includes("blueprint")) {
    return "Use this when the prospect needs requirements clarity, roadmap structure, delivery planning, or implementation readiness.";
  }

  return `Use this when ${sentenceFragment(
    getString(product.data, "primary_positioning", productName(product))
  )} fits the meeting agenda.`;
}

function recommendationReason(
  product: KnowledgeItem,
  opportunity: KnowledgeItem,
  label: string
) {
  const companyName = getString(opportunity.data, "company_name");
  const stage = getString(opportunity.data, "buying_cycle_stage", "");
  const positioning = sentenceFragment(
    getString(product.data, "primary_positioning", productName(product))
  );

  if (label === "Lead capability") {
    return `${productName(product)} is the lead capability recorded for ${companyName}. Include it as the anchor page for a meeting around ${positioning}.`;
  }

  if (label === "Supporting capability") {
    return `Already linked to this opportunity as a supporting capability. Include it when the stakeholder conversation expands toward ${positioning}.`;
  }

  if (stage && getStrings(product.data, "best_fit_stages").includes(stage)) {
    return `Best-fit metadata includes ${friendlyStage(stage)}, matching this account's buying stage. It can help frame the next working session in buyer language.`;
  }

  return defaultRecommendationReason(product);
}

function getDefaultRecommendations(products: KnowledgeItem[]) {
  const defaultSlugs = ["aevah", "automation-consulting-services", "blueprint-studio"];

  return defaultSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is KnowledgeItem => Boolean(product))
    .map((product) => ({
      product,
      label: "Starting point",
      reason: defaultRecommendationReason(product)
    }));
}

export function getRecommendations(
  products: KnowledgeItem[],
  opportunity: KnowledgeItem | null
): ProductRecommendation[] {
  if (!opportunity) {
    return getDefaultRecommendations(products);
  }

  const activeOpportunity = opportunity;
  const relatedProducts = getRelatedProducts(activeOpportunity);
  const primaryOffer = getString(activeOpportunity.data, "primary_offer", "");
  const secondaryOffers = getStrings(activeOpportunity.data, "secondary_offers");
  const selected = new Map<string, ProductRecommendation>();

  function add(product: KnowledgeItem | undefined, label: string) {
    if (!product || selected.has(product.slug)) {
      return;
    }

    selected.set(product.slug, {
      product,
      label,
      reason: recommendationReason(product, activeOpportunity, label)
    });
  }

  add(
    relatedProducts.find((product) => matchesProductName(product, primaryOffer)) ??
      products.find((product) => matchesProductName(product, primaryOffer)),
    "Lead capability"
  );

  for (const product of relatedProducts) {
    const label = secondaryOffers.some((offer) => matchesProductName(product, offer))
      ? "Supporting capability"
      : "Opportunity fit";

    add(product, label);
  }

  const stage = getString(activeOpportunity.data, "buying_cycle_stage", "");
  for (const product of products) {
    if (selected.size >= 4) {
      break;
    }

    if (stage && getStrings(product.data, "best_fit_stages").includes(stage)) {
      add(product, "Stage fit");
    }
  }

  return Array.from(selected.values()).slice(0, 4);
}
