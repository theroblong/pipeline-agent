import { notFound } from "next/navigation";

import { BriefDocument } from "@/components/brief-document";
import { PrintToolbar } from "@/components/print-toolbar";
import { getBriefProductBySlug, makeOfferBrief } from "@/lib/briefs";
import { getTitle } from "@/lib/content";
import { requireCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OfferBriefPreviewPage({ params }: PageProps) {
  await requireCurrentUser();
  const { slug } = await params;
  const product = getBriefProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const bundle = makeOfferBrief(product);

  return (
    <main className="brief-screen">
      <PrintToolbar title={`${getTitle(product)} brief`} />
      <BriefDocument bundle={bundle} />
    </main>
  );
}
