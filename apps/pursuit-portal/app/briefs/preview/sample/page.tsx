import { BriefDocument } from "@/components/brief-document";
import { PrintToolbar } from "@/components/print-toolbar";
import { makeSampleBrief } from "@/lib/briefs";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SampleBriefPreviewPage() {
  await requireCurrentUser();
  const bundle = makeSampleBrief();

  return (
    <main className="brief-screen">
      <PrintToolbar title="Sample Pruvida one-pager format" />
      <BriefDocument bundle={bundle} />
    </main>
  );
}
