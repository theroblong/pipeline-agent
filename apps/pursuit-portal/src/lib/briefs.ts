import {
  extractBulletsUnderHeading,
  extractTextUnderHeading,
  getString,
  getStrings,
  getTitle,
  readMarkdownItem
} from "@/lib/content";
import {
  getAccessibleOpportunities,
  getAccessibleOpportunityBySlug,
  getProducts,
  getRelatedProducts
} from "@/lib/pipeline";
import type { KnowledgeItem, PortalUser } from "@/lib/types";

export type BriefMetric = {
  value: string;
  label: string;
};

export type BriefCard = {
  title: string;
  subtitle?: string;
  url?: string;
  body: string;
  stats: BriefMetric[];
};

export type BriefBundle = {
  title: string;
  tagline: string;
  heroTitle: string;
  heroCopy: string;
  coreLabel: string;
  coreHead: string;
  coreBody: string;
  note: string;
  proofLabel: string;
  proofHeadline: string;
  metrics: BriefMetric[];
  metricNote: string;
  capabilityLabel: string;
  capabilities: BriefCard[];
  processLabel: string;
  process: BriefCard[];
  detailLabel: string;
  detailCopy: string;
  offerCards: BriefCard[];
  workHead: string;
  workBody: string;
  clientLabel?: string;
  clientHead: string;
  clientBody: string;
  footerNote: string;
};

function firstSentences(value: string, fallback: string, maxLength = 280) {
  const text = value.replace(/\s+/g, " ").trim() || fallback;

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function isKnowledgeItem(item: KnowledgeItem | null | undefined): item is KnowledgeItem {
  return Boolean(item);
}

function metricFromText(value: string, index: number): BriefMetric {
  return {
    value: index === 0 ? "Measure" : "Track",
    label: firstSentences(value, `Proof point ${index + 1}`, 58)
  };
}

function bulletsAsCards(bullets: string[], fallback: string[]): BriefCard[] {
  const source = bullets.length > 0 ? bullets : fallback;

  return source.slice(0, 6).map((bullet) => {
    const [title, ...rest] = bullet.split(":");
    return {
      title: firstSentences(title, bullet, 70),
      body: firstSentences(rest.join(":").trim(), bullet, 125),
      stats: []
    };
  });
}

function questionCards(questions: string[], fallback: string[]): BriefCard[] {
  const source = questions.length > 0 ? questions : fallback;

  return source.slice(0, 6).map((question) => ({
    title: firstSentences(question.replace(/\?$/, ""), question, 78),
    body: "Use this part of the conversation to identify scope, ownership, and measurable value.",
    stats: []
  }));
}

type SolutionPlaybook = {
  heroCopy: string;
  coreHead: string;
  coreBody: string;
  note: string;
  meetingGoal: string;
  sessionTopics: string[];
  workHead: string;
  workBody: string;
};

function solutionPlaybook(primaryOffer: string): SolutionPlaybook {
  const offer = primaryOffer.toLowerCase();

  if (offer.includes("automation")) {
    return {
      heroCopy:
        "Pruvida helps service and operations teams reduce manual handoffs, connect customer and workflow systems, and create more reliable follow-through across the customer lifecycle.",
      coreHead: "Turn customer operations into a more connected, measurable workflow.",
      coreBody:
        "The first conversation should focus on where automation, system connection, and better workflow visibility can improve speed, consistency, and customer experience.",
      note:
        "The conversation centers on one practical operating workflow that can be improved, measured, governed, and expanded across the customer lifecycle.",
      meetingGoal:
        "Identify one workflow where automation can improve follow-through, visibility, service speed, or team capacity.",
      sessionTopics: [
        "Map the customer journey from lead or service request through follow-up and resolution.",
        "Identify the systems that hold customer, service, asset, and workflow information.",
        "Select one workflow where automation can produce a measurable improvement.",
        "Define the data, access, owners, and success criteria needed for a practical first step.",
        "Choose the best next move: automation sprint, portal concept, data foundation, or scoped pilot.",
        "Outline a short path from working session to pilot scope."
      ],
      workHead: "Start with one workflow that is worth making more reliable.",
      workBody:
        "Pruvida can help map the current customer operation, identify automation opportunities, and shape a practical next step that improves visibility, consistency, or service responsiveness."
    };
  }

  if (offer.includes("aevah")) {
    return {
      heroCopy:
        "Pruvida helps organizations turn fragmented data and operational knowledge into trusted, AI-ready operating capability while preserving continuity across existing systems.",
      coreHead: "Create a trusted operating layer for better decisions and faster execution.",
      coreBody:
        "The first conversation should focus on the data domains, workflows, and decisions where trusted information can improve speed, visibility, and confidence.",
      note:
        "Aevah is most useful when the business needs governed data products, operational intelligence, entity consistency, or AI-ready context across existing systems.",
      meetingGoal:
        "Identify one data domain or operational workflow where trusted data can improve speed, visibility, confidence, or execution.",
      sessionTopics: [
        "Select the business decision or workflow that would benefit most from trusted data.",
        "Identify the systems, data owners, and operational teams involved.",
        "Clarify what trusted, governed, AI-ready information needs to look like.",
        "Define the first measurable data product, entity model, or operating view.",
        "Map the security, governance, and deployment constraints that matter.",
        "Outline a narrow pilot path that proves value within existing operating constraints."
      ],
      workHead: "Start with one trusted data product or operating view.",
      workBody:
        "Pruvida can help identify the right first data domain, define success criteria, and show how Aevah can create reusable operating capability across existing systems."
    };
  }

  if (offer.includes("blueprint")) {
    return {
      heroCopy:
        "Pruvida helps teams convert business intent into delivery-ready requirements, product decisions, roadmaps, and implementation artifacts.",
      coreHead: "Move from idea to buildable plan with less ambiguity.",
      coreBody:
        "The first conversation should focus on the initiative, decisions, workflows, and artifacts needed to move from intent to execution.",
      note:
        "Blueprint Studio is useful when alignment, requirements clarity, product planning, or implementation readiness is the first blocker.",
      meetingGoal:
        "Identify the initiative and decisions that need to become a delivery-ready plan.",
      sessionTopics: [
        "Clarify the business objective and users involved.",
        "Identify the decisions, workflows, and requirements that are currently unclear.",
        "Determine which artifacts would accelerate alignment and execution.",
        "Define the implementation path, owners, and working cadence.",
        "Map the risks that need architecture, product, or delivery sign-off.",
        "Outline a short sprint to produce usable planning and delivery artifacts."
      ],
      workHead: "Start by turning intent into usable delivery artifacts.",
      workBody:
        "Pruvida can help convert strategic or operational intent into requirements, plans, and implementation-ready artifacts that teams can act on."
    };
  }

  return {
    heroCopy:
      "Pruvida helps teams turn AI, data, automation, and product ideas into practical operating capability with a clear path from conversation to execution.",
    coreHead: "Move from possibility to a practical first step.",
    coreBody:
      "The first conversation should focus on the business outcome, the workflow or decision involved, and the smallest credible path to measurable value.",
    note:
      "Pruvida brings strategy, platform knowledge, and delivery discipline together so teams can choose a useful starting point.",
    meetingGoal:
      "Identify one practical starting point where Pruvida can help improve speed, visibility, trust, or execution.",
    sessionTopics: [
      "Clarify the business outcome that matters most.",
      "Identify the workflow, data, systems, and decision owners involved.",
      "Select the capability that best fits the starting point.",
      "Define what a successful first step would need to prove.",
      "Map constraints, owners, and near-term next actions.",
      "Outline a path from working session to assessment, pilot, or scope."
    ],
    workHead: "Start where the business outcome is clearest.",
    workBody:
      "Pruvida can help narrow a broad conversation into one practical initiative with clear owners, proof criteria, and delivery path."
  };
}

function productUrl(product: KnowledgeItem) {
  const name = getString(product.data, "product_name", product.slug).toLowerCase();

  if (name.includes("aevah")) {
    return "aevah.com";
  }

  if (name.includes("blueprint")) {
    return "yourblueprintstudio.com";
  }

  return "pruvida.com";
}

function productSummary(product: KnowledgeItem) {
  return firstSentences(
    extractTextUnderHeading(product.content, "Product Summary"),
    getString(product.data, "primary_positioning", getTitle(product)),
    330
  );
}

function customerPositioning(product: KnowledgeItem) {
  return firstSentences(
    extractTextUnderHeading(product.content, "Customer-Facing Positioning", 3),
    getString(product.data, "primary_positioning", productSummary(product)),
    280
  );
}

export function productToBriefCard(product: KnowledgeItem): BriefCard {
  const metrics =
    extractBulletsUnderHeading(product.content, "Recommended Metrics")
      .slice(0, 4)
      .map(metricFromText);
  const outcomes = extractBulletsUnderHeading(product.content, "Outcomes And Value");

  return {
    title: getString(product.data, "product_name", getTitle(product)),
    subtitle: getString(product.data, "primary_positioning", ""),
    url: productUrl(product),
    body: customerPositioning(product),
    stats:
      metrics.length > 0
        ? metrics
        : outcomes.slice(0, 4).map((outcome, index) => ({
            value: index === 0 ? "Outcome" : "Value",
            label: firstSentences(outcome, `Outcome ${index + 1}`, 52)
          }))
  };
}

function processCards(): BriefCard[] {
  return [
    {
      title: "Pinpoint",
      body: "Align on the business problem, source systems, decision owners, and highest-value starting point.",
      stats: []
    },
    {
      title: "Prove",
      body: "Shape a narrow pilot or discovery sprint that proves value while preserving operating continuity.",
      stats: []
    },
    {
      title: "Scale",
      body: "Turn the validated use case into a governed operating capability with expansion paths.",
      stats: []
    }
  ];
}

export function makeSampleBrief(): BriefBundle {
  const products = getProducts();
  const aevah =
    products.find((product) => product.slug === "aevah") ??
    readMarkdownItem("products", "aevah");
  const blueprint =
    products.find((product) => product.slug === "blueprint-studio") ??
    readMarkdownItem("products", "blueprint-studio");

  return {
    title: "Pruvida | Enterprise AI Strategy And Transformation",
    tagline: "Enterprise AI Strategy and Transformation",
    heroTitle: "AI is now an operating decision.",
    heroCopy:
      "Pruvida advises executives making the shift from AI as a tooling decision to AI as an operating model, and operates the platforms that turn strategy into governed enterprise capability.",
    coreLabel: "Core Problem",
    coreHead: "Most AI programs are stalling on operating model, not technology.",
    coreBody:
      "The enterprises pulling ahead are redesigning workflows, decision rights, and accountability, not just adding tools.",
    note:
      "That is the shift Pruvida is built to lead: strategy, platforms, and delivery discipline working together.",
    proofLabel: "Proof Point",
    proofHeadline:
      "Fortune 100 global logistics enterprise. Advisory and implementation delivered with a total investment under $500K, pilot to production in under 90 days, and $20M per year in engineering capacity gained.",
    metrics: [
      { value: "< $500K", label: "Total investment" },
      { value: "< 90 days", label: "Pilot to production" },
      { value: "$20M/yr", label: "Engineering capacity gained" }
    ],
    metricNote:
      "Built with Aevah and Blueprint Studio. Board-defensible outcomes, delivered on existing systems.",
    capabilityLabel: "What Pruvida Operates",
    capabilities: [
      {
        title: "Enterprise AI Strategy",
        body: "Executive framing and roadmap design.",
        stats: []
      },
      {
        title: "AI Adoption and Operationalization",
        body: "Move from pilots to durable use.",
        stats: []
      },
      {
        title: "Agentic AI Systems",
        body: "Systems that take work off the queue.",
        stats: []
      },
      {
        title: "Human + AI Operating Models",
        body: "Decision rights and accountability at scale.",
        stats: []
      },
      {
        title: "AI Governance and Responsible AI",
        body: "Controls that keep scale board-defensible.",
        stats: []
      },
      {
        title: "Workflow Transformation and Operational Intelligence",
        body: "Redesign the work, not just the stack.",
        stats: []
      }
    ],
    processLabel: "How It Works",
    process: processCards(),
    detailLabel: "The Platforms",
    detailCopy:
      "The platform stack is the proof architecture behind the advisory. It shows how Pruvida turns strategy into operating capability while preserving continuity across existing systems.",
    offerCards: [aevah, blueprint]
      .filter(isKnowledgeItem)
      .map((product) => productToBriefCard(product)),
    workHead: "Premium strategy work, delivered with operational discipline.",
    workBody:
      "The point of the offer is converting executive intent into governed delivery with enough rigor to earn trust and enough speed to matter in the market.",
    clientLabel: "The Clients",
    clientHead:
      "Large Enterprise · Regulated Industries · Defense and Defense-Adjacent · High-Velocity Innovation Teams",
    clientBody:
      "Retail, food and beverage, energy, industrial, consumer goods, aerospace, government.",
    footerNote:
      "Engagements across multiple operating environments. Client identities held in confidence."
  };
}

export function makeOfferBrief(product: KnowledgeItem): BriefBundle {
  const pains = extractBulletsUnderHeading(product.content, "Pain Signals");
  const outcomes = extractBulletsUnderHeading(product.content, "Outcomes And Value");
  const operatingPriorities = outcomes.length > 0 ? outcomes : pains;
  const metrics =
    extractBulletsUnderHeading(product.content, "Recommended Metrics")
      .slice(0, 3)
      .map(metricFromText);

  return {
    title: `${getString(product.data, "product_name", getTitle(product))} | Pruvida Brief`,
    tagline: "Pruvida executive brief",
    heroTitle: getString(product.data, "product_name", getTitle(product)),
    heroCopy: customerPositioning(product),
    coreLabel: "Executive Priority",
    coreHead: firstSentences(
      operatingPriorities[0],
      getString(product.data, "primary_positioning")
    ),
    coreBody: firstSentences(
      operatingPriorities.slice(1, 4).join(" "),
      productSummary(product),
      330
    ),
    note: `A focused working session can determine whether this is the right starting point for ${getString(
      product.data,
      "primary_positioning",
      "a clear business problem"
    )}.`,
    proofLabel: "Target Outcomes",
    proofHeadline: firstSentences(outcomes.join(" "), productSummary(product), 250),
    metrics:
      metrics.length > 0
        ? metrics
        : [
            { value: "Speed", label: "Faster path to value" },
            { value: "Trust", label: "Cleaner operating confidence" },
            { value: "Scale", label: "Reusable capability" }
          ],
    metricNote:
      "The strongest first step is a scoped conversation around one measurable workflow, data domain, or decision point.",
    capabilityLabel: "Operating Outcomes",
    capabilities: bulletsAsCards(operatingPriorities, [
      getString(product.data, "primary_positioning", productSummary(product))
    ]),
    processLabel: "How To Start",
    process: processCards(),
    detailLabel: "How Pruvida Helps",
    detailCopy:
      "Pruvida helps teams move from executive priority to a defined starting point, clear proof criteria, and a path to delivery.",
    offerCards: [productToBriefCard(product)],
    workHead: "Start with one measurable business outcome.",
    workBody:
      "The most productive conversation usually begins with a specific workflow, data domain, or decision point where value can be proven quickly.",
    clientLabel: "Best Fit",
    clientHead: getStrings(product.data, "target_buyers").slice(0, 6).join(" · "),
    clientBody: getStrings(product.data, "common_pain_signals").slice(0, 8).join(", "),
    footerNote:
      "To explore fit, schedule a focused working session with Pruvida."
  };
}

export function makeOpportunityBrief(
  opportunity: KnowledgeItem,
  selectedProducts?: KnowledgeItem[]
): BriefBundle {
  const relatedProducts =
    selectedProducts && selectedProducts.length > 0
      ? selectedProducts
      : getRelatedProducts(opportunity);
  const accountName = getString(opportunity.data, "company_name");
  const primaryOffer = getString(opportunity.data, "primary_offer");
  const playbook = solutionPlaybook(primaryOffer);
  const prospectPositioning = extractTextUnderHeading(
    opportunity.content,
    "Prospect-Facing Positioning"
  );
  const conversationFocus = extractBulletsUnderHeading(
    opportunity.content,
    "Conversation Focus"
  );

  return {
    title: `${accountName} | ${getString(opportunity.data, "opportunity_name")}`,
    tagline: `${accountName} executive conversation brief`,
    heroTitle: getString(opportunity.data, "opportunity_name", accountName),
    heroCopy: firstSentences(prospectPositioning, playbook.heroCopy, 360),
    coreLabel: "Solution Focus",
    coreHead: playbook.coreHead,
    coreBody: playbook.coreBody,
    note: playbook.note,
    proofLabel: "Meeting Goal",
    proofHeadline: playbook.meetingGoal,
    metrics: [
      { value: "45-60 min", label: "Focused working session" },
      {
        value: "1 use case",
        label: "Clear starting point"
      },
      {
        value: "90 days",
        label: "Pilot path after fit"
      }
    ],
    metricNote:
      `This conversation draws on ${primaryOffer}${
        getStrings(opportunity.data, "secondary_offers").length > 0
          ? ` plus ${getStrings(opportunity.data, "secondary_offers")
              .slice(0, 2)
              .join(" and ")}`
          : ""
      }.`,
    capabilityLabel: "What The Session Can Cover",
    capabilities: questionCards(conversationFocus, playbook.sessionTopics),
    processLabel: "Recommended Flow",
    process: processCards(),
    detailLabel: "Relevant Pruvida Capabilities",
    detailCopy:
      "The following Pruvida capabilities support an executive conversation around the strongest starting point and a useful next step.",
    offerCards: relatedProducts.map(productToBriefCard),
    workHead: playbook.workHead,
    workBody: playbook.workBody,
    clientLabel: "Suggested Meeting",
    clientHead: "Business owner · Technology/data owner · Process owner",
    clientBody: `A productive first conversation should confirm the current workflow, systems involved, value at stake, and what ${accountName} would need to see before moving forward.`,
    footerNote:
      "Pruvida helps organizations turn AI, data, and automation ideas into practical operating capability."
  };
}

export function makeCustomOfferBundle(products: KnowledgeItem[]): BriefBundle {
  const primary = products[0];
  const names = products
    .map((product) => getString(product.data, "product_name", getTitle(product)))
    .join(", ");

  return {
    title: `Pruvida Capability Brief | ${names}`,
    tagline: "Pruvida capability brief",
    heroTitle: "Focused capabilities for the conversation ahead.",
    heroCopy:
      "This brief highlights the Pruvida capabilities most relevant to a practical conversation about AI, data, workflow, and operating improvement.",
    coreLabel: "Conversation Focus",
    coreHead: "Start with the business outcome, then choose the right capability.",
    coreBody:
      "A useful first meeting should clarify the priority operating outcome, systems involved, decision owners, and smallest credible path to measurable value.",
    note:
      "Pruvida helps teams connect strategy, platforms, and delivery so the conversation can move from possibility to practical next step.",
    proofLabel: "Selected Capabilities",
    proofHeadline: `${products.length} Pruvida capability${
      products.length === 1 ? "" : "ies"
    } to support a focused executive or operational discussion.`,
    metrics: [
      { value: String(products.length), label: "Relevant capabilities" },
      { value: "1 meeting", label: "Clarify fit and priority" },
      { value: "1 next step", label: "Define a practical path" }
    ],
    metricNote:
      "The objective is a focused executive conversation about measurable business improvement and the right operating capability to pursue first.",
    capabilityLabel: "Conversation Anchors",
    capabilities: products.slice(0, 6).map((product) => ({
      title: getString(product.data, "product_name", getTitle(product)),
      body: firstSentences(
        getString(product.data, "primary_positioning", productSummary(product)),
        productSummary(product),
        130
      ),
      stats: []
    })),
    processLabel: "Recommended Flow",
    process: processCards(),
    detailLabel: "Selected Capabilities",
    detailCopy:
      "Each page is designed to support a focused business conversation and help determine whether a deeper working session is worthwhile.",
    offerCards: products.map(productToBriefCard),
    workHead: "A smaller, more relevant conversation is usually stronger.",
    workBody:
      "The best first meeting focuses on the one or two capabilities that map directly to the prospect's current business pressure.",
    clientLabel: "Best Starting Point",
    clientHead: primary
      ? getString(primary.data, "product_name", getTitle(primary))
      : "Pruvida capability discussion",
    clientBody: primary
      ? getString(primary.data, "primary_positioning", productSummary(primary))
      : "Select at least one capability to build a focused brief.",
    footerNote:
      "To explore fit, schedule a focused working session with Pruvida."
  };
}

export function getBriefProductBySlug(slug: string) {
  return readMarkdownItem("products", slug);
}

export function getBriefOpportunityBySlug(user: PortalUser, slug: string) {
  return getAccessibleOpportunityBySlug(user, slug);
}

export function getProductsBySlugs(slugs: string[]) {
  const normalized = new Set(slugs.filter(Boolean));
  return getProducts().filter((product) => normalized.has(product.slug));
}

export function getBriefBuilderData(user: PortalUser) {
  return {
    opportunities: getAccessibleOpportunities(user),
    products: getProducts()
  };
}
