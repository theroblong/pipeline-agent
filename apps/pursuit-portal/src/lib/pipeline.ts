import { canViewAccount, canViewOpportunity } from "@/lib/access";
import {
  extractBulletsUnderHeading,
  getString,
  getStrings,
  readMarkdownCollection,
  readMarkdownItem
} from "@/lib/content";
import type { KnowledgeItem, PortalUser } from "@/lib/types";

const stageOrder = [
  "lead-capture",
  "discovery",
  "solution-fit",
  "proposal",
  "negotiation-close",
  "onboarding",
  "recurring-success",
  "nurture",
  "closed-won",
  "closed-lost",
  "no-fit"
];

export function getAllOpportunities() {
  return readMarkdownCollection("opportunities");
}

export function getAccessibleOpportunities(user: PortalUser) {
  return getAllOpportunities()
    .filter((opportunity) => canViewOpportunity(user, opportunity))
    .sort((a, b) => {
      const aStage = stageOrder.indexOf(getString(a.data, "pipeline_stage"));
      const bStage = stageOrder.indexOf(getString(b.data, "pipeline_stage"));
      return (aStage === -1 ? 99 : aStage) - (bStage === -1 ? 99 : bStage);
    });
}

export function getAccessibleOpportunityBySlug(user: PortalUser, slug: string) {
  const opportunity = readMarkdownItem("opportunities", slug);

  if (!opportunity || !canViewOpportunity(user, opportunity)) {
    return null;
  }

  return opportunity;
}

export function getAccounts(user: PortalUser) {
  return readMarkdownCollection("accounts").filter((account) =>
    canViewAccount(user, account)
  );
}

export function getAccountById(accountId: string) {
  return readMarkdownCollection("accounts").find(
    (account) => account.data.account_id === accountId
  );
}

export function getContactsForAccount(accountId: string) {
  return readMarkdownCollection("contacts").filter(
    (contact) => contact.data.account_id === accountId
  );
}

export function getPackets() {
  return readMarkdownCollection("sales-enablement/prospect-packets");
}

export function getPacketsForOpportunity(opportunityId: string) {
  return getPackets().filter(
    (packet) => packet.data.opportunity_id === opportunityId
  );
}

export function getProducts() {
  return readMarkdownCollection("products");
}

export function getSalesEnablementMaterials() {
  return readMarkdownCollection("sales-enablement").filter(
    (item) => item.data.record_type !== "prospect-packet"
  );
}

export function getRelatedProducts(opportunity: KnowledgeItem) {
  const refs = getStrings(opportunity.data, "product_page_refs");
  const productSlugs = refs
    .map((ref) => ref.split("/").pop()?.replace(/\.md$/, ""))
    .filter(Boolean);
  const products = getProducts();

  return productSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is KnowledgeItem => Boolean(product));
}

export function getOpportunityRisks(opportunity: KnowledgeItem) {
  return extractBulletsUnderHeading(opportunity.content, "Risks");
}

export function getOpportunityCrmReadiness(opportunity: KnowledgeItem) {
  const missing = [
    ["hubspot_deal_id", "HubSpot deal ID"],
    ["estimated_value", "estimated value"],
    ["target_close_date", "target close date"],
    ["next_action_due", "next action due date"]
  ]
    .filter(([key]) => getString(opportunity.data, key) === "unknown")
    .map(([, label]) => label);

  const syncStatus = getString(opportunity.data, "crm_sync_status");

  return {
    syncStatus,
    ready: missing.length === 0 && syncStatus === "ready",
    missing
  };
}
