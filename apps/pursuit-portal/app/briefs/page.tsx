import { FileText, Layers, PackageCheck, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { getBriefBuilderData } from "@/lib/briefs";
import { getString, getTitle } from "@/lib/content";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function BriefBuilderPage() {
  const user = await requireCurrentUser();
  const { opportunities, products } = getBriefBuilderData(user);

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

      <section className="section grid grid-2">
        <div className="content-card">
          <h2>
            <Layers size={18} aria-hidden="true" /> Standalone Offer Briefs
          </h2>
          <div className="stack">
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
        </div>

        <div className="content-card">
          <h2>
            <SlidersHorizontal size={18} aria-hidden="true" /> Custom Bundle
          </h2>
          <form className="brief-builder-form" action="/briefs/preview/custom">
            <label className="brief-choice">
              <span />
              <span>
                <strong>Optional opportunity context</strong>
                <select name="opportunity">
                  <option value="">No prospect-specific cover page</option>
                  {opportunities.map((opportunity) => (
                    <option value={opportunity.slug} key={opportunity.slug}>
                      {getString(opportunity.data, "company_name")} -{" "}
                      {getTitle(opportunity)}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <div className="brief-choice-grid">
              {products.map((product) => (
                <label className="brief-choice" key={product.slug}>
                  <input type="checkbox" name="offers" value={product.slug} />
                  <span>
                    <strong>{getTitle(product)}</strong>
                    <span>{getString(product.data, "primary_positioning")}</span>
                  </span>
                </label>
              ))}
            </div>

            <button className="primary-button" type="submit">
              <FileText size={16} aria-hidden="true" />
              Preview custom PDF
            </button>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
