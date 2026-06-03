import { extractTextUnderHeading, getString } from "./content";
import type { KnowledgeItem } from "./types";

export type ContactInsight = {
  name: string;
  title: string;
  department: string;
  role: string;
  influence: string;
  position: string;
  concerns: string;
  successCriteria: string;
  focusSummary: string;
  searchText: string;
};

function cleanValue(value: string) {
  const cleaned = value
    .replace(/,\s*needs verification/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned && cleaned !== "unknown" ? cleaned : "";
}

function contactMarkdownField(contact: KnowledgeItem, label: string) {
  const pattern = new RegExp(`^-\\s*${label}:\\s*(.+)$`, "im");
  const match = contact.content.match(pattern);

  return cleanValue(match?.[1] ?? "");
}

function firstUseful(values: string[]) {
  return values.map(cleanValue).find(Boolean) ?? "";
}

export function getContactInsight(contact: KnowledgeItem): ContactInsight {
  const name = cleanValue(getString(contact.data, "full_name", contact.slug));
  const title = cleanValue(getString(contact.data, "title", ""));
  const department = cleanValue(getString(contact.data, "department", ""));
  const role = cleanValue(getString(contact.data, "role_in_opportunity", ""));
  const influence = cleanValue(getString(contact.data, "influence_level", ""));
  const position = contactMarkdownField(contact, "Position");
  const concerns = contactMarkdownField(contact, "Buying concerns");
  const successCriteria = contactMarkdownField(contact, "Success criteria");
  const summary = cleanValue(extractTextUnderHeading(contact.content, "Contact Summary"));
  const focusSummary = firstUseful([
    concerns,
    successCriteria,
    department,
    title,
    role,
    summary
  ]);
  const searchText = [
    name,
    title,
    department,
    role,
    influence,
    position,
    concerns,
    successCriteria,
    summary,
    contact.content
  ]
    .join(" ")
    .toLowerCase();

  return {
    name,
    title,
    department,
    role,
    influence,
    position,
    concerns,
    successCriteria,
    focusSummary,
    searchText
  };
}

export function contactDescriptor(contact: KnowledgeItem) {
  const insight = getContactInsight(contact);
  return firstUseful([insight.title, insight.department, insight.role, "stakeholder"]);
}
