import { AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { getString, getTitle } from "@/lib/content";
import { itemHref } from "@/lib/format";
import {
  getAccessibleOpportunities,
  getAccountById,
  getOpportunityCrmReadiness,
  getOpportunityRisks,
  getPacketsForOpportunity
} from "@/lib/pipeline";
import { requireCurrentUser } from "@/lib/session";
import type { KnowledgeItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const defaultBrandColor = "#236c57";

function getBrandColor(account: KnowledgeItem | undefined) {
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

function getBrandLogoText(account: KnowledgeItem | undefined, companyName: string) {
  const configured = getString(account?.data ?? {}, "brand_logo_text", "");

  return configured && configured !== "unknown"
    ? configured
    : getFallbackLogoText(companyName);
}

function getBrandLogoPath(account: KnowledgeItem | undefined) {
  const configured = getString(account?.data ?? {}, "brand_logo_path", "");

  return configured && configured !== "unknown" && configured.startsWith("/")
    ? configured
    : "";
}

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const opportunities = getAccessibleOpportunities(user);
  const packetItems = opportunities.flatMap((opportunity) =>
    getPacketsForOpportunity(getString(opportunity.data, "opportunity_id"))
  );
  const verificationBlockers = opportunities.flatMap((opportunity) =>
    getOpportunityRisks(opportunity)
      .filter((risk) => /verify|unverified|unknown|confirm/i.test(risk))
      .map((risk) => ({
        opportunity,
        risk
      }))
  );

  return (
    <AppShell user={user}>
      <header className="page-header">
        <div>
          <p className="eyebrow">Daily pursuit board</p>
          <h1>{user.displayName}&apos;s opportunity cockpit</h1>
          <p className="lede">
            A read-only working view of assigned pursuits, next actions, draft
            enablement, and CRM readiness from the local Pruvida knowledge base.
          </p>
        </div>
      </header>

      <section className="grid grid-3">
        <div className="metric-card">
          <strong>{opportunities.length}</strong>
          <span>active visible pursuits</span>
        </div>
        <div className="metric-card">
          <strong>{packetItems.length}</strong>
          <span>draft sales packets</span>
        </div>
        <div className="metric-card">
          <strong>{verificationBlockers.length}</strong>
          <span>verification blockers</span>
        </div>
      </section>

      <section className="section grid">
        <h2>Active Opportunities</h2>
        {opportunities.map((opportunity) => {
          const account = getAccountById(getString(opportunity.data, "account_id"));
          const companyName = getString(opportunity.data, "company_name");
          const brandColor = getBrandColor(account);
          const logoPath = getBrandLogoPath(account);
          const logoText = getBrandLogoText(account, companyName);
          const readiness = getOpportunityCrmReadiness(opportunity);
          const cardStyle = {
            "--opportunity-accent": brandColor
          } as CSSProperties;

          return (
            <article
              className="opportunity-card"
              key={opportunity.slug}
              style={cardStyle}
            >
              <div className="card-topline">
                <div className="opportunity-heading">
                  <span className="account-logo" aria-hidden="true">
                    {logoPath ? <img src={logoPath} alt="" /> : <span>{logoText}</span>}
                  </span>
                  <div>
                    <Link
                      className="card-title primary-link"
                      href={`/opportunities/${opportunity.slug}`}
                    >
                      {getTitle(opportunity)}
                    </Link>
                    <div className="card-meta">
                      {companyName} · owner {getString(opportunity.data, "owner")}
                    </div>
                  </div>
                </div>
                <div className="inline-list">
                  <Badge>{getString(opportunity.data, "pipeline_stage")}</Badge>
                  <Badge>{getString(opportunity.data, "position")}</Badge>
                  <Badge>{readiness.syncStatus}</Badge>
                </div>
              </div>
              <dl className="detail-list">
                <div className="detail-row">
                  <dt>Primary offer</dt>
                  <dd>{getString(opportunity.data, "primary_offer")}</dd>
                </div>
                <div className="detail-row">
                  <dt>Next action</dt>
                  <dd>{getString(opportunity.data, "next_action")}</dd>
                </div>
                <div className="detail-row">
                  <dt>Buying stage</dt>
                  <dd>{getString(opportunity.data, "buying_cycle_stage")}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </section>

      <section className="section grid grid-2">
        <div className="content-card">
          <h2>Ready Drafts</h2>
          <div className="stack">
            {packetItems.map((packet) => (
              <Link className="primary-link" href={itemHref(packet)} key={packet.slug}>
                {getTitle(packet)} <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            ))}
            {packetItems.length === 0 ? (
              <p className="muted">No prospect packets are visible yet.</p>
            ) : null}
          </div>
        </div>
        <div className="content-card">
          <h2>Verification Queue</h2>
          <div className="stack">
            {verificationBlockers.map(({ opportunity, risk }) => (
              <div className="card-meta" key={`${opportunity.slug}-${risk}`}>
                <AlertTriangle size={15} aria-hidden="true" />{" "}
                <Link className="primary-link" href={`/opportunities/${opportunity.slug}`}>
                  {getString(opportunity.data, "company_name")}
                </Link>
                : {risk}
              </div>
            ))}
            {verificationBlockers.length === 0 ? (
              <p className="muted">
                <CheckCircle2 size={15} aria-hidden="true" /> No verification
                blockers detected in visible opportunities.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
