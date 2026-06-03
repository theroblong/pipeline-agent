#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const accountsDir = path.join(repoRoot, "knowledge", "accounts");
const publicRoot = path.join(repoRoot, "apps", "pursuit-portal", "public");
const logoDir = path.join(publicRoot, "account-logos");
const stagedLogoDir = path.join(logoDir, "_staged");
const defaultUserAgent =
  "PruvidaPipelineLogoStager/0.1 (+https://pruvida.com; brand asset review)";

const frontmatterOrder = [
  "record_type",
  "version",
  "account_id",
  "company_name",
  "status",
  "industry",
  "owner",
  "brand_color",
  "brand_logo_text",
  "brand_logo_path",
  "brand_logo_review_status",
  "brand_logo_candidate_path",
  "brand_logo_candidate_source_url",
  "brand_logo_source_url",
  "website",
  "linkedin",
  "hubspot_company_id",
  "external_crm_ids",
  "created_date",
  "last_interaction_date",
  "next_action",
  "next_action_due",
  "crm_sync_status",
  "last_updated"
];

function parseArgs(argv) {
  const args = {
    account: "",
    all: false,
    approve: false,
    approveStaged: false,
    dryRun: false,
    source: "",
    website: ""
  };

  for (const arg of argv) {
    if (arg === "--all") {
      args.all = true;
    } else if (arg === "--approve") {
      args.approve = true;
    } else if (arg === "--approve-staged") {
      args.approveStaged = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg.startsWith("--source=")) {
      args.source = arg.slice("--source=".length);
    } else if (arg.startsWith("--website=")) {
      args.website = arg.slice("--website=".length);
    } else if (!arg.startsWith("-") && !args.account) {
      args.account = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.all && !args.account) {
    throw new Error("Provide an account slug or --all.");
  }

  if (args.approve && args.approveStaged) {
    throw new Error("Use either --approve or --approve-staged, not both.");
  }

  return args;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function stripQuotes(value) {
  return value.trim().replace(/^["']|["']$/g, "");
}

function yamlValue(value) {
  if (!value || value === "unknown") {
    return "unknown";
  }

  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return `"${value}"`;
  }

  if (/^[A-Za-z0-9_./:@?&=%+#-]+$/.test(value)) {
    return value;
  }

  return JSON.stringify(value);
}

function readAccount(slug) {
  const filePath = path.join(accountsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Account not found: ${slug}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const end = raw.indexOf("\n---", 3);

  if (!raw.startsWith("---") || end === -1) {
    throw new Error(`Account file has no frontmatter: ${filePath}`);
  }

  const frontmatter = raw.slice(3, end).trim();
  const content = raw.slice(end + 4);
  const data = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (match) {
      data[match[1]] = stripQuotes(match[2]);
    }
  }

  return {
    content,
    data,
    filePath,
    frontmatter,
    raw,
    slug
  };
}

function writeAccount(account, fields, dryRun) {
  const lines = account.frontmatter.split(/\r?\n/);
  const lineForKey = new Map();

  lines.forEach((line, index) => {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*/);

    if (match) {
      lineForKey.set(match[1], index);
    }
  });

  for (const [key, value] of Object.entries(fields)) {
    const replacement = `${key}: ${yamlValue(value)}`;

    if (lineForKey.has(key)) {
      lines[lineForKey.get(key)] = replacement;
      continue;
    }

    const orderIndex = frontmatterOrder.indexOf(key);
    let insertAt = lines.length;

    for (let index = lines.length - 1; index >= 0; index -= 1) {
      const existingKey = lines[index].match(/^([A-Za-z0-9_-]+):\s*/)?.[1];
      const existingOrderIndex = frontmatterOrder.indexOf(existingKey);

      if (
        existingOrderIndex !== -1 &&
        (orderIndex === -1 || existingOrderIndex < orderIndex)
      ) {
        insertAt = index + 1;
        break;
      }
    }

    lines.splice(insertAt, 0, replacement);
    lineForKey.clear();
    lines.forEach((line, index) => {
      const match = line.match(/^([A-Za-z0-9_-]+):\s*/);

      if (match) {
        lineForKey.set(match[1], index);
      }
    });
  }

  const next = `---\n${lines.join("\n")}\n---${account.content}`;

  if (dryRun) {
    return next;
  }

  fs.writeFileSync(account.filePath, next);
  return next;
}

function normalizeUrl(value) {
  if (!value || value === "unknown") {
    return "";
  }

  try {
    return new URL(value).toString();
  } catch {
    return new URL(`https://${value}`).toString();
  }
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));

  return match?.[1] ?? "";
}

function resolveUrl(value, baseUrl) {
  if (!value || value.startsWith("data:")) {
    return "";
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    return await fetch(url, {
      ...options,
      headers: {
        "User-Agent": defaultUserAgent,
        ...(options.headers ?? {})
      },
      redirect: "follow",
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchText(url) {
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return {
    finalUrl: response.url,
    text: await response.text()
  };
}

function candidatesFromHtml(html, baseUrl) {
  const candidates = [];
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of linkTags) {
    const rel = getAttr(tag, "rel").toLowerCase();
    const href = resolveUrl(getAttr(tag, "href"), baseUrl);

    if (!href) {
      continue;
    }

    if (rel.includes("apple-touch-icon")) {
      candidates.push({ priority: 10, sourceUrl: href, type: "apple-touch-icon" });
    } else if (rel.includes("icon")) {
      candidates.push({ priority: 20, sourceUrl: href, type: "icon" });
    } else if (rel.includes("manifest")) {
      candidates.push({ priority: 30, sourceUrl: href, type: "manifest" });
    }
  }

  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const property = (
      getAttr(tag, "property") ||
      getAttr(tag, "name") ||
      ""
    ).toLowerCase();
    const content = resolveUrl(getAttr(tag, "content"), baseUrl);

    if (
      content &&
      ["og:image", "twitter:image", "twitter:image:src", "msapplication-tileimage"].includes(
        property
      )
    ) {
      candidates.push({ priority: 40, sourceUrl: content, type: property });
    }
  }

  return candidates;
}

async function expandManifestCandidates(candidate) {
  try {
    const { text, finalUrl } = await fetchText(candidate.sourceUrl);
    const manifest = JSON.parse(text);
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];

    return icons
      .map((icon) => ({
        priority: candidate.priority,
        size: String(icon.sizes ?? "")
          .split(/\s+/)
          .map((size) => Number(size.split("x")[0]))
          .filter(Number.isFinite)
          .sort((a, b) => b - a)[0] ?? 0,
        sourceUrl: resolveUrl(icon.src, finalUrl),
        type: "manifest-icon"
      }))
      .filter((icon) => icon.sourceUrl)
      .sort((a, b) => b.size - a.size);
  } catch {
    return [];
  }
}

function defaultCandidates(baseUrl) {
  const url = new URL(baseUrl);
  const origin = `${url.protocol}//${url.host}`;

  return [
    { priority: 50, sourceUrl: `${origin}/apple-touch-icon.png`, type: "default" },
    { priority: 60, sourceUrl: `${origin}/favicon.svg`, type: "default" },
    { priority: 70, sourceUrl: `${origin}/favicon.png`, type: "default" },
    { priority: 80, sourceUrl: `${origin}/favicon.ico`, type: "default" }
  ];
}

async function discoverCandidates(websiteUrl, sourceUrl) {
  if (sourceUrl) {
    return [{ priority: 0, sourceUrl, type: "explicit-source" }];
  }

  const { text, finalUrl } = await fetchText(websiteUrl);
  const rawCandidates = [
    ...candidatesFromHtml(text, finalUrl),
    ...defaultCandidates(finalUrl)
  ];
  const expanded = [];

  for (const candidate of rawCandidates) {
    if (candidate.type === "manifest") {
      expanded.push(...(await expandManifestCandidates(candidate)));
    } else {
      expanded.push(candidate);
    }
  }

  const seen = new Set();

  return expanded
    .sort((a, b) => a.priority - b.priority)
    .filter((candidate) => {
      if (seen.has(candidate.sourceUrl)) {
        return false;
      }

      seen.add(candidate.sourceUrl);
      return true;
    });
}

function extensionFromUrl(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase().replace(".", "");

  return ["png", "jpg", "jpeg", "svg", "webp", "ico"].includes(ext) ? ext : "";
}

function extensionFromContentType(contentType) {
  const normalized = contentType.toLowerCase().split(";")[0].trim();
  const map = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/webp": "webp",
    "image/x-icon": "ico",
    "image/vnd.microsoft.icon": "ico"
  };

  return map[normalized] ?? "";
}

async function downloadCandidate(candidate) {
  const response = await fetchWithTimeout(candidate.sourceUrl);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const extension =
    extensionFromContentType(contentType) || extensionFromUrl(response.url) || "png";

  if (!extensionFromContentType(contentType) && !extensionFromUrl(response.url)) {
    throw new Error(`Unsupported content type: ${contentType || "unknown"}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (buffer.length === 0) {
    throw new Error("Downloaded file was empty");
  }

  if (buffer.length > 2_000_000) {
    throw new Error(`Downloaded file is too large: ${buffer.length} bytes`);
  }

  return {
    buffer,
    extension,
    finalUrl: response.url
  };
}

function toPublicPath(filePath) {
  return `/${path.relative(publicRoot, filePath).split(path.sep).join("/")}`;
}

function publicPathToFilePath(publicPath) {
  if (!publicPath.startsWith("/account-logos/")) {
    throw new Error(`Unsupported logo path: ${publicPath}`);
  }

  const filePath = path.join(publicRoot, publicPath.slice(1));
  const resolved = path.resolve(filePath);

  if (!resolved.startsWith(path.resolve(logoDir))) {
    throw new Error(`Logo path resolves outside account logo directory: ${publicPath}`);
  }

  return resolved;
}

async function stageFromNetwork(account, args) {
  const websiteUrl = normalizeUrl(args.website || account.data.website);

  if (!websiteUrl && !args.source) {
    throw new Error(
      `${account.slug}: no website set. Add website: or pass --website=https://...`
    );
  }

  const candidates = await discoverCandidates(websiteUrl, normalizeUrl(args.source));
  const errors = [];

  for (const candidate of candidates) {
    try {
      const asset = await downloadCandidate(candidate);
      const targetDir = args.approve ? logoDir : stagedLogoDir;
      const target = path.join(targetDir, `${account.slug}.${asset.extension}`);
      const publicPath = toPublicPath(target);

      if (!args.dryRun) {
        fs.mkdirSync(targetDir, { recursive: true });
        fs.writeFileSync(target, asset.buffer);
      }

      writeAccount(
        account,
        args.approve
          ? {
              brand_logo_path: publicPath,
              brand_logo_review_status: "approved",
              brand_logo_candidate_path: "unknown",
              brand_logo_candidate_source_url: "unknown",
              brand_logo_source_url: asset.finalUrl,
              last_updated: today()
            }
          : {
              brand_logo_candidate_path: publicPath,
              brand_logo_candidate_source_url: asset.finalUrl,
              brand_logo_review_status: "pending-review",
              last_updated: today()
            },
        args.dryRun
      );

      return {
        account: account.slug,
        approved: args.approve,
        publicPath,
        sourceUrl: asset.finalUrl,
        type: candidate.type
      };
    } catch (error) {
      errors.push(`${candidate.sourceUrl}: ${error.message}`);
    }
  }

  throw new Error(`${account.slug}: no candidate logo downloaded.\n${errors.join("\n")}`);
}

function approveStaged(account, args) {
  const candidatePath = account.data.brand_logo_candidate_path;

  if (!candidatePath || candidatePath === "unknown") {
    throw new Error(`${account.slug}: no staged candidate path to approve.`);
  }

  const stagedFile = publicPathToFilePath(candidatePath);

  if (!fs.existsSync(stagedFile)) {
    throw new Error(`${account.slug}: staged file not found: ${candidatePath}`);
  }

  const approvedFile = path.join(logoDir, `${account.slug}${path.extname(stagedFile)}`);
  const approvedPublicPath = toPublicPath(approvedFile);
  const sourceUrl = account.data.brand_logo_candidate_source_url || "unknown";

  if (!args.dryRun) {
    fs.mkdirSync(logoDir, { recursive: true });
    fs.copyFileSync(stagedFile, approvedFile);
    fs.rmSync(stagedFile);
  }

  writeAccount(
    account,
    {
      brand_logo_path: approvedPublicPath,
      brand_logo_review_status: "approved",
      brand_logo_candidate_path: "unknown",
      brand_logo_candidate_source_url: "unknown",
      brand_logo_source_url: sourceUrl,
      last_updated: today()
    },
    args.dryRun
  );

  return {
    account: account.slug,
    approved: true,
    publicPath: approvedPublicPath,
    sourceUrl
  };
}

function accountSlugs(args) {
  if (!args.all) {
    return [args.account];
  }

  return fs
    .readdirSync(accountsDir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => path.basename(file, ".md"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const results = [];

  for (const slug of accountSlugs(args)) {
    const account = readAccount(slug);
    const result = args.approveStaged
      ? approveStaged(account, args)
      : await stageFromNetwork(account, args);

    results.push(result);
    console.log(
      `${result.approved ? "Approved" : "Staged"} ${result.account}: ${result.publicPath}`
    );
    console.log(`  source: ${result.sourceUrl}`);
  }

  if (args.dryRun) {
    console.log("Dry run complete; no files were written.");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
