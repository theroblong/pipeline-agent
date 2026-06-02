import { notFound } from "next/navigation";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { MarkdownView } from "@/components/markdown-view";
import { getString, getTitle } from "@/lib/content";
import { itemHref, label } from "@/lib/format";
import {
  getAccessibleOpportunityBySlug,
  getAccountById,
  getContactsForAccount,
  getOpportunityCrmReadiness,
  getPacketsForOpportunity,
  getRelatedProducts
} from "@/lib/pipeline";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OpportunityPage({ params }: PageProps) {
  const user = await requireCurrentUser();
  const { slug } = await params;
  const opportunity = getAccessibleOpportunityBySlug(user, slug);

  if (!opportunity) {
    notFound();
  }

  const accountId = getString(opportunity.data, "account_id");
  const opportunityId = getString(opportunity.data, "opportunity_id");
  const account = getAccountById(accountId);
  const contacts = getContactsForAccount(accountId);
  const packets = getPacketsForOpportunity(opportunityId);
  const products = getRelatedProducts(opportunity);
  const crmReadiness = getOpportunityCrmReadiness(opportunity);

  return (
    <AppShell user={user}>
      <header className="page-header">
        <div>
          <p className="eyebrow">Opportunity</p>
          <h1>{getTitle(opportunity)}</h1>
          <p className="lede">
            {getString(opportunity.data, "company_name")} ·{" "}
            {getString(opportunity.data, "primary_offer")} ·{" "}
            {getString(opportunity.data, "owner")}
          </p>
        </div>
        <div className="inline-list">
          <Badge>{getString(opportunity.data, "pipeline_stage")}</Badge>
          <Badge>{getString(opportunity.data, "buying_cycle_stage")}</Badge>
          <Badge>{getString(opportunity.data, "position")}</Badge>
        </div>
      </header>

      <section className="grid grid-2">
        <div className="content-card">
          <h2>Next Move</h2>
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Action</dt>
              <dd>{getString(opportunity.data, "next_action")}</dd>
            </div>
            <div className="detail-row">
              <dt>Due</dt>
              <dd>{getString(opportunity.data, "next_action_due")}</dd>
            </div>
            <div className="detail-row">
              <dt>CRM status</dt>
              <dd>
                <Badge>{crmReadiness.syncStatus}</Badge>
              </dd>
            </div>
          </dl>
        </div>
        <div className="content-card">
          <h2>Related Assets</h2>
          <div className="stack">
            {packets.map((packet) => (
              <Link className="primary-link" href={itemHref(packet)} key={packet.slug}>
                {getTitle(packet)}
              </Link>
            ))}
            {products.map((product) => (
              <Link className="primary-link" href={itemHref(product)} key={product.slug}>
                {getTitle(product)}
              </Link>
            ))}
            {packets.length === 0 && products.length === 0 ? (
              <p className="muted">No related assets are linked yet.</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section grid grid-2">
        <div className="content-card">
          <h2>Stakeholders</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Influence</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.slug}>
                    <td>{getString(contact.data, "full_name")}</td>
                    <td>{getString(contact.data, "title")}</td>
                    <td>{getString(contact.data, "influence_level")}</td>
                  </tr>
                ))}
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={3}>No contact records linked yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
        <div className="content-card">
          <h2>Account Snapshot</h2>
          {account ? (
            <dl className="detail-list">
              <div className="detail-row">
                <dt>Company</dt>
                <dd>{getString(account.data, "company_name")}</dd>
              </div>
              <div className="detail-row">
                <dt>Industry</dt>
                <dd>{getString(account.data, "industry")}</dd>
              </div>
              <div className="detail-row">
                <dt>Status</dt>
                <dd>{getString(account.data, "status")}</dd>
              </div>
              <div className="detail-row">
                <dt>Website</dt>
                <dd>{label(account.data.website)}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted">No account record found for {accountId}.</p>
          )}
        </div>
      </section>

      <section className="section content-card">
        <MarkdownView content={opportunity.content} />
      </section>
    </AppShell>
  );
}
