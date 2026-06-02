import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { MarkdownView } from "@/components/markdown-view";
import { canViewEnablement } from "@/lib/access";
import { getString, getTitle, readMarkdownItem } from "@/lib/content";
import { getAccessibleOpportunities } from "@/lib/pipeline";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    section: string;
    slug: string;
  }>;
};

function getSectionDirectory(section: string) {
  if (section === "packets") {
    return "sales-enablement/prospect-packets";
  }

  if (section === "products") {
    return "products";
  }

  if (section === "materials") {
    return "sales-enablement";
  }

  return null;
}

export default async function EnablementDocumentPage({ params }: PageProps) {
  const user = await requireCurrentUser();
  const { section, slug } = await params;
  const directory = getSectionDirectory(section);

  if (!directory || !canViewEnablement(user)) {
    notFound();
  }

  const item = readMarkdownItem(directory, slug);

  if (!item) {
    notFound();
  }

  if (section === "packets") {
    const visibleOpportunityIds = new Set(
      getAccessibleOpportunities(user).map((opportunity) =>
        getString(opportunity.data, "opportunity_id")
      )
    );

    if (!visibleOpportunityIds.has(getString(item.data, "opportunity_id"))) {
      notFound();
    }
  }

  return (
    <AppShell user={user}>
      <header className="page-header">
        <div>
          <p className="eyebrow">{section}</p>
          <h1>{getTitle(item)}</h1>
          <p className="lede">
            {item.relativePath}
          </p>
        </div>
        <div className="inline-list">
          <Badge>{getString(item.data, "record_type")}</Badge>
          <Badge>{getString(item.data, "status")}</Badge>
        </div>
      </header>

      <section className="content-card">
        <MarkdownView content={item.content} />
      </section>
    </AppShell>
  );
}
