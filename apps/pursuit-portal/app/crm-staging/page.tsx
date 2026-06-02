import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { getString } from "@/lib/content";
import {
  getAccessibleOpportunities,
  getAccountById,
  getOpportunityCrmReadiness
} from "@/lib/pipeline";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CrmStagingPage() {
  const user = await requireCurrentUser();
  const opportunities = getAccessibleOpportunities(user);

  return (
    <AppShell user={user}>
      <header className="page-header">
        <div>
          <p className="eyebrow">CRM staging</p>
          <h1>HubSpot-ready review queue</h1>
          <p className="lede">
            This view stages CRM-safe fields from the opportunity records. It
            does not sync anything; records stay local until a human marks them
            ready.
          </p>
        </div>
      </header>

      <section className="content-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Company</th>
                <th>Owner</th>
                <th>Stage</th>
                <th>Next activity</th>
                <th>CRM status</th>
                <th>Missing before ready</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opportunity) => {
                const account = getAccountById(getString(opportunity.data, "account_id"));
                const readiness = getOpportunityCrmReadiness(opportunity);

                return (
                  <tr key={opportunity.slug}>
                    <td>
                      <Link className="primary-link" href={`/opportunities/${opportunity.slug}`}>
                        {getString(opportunity.data, "opportunity_name")}
                      </Link>
                    </td>
                    <td>{getString(account?.data ?? {}, "company_name")}</td>
                    <td>{getString(opportunity.data, "owner")}</td>
                    <td>{getString(opportunity.data, "pipeline_stage")}</td>
                    <td>{getString(opportunity.data, "next_action")}</td>
                    <td>
                      <Badge>{readiness.syncStatus}</Badge>
                    </td>
                    <td>
                      {readiness.missing.length > 0
                        ? readiness.missing.join(", ")
                        : "No required gaps detected"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
