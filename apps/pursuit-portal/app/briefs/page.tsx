import {
  CheckCircle2,
  FileText,
  Layers,
  PackageCheck,
  SlidersHorizontal
} from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import {
  builderHref,
  customBriefHref,
  getOfferGroups,
  getRecommendations,
  productName,
  productSelectionCue
} from "@/lib/brief-builder";
import { getBriefBuilderData } from "@/lib/briefs";
import { contactDescriptor, getContactInsight } from "@/lib/contact-insights";
import { getString, getStrings, getTitle } from "@/lib/content";
import { getContactsForAccount } from "@/lib/pipeline";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    opportunity?: string;
    contact?: string;
  }>;
};

export default async function BriefBuilderPage({ searchParams }: PageProps) {
  const user = await requireCurrentUser();
  const { opportunities, products } = getBriefBuilderData(user);
  const params = await searchParams;
  const requestedOpportunitySlug = params.opportunity ?? "";
  const selectedOpportunitySlug = opportunities.some(
    (opportunity) => opportunity.slug === requestedOpportunitySlug
  )
    ? requestedOpportunitySlug
    : "";
  const selectedOpportunity =
    opportunities.find((opportunity) => opportunity.slug === selectedOpportunitySlug) ??
    null;
  const selectedCompany = selectedOpportunity
    ? getString(selectedOpportunity.data, "company_name")
    : "";
  const contacts = selectedOpportunity
    ? getContactsForAccount(getString(selectedOpportunity.data, "account_id"))
    : [];
  const requestedContactSlug = params.contact ?? "";
  const selectedContactSlug = contacts.some(
    (contact) => contact.slug === requestedContactSlug
  )
    ? requestedContactSlug
    : "";
  const selectedContact =
    contacts.find((contact) => contact.slug === selectedContactSlug) ?? null;
  const selectedContactInsight = selectedContact
    ? getContactInsight(selectedContact)
    : null;
  const selectedContactDescriptor = selectedContact
    ? contactDescriptor(selectedContact)
    : "";
  const recommendations = getRecommendations(
    products,
    selectedOpportunity,
    selectedContact
  );
  const recommendedSlugs = new Set(
    recommendations.map((recommendation) => recommendation.product.slug)
  );
  const otherProducts = products.filter((product) => !recommendedSlugs.has(product.slug));
  const offerGroups = getOfferGroups(otherProducts);

  return (
    <AppShell user={user}>
      <header className="page-header">
        <div>
          <p className="eyebrow">Brief builder</p>
          <h1>Build client-ready PDF packets</h1>
          <p className="lede">
            Create prospect-facing one-pagers that help open a meeting, frame a
            useful business conversation, and show where Pruvida can help.
          </p>
        </div>
        <Link className="primary-button" href="/briefs/preview/sample">
          <FileText size={16} aria-hidden="true" />
          Preview sample
        </Link>
      </header>

      <section className="grid grid-3">
        <div className="metric-card">
          <strong>{opportunities.length}</strong>
          <span>opportunity bundles</span>
        </div>
        <div className="metric-card">
          <strong>{products.length}</strong>
          <span>standalone offer briefs</span>
        </div>
        <div className="metric-card">
          <strong>PDF</strong>
          <span>print-ready output</span>
        </div>
      </section>

      <section className="section builder-context-panel">
        <form className="builder-context-form" action="/briefs">
          <label>
            <span>Customer context</span>
            <select name="opportunity" defaultValue={selectedOpportunitySlug}>
              <option value="">General Pruvida capability packet</option>
              {opportunities.map((opportunity) => (
                <option value={opportunity.slug} key={opportunity.slug}>
                  {getString(opportunity.data, "company_name")} - {getTitle(opportunity)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Stakeholder</span>
            <select
              name="contact"
              defaultValue={selectedContactSlug}
              disabled={!selectedOpportunity}
            >
              <option value="">Opportunity-level brief</option>
              {contacts.map((contact) => {
                const insight = getContactInsight(contact);

                return (
                  <option value={contact.slug} key={contact.slug}>
                    {insight.name} - {contactDescriptor(contact)}
                  </option>
                );
              })}
            </select>
          </label>
          <button className="secondary-button" type="submit">
            <SlidersHorizontal size={16} aria-hidden="true" />
            View recommendations
          </button>
        </form>
      </section>

      {selectedOpportunity && contacts.length > 0 ? (
        <section className="section guided-builder-section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Stakeholder briefs</p>
              <h2>Briefs by contact</h2>
              <p className="lede">
                Each contact gets a starting packet shaped around their role,
                influence, and recorded areas of interest.
              </p>
            </div>
          </div>

          <div className="stakeholder-brief-grid">
            {contacts.map((contact) => {
              const insight = getContactInsight(contact);
              const contactRecommendations = getRecommendations(
                products,
                selectedOpportunity,
                contact
              );
              const href = customBriefHref(
                selectedOpportunity.slug,
                contact.slug,
                contactRecommendations.map((recommendation) => recommendation.product.slug)
              );

              return (
                <article className="stakeholder-brief-card" key={contact.slug}>
                  <div className="stakeholder-card-header">
                    <div>
                      <strong>{insight.name}</strong>
                      <span>{contactDescriptor(contact)}</span>
                    </div>
                    <div className="inline-list">
                      {insight.influence ? <Badge>{insight.influence}</Badge> : null}
                      {insight.role ? <Badge>{insight.role}</Badge> : null}
                    </div>
                  </div>
                  <p>{insight.focusSummary || "Use the opportunity-level context."}</p>
                  <div className="included-pill-list">
                    {contactRecommendations.map((recommendation) => (
                      <span key={recommendation.product.slug}>
                        {productName(recommendation.product)}
                      </span>
                    ))}
                  </div>
                  <div className="stakeholder-card-actions">
                    <Link className="primary-button" href={href}>
                      <FileText size={16} aria-hidden="true" />
                      Preview brief
                    </Link>
                    <Link
                      className="secondary-button"
                      href={builderHref(selectedOpportunitySlug, contact.slug)}
                    >
                      Customize
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <form className="brief-builder-form section" action="/briefs/preview/custom">
        {selectedOpportunitySlug ? (
          <input type="hidden" name="opportunity" value={selectedOpportunitySlug} />
        ) : null}
        {selectedContactSlug ? (
          <input type="hidden" name="contact" value={selectedContactSlug} />
        ) : null}

        <section className="guided-builder-section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Guided custom bundle</p>
              <h2>
                <CheckCircle2 size={18} aria-hidden="true" />
                {selectedContactInsight
                  ? `Recommended for ${selectedContactInsight.name}`
                  : selectedOpportunity
                  ? `Recommended for ${selectedCompany}`
                  : "Recommended starting points"}
              </h2>
              <p className="lede">
                {selectedContactInsight
                  ? `Start with the pages most aligned to ${selectedContactInsight.name}'s ${selectedContactDescriptor} perspective, then add stakeholder-specific capabilities below.`
                  : selectedOpportunity
                  ? `Start with the pages most aligned to ${selectedCompany}'s current opportunity, then add stakeholder-specific capabilities below.`
                  : "Start with the core Pruvida capabilities that cover most early executive conversations."}
              </p>
            </div>
            <button className="primary-button" type="submit">
              <FileText size={16} aria-hidden="true" />
              Preview selected PDF
            </button>
          </div>

          {selectedOpportunity ? (
            <article className="opportunity-brief-callout">
              <div>
                <strong>Complete opportunity brief</strong>
                <p>
                  Best first PDF for {selectedCompany}. It combines account context,{" "}
                  {getString(selectedOpportunity.data, "primary_offer")}, supporting
                  capabilities, and a focused working-session ask.
                  {selectedContactInsight
                    ? ` The selected custom bundle below is tuned for ${selectedContactInsight.name}.`
                    : ""}
                </p>
              </div>
              <Link
                className="secondary-button"
                href={`/briefs/preview/opportunity/${selectedOpportunity.slug}`}
              >
                <FileText size={16} aria-hidden="true" />
                Preview complete brief
              </Link>
            </article>
          ) : null}

          <div className="recommendation-grid">
            {recommendations.map((recommendation) => (
              <label
                className="recommendation-card"
                key={recommendation.product.slug}
              >
                <input
                  defaultChecked
                  type="checkbox"
                  name="offers"
                  value={recommendation.product.slug}
                />
                <span>
                  <span className="recommendation-card-header">
                    <strong>{productName(recommendation.product)}</strong>
                    <Badge>{recommendation.label}</Badge>
                  </span>
                  <span className="recommendation-reason">
                    {recommendation.reason}
                  </span>
                  <span className="card-meta">
                    {getString(
                      recommendation.product.data,
                      "primary_positioning",
                      getTitle(recommendation.product)
                    )}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="section guided-builder-section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Optional additions</p>
              <h2>
                <Layers size={18} aria-hidden="true" />
                Other options
              </h2>
              <p className="lede">
                Add pages when a stakeholder needs a different capability angle,
                buyer lens, or proof conversation.
              </p>
            </div>
          </div>

          <div className="offer-group-list">
            {offerGroups.map((group) => (
              <section className="offer-group" key={group.id}>
                <div className="offer-group-heading">
                  <h3>{group.label}</h3>
                  <p>{group.description}</p>
                </div>
                <div className="brief-choice-grid offer-option-grid">
                  {group.products.map((product) => (
                    <label className="brief-choice offer-option-card" key={product.slug}>
                      <input type="checkbox" name="offers" value={product.slug} />
                      <span>
                        <strong>{productName(product)}</strong>
                        <span>{productSelectionCue(product)}</span>
                        <span className="choice-meta">
                          {getString(product.data, "product_type", "capability")} ·{" "}
                          {getStrings(product.data, "target_buyers")
                            .slice(0, 3)
                            .join(" · ")}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {offerGroups.length === 0 ? (
            <p className="muted">The recommended pages already include every capability.</p>
          ) : null}
        </section>
      </form>

      <section className="section content-card">
        <h2>
          <PackageCheck size={18} aria-hidden="true" /> Complete Opportunity Brief
        </h2>
        <p className="lede">
          Best when a prospect needs a concise reason to meet: business context,
          solution focus, relevant Pruvida capabilities, and a clear working
          session ask.
        </p>
        <div className="table-scroll section">
          <table>
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Account</th>
                <th>Lead capability</th>
                <th>Position</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opportunity) => (
                <tr key={opportunity.slug}>
                  <td>{getTitle(opportunity)}</td>
                  <td>{getString(opportunity.data, "company_name")}</td>
                  <td>{getString(opportunity.data, "primary_offer")}</td>
                  <td>
                    <Badge>{getString(opportunity.data, "position")}</Badge>
                  </td>
                  <td>
                    <Link
                      className="primary-link"
                      href={`/briefs/preview/opportunity/${opportunity.slug}`}
                    >
                      Preview PDF
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section content-card">
        <h2>
          <Layers size={18} aria-hidden="true" /> Standalone Offer Briefs
        </h2>
        <div className="standalone-link-grid">
          {products.map((product) => (
            <Link
              className="primary-link"
              href={`/briefs/preview/offer/${product.slug}`}
              key={product.slug}
            >
              {getTitle(product)}
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
