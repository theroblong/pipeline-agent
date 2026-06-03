import { redirect } from "next/navigation";

import { BriefDocument } from "@/components/brief-document";
import { PrintToolbar } from "@/components/print-toolbar";
import {
  getBriefContactForOpportunityBySlug,
  getBriefOpportunityBySlug,
  getProductsBySlugs,
  makeCustomOfferBundle,
  makeOpportunityBrief
} from "@/lib/briefs";
import { getString } from "@/lib/content";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    opportunity?: string;
    contact?: string;
    offers?: string | string[];
  }>;
};

function normalizeOffers(value?: string | string[]) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export default async function CustomBriefPreviewPage({ searchParams }: PageProps) {
  const user = await requireCurrentUser();
  const params = await searchParams;
  const offerSlugs = normalizeOffers(params.offers);
  const products = getProductsBySlugs(offerSlugs);
  const opportunity = params.opportunity
    ? getBriefOpportunityBySlug(user, params.opportunity)
    : null;
  const contact =
    opportunity && params.contact
      ? getBriefContactForOpportunityBySlug(opportunity, params.contact)
      : null;

  if (!opportunity && products.length === 0) {
    redirect("/briefs");
  }

  const bundle = opportunity
    ? makeOpportunityBrief(opportunity, products, contact)
    : makeCustomOfferBundle(products);

  return (
    <main className="brief-screen">
      <PrintToolbar
        title={
          opportunity
            ? `${getString(opportunity.data, "company_name")}${
                contact ? ` / ${getString(contact.data, "full_name")}` : ""
              } custom bundle`
            : "Custom offer bundle"
        }
      />
      <BriefDocument bundle={bundle} />
    </main>
  );
}
