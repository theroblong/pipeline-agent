import fs from "fs";
import path from "path";

import type { Frontmatter, FrontmatterValue, KnowledgeItem } from "./types";

function findRepoRoot() {
  const candidates = [
    process.cwd(),
    path.resolve(process.cwd(), "../.."),
    path.resolve(process.cwd(), "../../..")
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "knowledge", "README.md"))) {
      return candidate;
    }
  }

  return path.resolve(process.cwd(), "../..");
}

export const repoRoot = process.env.REPO_ROOT ?? findRepoRoot();
export const knowledgeRoot =
  process.env.KNOWLEDGE_ROOT ?? path.join(repoRoot, "knowledge");

function parseScalar(value: string): FrontmatterValue {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (trimmed === "{}") {
    return {};
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  return trimmed.replace(/^["']|["']$/g, "");
}

export function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---")) {
    return { data: {}, content: raw.trim() };
  }

  const end = raw.indexOf("\n---", 3);

  if (end === -1) {
    return { data: {}, content: raw.trim() };
  }

  const frontmatter = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).trim();
  const data: Frontmatter = {};
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, value] = match;

    if (value === "") {
      const list: string[] = [];

      while (lines[index + 1]?.match(/^\s+-\s+/)) {
        index += 1;
        list.push(lines[index].replace(/^\s+-\s+/, "").trim());
      }

      data[key] = list.length > 0 ? list : "";
      continue;
    }

    data[key] = parseScalar(value);
  }

  return { data, content };
}

export function getString(
  data: Frontmatter,
  key: string,
  fallback = "unknown"
) {
  const value = data[key];

  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

export function getStrings(data: Frontmatter, key: string) {
  const value = data[key];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.length > 0) {
    return [value];
  }

  return [];
}

function toKnowledgeItem(filePath: string, relativePath: string): KnowledgeItem {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(raw);

  return {
    slug: path.basename(filePath, ".md"),
    filePath,
    relativePath,
    data: parsed.data,
    content: parsed.content
  };
}

export function readMarkdownCollection(relativeDir: string) {
  const absoluteDir = path.join(knowledgeRoot, relativeDir);

  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  return fs
    .readdirSync(absoluteDir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .sort()
    .map((file) =>
      toKnowledgeItem(
        path.join(absoluteDir, file),
        path.posix.join("knowledge", relativeDir, file)
      )
    );
}

export function readMarkdownItem(relativeDir: string, slug: string) {
  const filePath = path.join(knowledgeRoot, relativeDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return toKnowledgeItem(
    filePath,
    path.posix.join("knowledge", relativeDir, `${slug}.md`)
  );
}

export function extractBulletsUnderHeading(content: string, heading: string) {
  const lines = content.split(/\r?\n/);
  const headingLine = `## ${heading}`;
  const start = lines.findIndex((line) => line.trim() === headingLine);

  if (start === -1) {
    return [];
  }

  const bullets: string[] = [];

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (line.startsWith("## ")) {
      break;
    }

    if (line.startsWith("- ")) {
      bullets.push(line.slice(2).trim());
    }
  }

  return bullets;
}

export function extractTextUnderHeading(
  content: string,
  heading: string,
  level: 2 | 3 = 2
) {
  const lines = content.split(/\r?\n/);
  const headingLine = `${"#".repeat(level)} ${heading}`;
  const start = lines.findIndex((line) => line.trim() === headingLine);

  if (start === -1) {
    return "";
  }

  const stopPrefix = level === 2 ? "## " : "### ";
  const body: string[] = [];

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (line.startsWith(stopPrefix)) {
      break;
    }

    if (level === 3 && line.startsWith("## ")) {
      break;
    }

    if (!line || line.startsWith("|") || line.startsWith("- ")) {
      continue;
    }

    body.push(line.replace(/^#+\s*/, ""));
  }

  return body.join(" ").trim();
}

export function getTitle(item: KnowledgeItem) {
  const heading = item.content.match(/^#\s+(.+)$/m);
  return (
    getString(item.data, "opportunity_name", "") ||
    getString(item.data, "company_name", "") ||
    getString(item.data, "packet_name", "") ||
    heading?.[1] ||
    item.slug
  );
}
