import { getString, getStrings, getTitle } from "./content";
import { contactDescriptor, getContactInsight } from "./contact-insights";
import { getRelatedProducts } from "./pipeline";
import type { KnowledgeItem } from "./types";

export type ProductRecommendation = {
  product: KnowledgeItem;
  label: string;
  reason: string;
};

export const offerGroups = [
  {
    id: "ai-data",
    label: "AI, data, and enterprise intelligence",
    description:
      "Trusted data, AI-ready context, operating intelligence, and executive AI direction.",
    slugs: [
      "aevah",
      "ai-transformation-services",
      "aevah-ai-ready-data-agentic-semantic-layer"
    ]
  },
  {
    id: "entity-trust",
    label: "Customer data and entity trust",
    description:
      "Golden records, entity resolution, data quality, lineage, and operating confidence.",
    slugs: ["aevah-mdm-golden-record-entity-resolution", "aevah-data-flow-monitoring"]
  },
  {
    id: "modernization",
    label: "Migration and modernization",
    description:
      "Legacy data-platform moves, secure modernization, and specialized government or defense contexts.",
    slugs: [
      "aevah-automated-migration-tool",
      "government-defense-ai-data-modernization"
    ]
  },
  {
    id: "operations",
    label: "Workflow and operations",
    description:
      "Workflow automation, system connection, service operations, and process improvement.",
    slugs: ["automation-consulting-services"]
  },
  {
    id: "build",
    label: "Product, portal, and intelligent systems",
    description:
      "Delivery-ready planning, portals, custom software, embedded systems, and AI-enabled applications.",
    slugs: ["blueprint-studio", "product-development-intelligent-systems"]
  }
] as const;

export type OfferGroup = {
  id: string;
  label: string;
  description: string;
  products: KnowledgeItem[];
};

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

export function builderHref(opportunitySlug: string, contactSlug?: string) {
  const params = new URLSearchParams();

  if (opportunitySlug) {
    params.set("opportunity", opportunitySlug);
  }

  if (contactSlug) {
    params.set("contact", contactSlug);
  }

  const query = params.toString();
  return query ? `/briefs?${query}` : "/briefs";
}

export function customBriefHref(
  opportunitySlug: string,
  contactSlug: string,
  productSlugs: string[]
) {
  const params = new URLSearchParams();

  params.set("opportunity", opportunitySlug);

  if (contactSlug) {
    params.set("contact", contactSlug);
  }

  for (const slug of productSlugs) {
    params.append("offers", slug);
  }

  return `/briefs/preview/custom?${params.toString()}`;
}

export function productSelectionCue(product: KnowledgeItem) {
  const name = normalize(productName(product));

  if (name.includes("aevah mdm") || name.includes("golden record")) {
    return "Choose when the conversation needs trusted customer, account, asset, or entity records.";
  }

  if (name.includes("data flow")) {
    return "Choose when the stakeholder cares about operational visibility, data movement, reliability, or monitoring.";
  }

  if (name.includes("migration")) {
    return "Choose when legacy platform movement, mapping, modernization, or migration planning is part of the conversation.";
  }

  if (name.includes("semantic") || name.includes("agentic")) {
    return "Choose when enterprise AI agents need trusted semantic context, governed data, and reusable operating knowledge.";
  }

  if (name.includes("ai transformation")) {
    return "Choose when the audience needs AI strategy, prioritization, adoption planning, or executive alignment.";
  }

  if (name.includes("government") || name.includes("defense")) {
    return "Choose when the opportunity involves secure modernization, logistics intelligence, mission context, or defense-adjacent work.";
  }

  if (name.includes("product development")) {
    return "Choose when the conversation includes portals, applications, intelligent systems, or custom software delivery.";
  }

  if (name.includes("blueprint")) {
    return "Choose when the prospect needs requirements clarity, roadmap structure, delivery planning, or implementation readiness.";
  }

  if (name.includes("automation")) {
    return "Choose when the conversation centers on workflow handoffs, manual work, service operations, or process speed.";
  }

  return "Choose when the conversation centers on trusted data, operational visibility, AI-ready information, or enterprise intelligence.";
}

function defaultRecommendationReason(product: KnowledgeItem) {
  return productSelectionCue(product);
}

function productInterestBoost(product: KnowledgeItem, contact: KnowledgeItem) {
  const productSlug = product.slug;
  const productText = productSearchText(product);
  const contactText = getContactInsight(contact).searchText;
  let score = 0;

  if (/\b(data|client service|customer data|portal|ux|entity|record|mdm)\b/.test(contactText)) {
    if (
      [
        "aevah",
        "aevah-mdm-golden-record-entity-resolution",
        "aevah-data-flow-monitoring",
        "product-development-intelligent-systems"
      ].includes(productSlug)
    ) {
      score += 5;
    }
  }

  if (/\b(ai|agent|agentic|cyber|governance|security)\b/.test(contactText)) {
    if (
      [
        "ai-transformation-services",
        "aevah-ai-ready-data-agentic-semantic-layer",
        "aevah",
        "government-defense-ai-data-modernization"
      ].includes(productSlug)
    ) {
      score += 5;
    }
  }

  if (/\b(cto|technology|enterprise deployment|platform|architecture|migration)\b/.test(
    contactText
  )) {
    if (
      [
        "aevah",
        "aevah-automated-migration-tool",
        "blueprint-studio",
        "product-development-intelligent-systems"
      ].includes(productSlug)
    ) {
      score += 4;
    }
  }

  if (/\b(operations|workflow|process|service|follow-up|handoff|owner|coo)\b/.test(
    contactText
  )) {
    if (
      [
        "automation-consulting-services",
        "aevah",
        "blueprint-studio",
        "product-development-intelligent-systems"
      ].includes(productSlug)
    ) {
      score += 4;
    }
  }

  if (/\b(ceo|cfo|economic|executive|transformation|owner)\b/.test(contactText)) {
    if (["ai-transformation-services", "automation-consulting-services", "aevah"].includes(productSlug)) {
      score += 3;
    }
  }

  for (const token of contactText.split(/\s+/).filter((item) => item.length > 4)) {
    if (productText.includes(token)) {
      score += 1;
    }
  }

  return score;
}

function recommendationReason(
  product: KnowledgeItem,
  opportunity: KnowledgeItem,
  label: string,
  contact?: KnowledgeItem | null
) {
  const companyName = getString(opportunity.data, "company_name");
  const stage = getString(opportunity.data, "buying_cycle_stage", "");
  const positioning = sentenceFragment(
    getString(product.data, "primary_positioning", productName(product))
  );

  if (contact) {
    const insight = getContactInsight(contact);
    const descriptor = contactDescriptor(contact);
    const focus = insight.focusSummary || descriptor;

    if (label === "Stakeholder fit") {
      return `${insight.name}'s likely ${descriptor} perspective points to ${focus}. Include ${productName(product)} to support that part of the conversation.`;
    }
  }

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
  opportunity: KnowledgeItem | null,
  contact?: KnowledgeItem | null
): ProductRecommendation[] {
  if (!opportunity) {
    return getDefaultRecommendations(products);
  }

  const activeOpportunity = opportunity;
  const relatedProducts = getRelatedProducts(activeOpportunity);
  const primaryOffer = getString(activeOpportunity.data, "primary_offer", "");
  const secondaryOffers = getStrings(activeOpportunity.data, "secondary_offers");
  const scored = new Map<string, { product: KnowledgeItem; score: number; label: string }>();

  function score(product: KnowledgeItem | undefined, value: number, label: string) {
    if (!product) {
      return;
    }

    const existing = scored.get(product.slug);
    if (!existing || value > existing.score) {
      scored.set(product.slug, { product, score: value, label });
    }
  }

  score(
    relatedProducts.find((product) => matchesProductName(product, primaryOffer)) ??
      products.find((product) => matchesProductName(product, primaryOffer)),
    8,
    "Lead capability"
  );

  for (const product of relatedProducts) {
    const label = secondaryOffers.some((offer) => matchesProductName(product, offer))
      ? "Supporting capability"
      : "Opportunity fit";

    score(product, label === "Supporting capability" ? 6 : 5, label);
  }

  if (contact) {
    for (const product of products) {
      const value = productInterestBoost(product, contact);

      if (value > 0) {
        score(product, value + 5, "Stakeholder fit");
      }
    }
  }

  const stage = getString(activeOpportunity.data, "buying_cycle_stage", "");
  for (const product of products) {
    if (stage && getStrings(product.data, "best_fit_stages").includes(stage)) {
      score(product, 3, "Stage fit");
    }
  }

  return Array.from(scored.values())
    .sort((a, b) => b.score - a.score || productName(a.product).localeCompare(productName(b.product)))
    .slice(0, 4)
    .map(({ product, label }) => ({
      product,
      label,
      reason: recommendationReason(product, activeOpportunity, label, contact)
    }));
}

export function getOfferGroups(products: KnowledgeItem[]): OfferGroup[] {
  const remaining = new Map(products.map((product) => [product.slug, product]));
  const groups: OfferGroup[] = offerGroups
    .map((group) => {
      const groupProducts = group.slugs
        .map((slug) => {
          const product = remaining.get(slug);
          remaining.delete(slug);
          return product;
        })
        .filter((product): product is KnowledgeItem => Boolean(product));

      return {
        id: group.id,
        label: group.label,
        description: group.description,
        products: groupProducts
      };
    })
    .filter((group) => group.products.length > 0);

  if (remaining.size > 0) {
    groups.push({
      id: "additional",
      label: "Additional capabilities",
      description: "Other available Pruvida pages that can support a specialized conversation.",
      products: Array.from(remaining.values())
    });
  }

  return groups;
}
