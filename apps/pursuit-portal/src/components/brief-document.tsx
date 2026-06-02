import type { BriefBundle, BriefCard } from "@/lib/briefs";
import type React from "react";

type BriefDocumentProps = {
  bundle: BriefBundle;
};

function chunkCards(cards: BriefCard[], size: number) {
  const chunks: BriefCard[][] = [];

  for (let index = 0; index < cards.length; index += size) {
    chunks.push(cards.slice(index, index + size));
  }

  return chunks.length > 0 ? chunks : [[]];
}

function Header({ tagline }: { tagline: string }) {
  return (
    <header className="brief-page-header">
      <div>
        <img
          className="brief-logo-image"
          src="/brief-assets/pruvida-logo.png"
          alt="Pruvida"
        />
        <div className="brief-tagline">{tagline}</div>
      </div>
      <div className="brief-urls">
        pruvida.com
        <br />
        aevah.com
        <br />
        yourblueprintstudio.com
      </div>
    </header>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="brief-section-block">
      <div className="brief-section-label">{children}</div>
      <div className="brief-section-rule" />
    </div>
  );
}

function OfferCard({ card }: { card: BriefCard }) {
  return (
    <div className="brief-platform-card">
      <div className="brief-platform-name">{card.title}</div>
      {card.url ? <div className="brief-platform-url">{card.url}</div> : null}
      {card.subtitle ? (
        <div className="brief-platform-type">{card.subtitle}</div>
      ) : null}
      <div className="brief-platform-copy">{card.body}</div>
      {card.stats.length > 0 ? (
        <div className="brief-mini-grid">
          {card.stats.slice(0, 4).map((stat) => (
            <div className="brief-mini-stat" key={`${stat.value}-${stat.label}`}>
              <div className="brief-mini-value">{stat.value}</div>
              <div className="brief-mini-label">{stat.label}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function BriefDocument({ bundle }: BriefDocumentProps) {
  const offerPages = chunkCards(bundle.offerCards, 2);

  return (
    <div className="brief-document" data-brief-title={bundle.title}>
      <div className="brief-page">
        <Header tagline={bundle.tagline} />

        <section className="brief-hero">
          <div className="brief-hero-copy-block">
            <div className="brief-hero-title">{bundle.heroTitle}</div>
            <div className="brief-hero-copy">{bundle.heroCopy}</div>

            <div className="brief-hero-core">
              <div className="brief-section-label">{bundle.coreLabel}</div>
              <div className="brief-section-rule" />
              <div className="brief-statement-head">{bundle.coreHead}</div>
              <div className="brief-statement-body">{bundle.coreBody}</div>
            </div>

            <div className="brief-hero-note">{bundle.note}</div>
          </div>

          <aside className="brief-hero-aside">
            <div className="brief-aside-label">{bundle.proofLabel}</div>
            <div className="brief-aside-headline">{bundle.proofHeadline}</div>
            <div className="brief-metric-grid">
              {bundle.metrics.slice(0, 3).map((metric) => (
                <div className="brief-metric" key={`${metric.value}-${metric.label}`}>
                  <div className="brief-metric-value">{metric.value}</div>
                  <div className="brief-metric-label">{metric.label}</div>
                </div>
              ))}
            </div>
            <div className="brief-metric-note">{bundle.metricNote}</div>
          </aside>
        </section>

        <section className="brief-content brief-content-page-one">
          <SectionLabel>{bundle.capabilityLabel}</SectionLabel>

          <div className="brief-cap-grid">
            {bundle.capabilities.slice(0, 6).map((card) => (
              <div className="brief-cap-card" key={`${card.title}-${card.body}`}>
                <div className="brief-cap-title">{card.title}</div>
                <div className="brief-cap-copy">{card.body}</div>
              </div>
            ))}
          </div>

          <SectionLabel>{bundle.processLabel}</SectionLabel>

          <div className="brief-process-grid">
            {bundle.process.slice(0, 3).map((card, index) => (
              <div className="brief-process-card" key={`${card.title}-${index}`}>
                <div className="brief-step-num">{index + 1}</div>
                <div className="brief-step-title">{card.title}</div>
                <div className="brief-step-copy">{card.body}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {offerPages.map((cards, pageIndex) => (
        <div className="brief-page" key={`offer-page-${pageIndex}`}>
          <Header
            tagline={
              pageIndex === 0
                ? "Platforms, delivery posture, and executive fit"
                : "Additional capabilities"
            }
          />

          <div className="brief-page-two-layout">
            <div className="brief-platforms-band">
              <div className="brief-section-label">
                {pageIndex === 0 ? bundle.detailLabel : "More Capabilities"}
              </div>
              <div className="brief-section-rule" />
              <div className="brief-platform-accent" />
            </div>

            <div className="brief-platforms-copy">{bundle.detailCopy}</div>

            <div className="brief-platforms-grid">
              {cards.map((card) => (
                <OfferCard card={card} key={card.title} />
              ))}
            </div>

            {pageIndex === offerPages.length - 1 ? (
              <div className="brief-page-two-bottom">
                <div className="brief-statement">
                  <div className="brief-section-label">The Work</div>
                  <div className="brief-section-rule" />
                  <div className="brief-statement-head">{bundle.workHead}</div>
                  <div className="brief-statement-body">{bundle.workBody}</div>
                </div>

                <div className="brief-statement">
                  <div className="brief-section-label">
                    {bundle.clientLabel ?? "Best Fit"}
                  </div>
                  <div className="brief-section-rule" />
                  <div className="brief-statement-head">{bundle.clientHead}</div>
                  <div className="brief-statement-body">{bundle.clientBody}</div>
                </div>
              </div>
            ) : null}
          </div>

          <footer className="brief-footer">
            <div className="brief-footer-left">
              <div className="brief-footer-note">{bundle.footerNote}</div>
            </div>
            <div className="brief-footer-right">
              pruvida.com
              <br />
              aevah.com
              <br />
              yourblueprintstudio.com
            </div>
          </footer>
        </div>
      ))}
    </div>
  );
}
