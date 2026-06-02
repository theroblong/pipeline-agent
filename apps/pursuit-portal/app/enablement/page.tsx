import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { getString, getTitle } from "@/lib/content";
import { itemHref } from "@/lib/format";
import {
  getAccessibleOpportunities,
  getPackets,
  getProducts,
  getSalesEnablementMaterials
} from "@/lib/pipeline";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function EnablementPage() {
  const user = await requireCurrentUser();
  const visibleOpportunityIds = new Set(
    getAccessibleOpportunities(user).map((opportunity) =>
      getString(opportunity.data, "opportunity_id")
    )
  );
  const packets = getPackets().filter((packet) =>
    visibleOpportunityIds.has(getString(packet.data, "opportunity_id"))
  );
  const products = getProducts();
  const materials = getSalesEnablementMaterials();

  return (
    <AppShell user={user}>
      <header className="page-header">
        <div>
          <p className="eyebrow">Sales enablement</p>
          <h1>Briefs, packets, and product positioning</h1>
          <p className="lede">
            Account-specific drafts are visible when tied to accessible
            opportunities. Product and standard enablement pages are available
            for approved sales users.
          </p>
        </div>
      </header>

      <section className="grid grid-3">
        <div className="metric-card">
          <strong>{packets.length}</strong>
          <span>prospect packets</span>
        </div>
        <div className="metric-card">
          <strong>{products.length}</strong>
          <span>product pages</span>
        </div>
        <div className="metric-card">
          <strong>{materials.length}</strong>
          <span>standard materials</span>
        </div>
      </section>

      <section className="section grid grid-2">
        <div className="content-card">
          <h2>Prospect Packets</h2>
          <div className="stack">
            {packets.map((packet) => (
              <Link className="primary-link" href={itemHref(packet)} key={packet.slug}>
                {getTitle(packet)} <Badge>{getString(packet.data, "status")}</Badge>
              </Link>
            ))}
          </div>
        </div>
        <div className="content-card">
          <h2>Standard Materials</h2>
          <div className="stack">
            {materials.map((material) => (
              <Link className="primary-link" href={itemHref(material)} key={material.slug}>
                {getTitle(material)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section content-card">
        <h2>Products And Services</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Offer</th>
                <th>Record type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.slug}>
                  <td>
                    <Link className="primary-link" href={itemHref(product)}>
                      {getTitle(product)}
                    </Link>
                  </td>
                  <td>{getString(product.data, "record_type")}</td>
                  <td>{getString(product.data, "status")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
