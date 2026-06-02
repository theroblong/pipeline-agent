import { notFound } from "next/navigation";

import { BriefDocument } from "@/components/brief-document";
import { PrintToolbar } from "@/components/print-toolbar";
import { getBriefOpportunityBySlug, makeOpportunityBrief } from "@/lib/briefs";
import { getString } from "@/lib/content";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OpportunityBriefPreviewPage({ params }: PageProps) {
  const user = await requireCurrentUser();
  const { slug } = await params;
  const opportunity = getBriefOpportunityBySlug(user, slug);

  if (!opportunity) {
    notFound();
  }

  const bundle = makeOpportunityBrief(opportunity);

  return (
    <main className="brief-screen">
      <PrintToolbar
        title={`${getString(opportunity.data, "company_name")} opportunity brief`}
      />
      <BriefDocument bundle={bundle} />
    </main>
  );
}
